import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

export type VerificationType = 'EMAIL_VERIFICATION' | 'PASSWORD_RESET' | 'EMAIL_CHANGE'

export interface EmailVerificationToken {
  id: string
  email: string
  userId?: string
  type: VerificationType
  expiresAt: Date
}

export interface JWTTokenPayload {
  id: string
  email: string
  userId?: string
  type: VerificationType
  exp: number
}

export interface TokenGenerationResult {
  token: string
  expiresAt: Date
  success: boolean
}

export class TokenService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key'
  private static readonly TOKEN_EXPIRY_HOURS = 24

  /**
   * Generate secure email verification token
   */
  static async generateEmailVerificationToken(
    email: string, 
    userId?: string
  ): Promise<TokenGenerationResult> {
    try {
      const tokenId = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + this.TOKEN_EXPIRY_HOURS)

      // Create JWT token with embedded verification data
      const tokenPayload = {
        id: tokenId,
        email,
        userId,
        type: 'EMAIL_VERIFICATION',
        exp: Math.floor(expiresAt.getTime() / 1000)
      }

      const token = jwt.sign(tokenPayload, this.JWT_SECRET)

      // Store verification record in database
      await prisma.emailVerification.create({
        data: {
          id: tokenId,
          token,
          email,
          userId,
          type: 'EMAIL_VERIFICATION',
          expiresAt,
          isUsed: false
        }
      })

      return {
        token,
        expiresAt,
        success: true
      }
    } catch (error) {
      console.error('Error generating email verification token:', error)
      throw new Error('Failed to generate verification token')
    }
  }

  /**
   * Validate and decode email verification token
   */
  static async validateEmailToken(token: string): Promise<{
    isValid: boolean
    data?: EmailVerificationToken
    error?: string
  }> {
    try {
      // Verify JWT token first
      const decoded = jwt.verify(token, this.JWT_SECRET) as JWTTokenPayload
      
      // Check if token exists in database and is not used
      const verificationRecord = await prisma.emailVerification.findFirst({
        where: {
          id: decoded.id,
          token,
          isUsed: false,
          expiresAt: {
            gt: new Date()
          }
        }
      })

      if (!verificationRecord) {
        return {
          isValid: false,
          error: 'Token not found, expired, or already used'
        }
      }

      return {
        isValid: true,
        data: {
          id: verificationRecord.id,
          email: verificationRecord.email,
          userId: verificationRecord.userId || undefined,
          type: verificationRecord.type as VerificationType,
          expiresAt: verificationRecord.expiresAt
        }
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          isValid: false,
          error: 'Token has expired'
        }
      }
      
      if (error instanceof jwt.JsonWebTokenError) {
        return {
          isValid: false,
          error: 'Invalid token format'
        }
      }

      console.error('Token validation error:', error)
      return {
        isValid: false,
        error: 'Token validation failed'
      }
    }
  }

  /**
   * Mark token as used and complete verification
   */
  static async completeEmailVerification(tokenId: string): Promise<{
    success: boolean
    userId?: string
    error?: string
  }> {
    try {
      // Update token as used
      const updatedToken = await prisma.emailVerification.update({
        where: { id: tokenId },
        data: { isUsed: true, usedAt: new Date() }
      })

      // If user verification, update user email verification status
      if (updatedToken.userId) {
        await prisma.user.update({
          where: { id: updatedToken.userId },
          data: { emailVerified: new Date() }
        })
      }

      return {
        success: true,
        userId: updatedToken.userId || undefined
      }
    } catch (error) {
      console.error('Error completing email verification:', error)
      return {
        success: false,
        error: 'Failed to complete verification'
      }
    }
  }

  /**
   * Generate password reset token
   */
  static async generatePasswordResetToken(email: string): Promise<TokenGenerationResult> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })

      if (!user) {
        throw new Error('User not found')
      }

      const tokenId = crypto.randomUUID()
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 2) // Password reset expires in 2 hours

      const tokenPayload = {
        id: tokenId,
        email,
        userId: user.id,
        type: 'PASSWORD_RESET',
        exp: Math.floor(expiresAt.getTime() / 1000)
      }

      const token = jwt.sign(tokenPayload, this.JWT_SECRET)

      await prisma.emailVerification.create({
        data: {
          id: tokenId,
          token,
          email,
          userId: user.id,
          type: 'PASSWORD_RESET',
          expiresAt,
          isUsed: false
        }
      })

      return {
        token,
        expiresAt,
        success: true
      }
    } catch (error) {
      console.error('Error generating password reset token:', error)
      throw new Error('Failed to generate password reset token')
    }
  }

  /**
   * Clean up expired tokens (should be run periodically)
   */
  static async cleanupExpiredTokens(): Promise<number> {
    try {
      const result = await prisma.emailVerification.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      })

      return result.count
    } catch (error) {
      console.error('Error cleaning up expired tokens:', error)
      return 0
    }
  }

  /**
   * Get user's pending verifications
   */
  static async getUserPendingVerifications(userId: string): Promise<EmailVerificationToken[]> {
    try {
      const verifications = await prisma.emailVerification.findMany({
        where: {
          userId,
          isUsed: false,
          expiresAt: {
            gt: new Date()
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return verifications.map(v => ({
        id: v.id,
        email: v.email,
        userId: v.userId || undefined,
        type: v.type as VerificationType,
        expiresAt: v.expiresAt
      }))
    } catch (error) {
      console.error('Error getting user pending verifications:', error)
      return []
    }
  }
}