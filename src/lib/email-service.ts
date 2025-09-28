import nodemailer from 'nodemailer'
import { TokenService } from '@/features/auth/lib/token-service'

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

export interface EmailSendResult {
  success: boolean
  messageId?: string
  error?: string
}

export interface EmailVerificationData {
  recipientName: string
  recipientEmail: string
  verificationUrl: string
  organizationName?: string
  expiresAt: Date
}

export class EmailService {
  private static transporter: nodemailer.Transporter | null = null

  /**
   * Initialize email transporter
   */
  private static getTransporter(): nodemailer.Transporter {
    if (!this.transporter) {
      // Use environment-based configuration
      const emailConfig = {
        host: process.env.SMTP_HOST || 'localhost',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      }

      // For development, use ethereal email (fake SMTP)
      if (process.env.NODE_ENV === 'development' && !process.env.SMTP_HOST) {
        console.log('Using development email configuration')
        // In development, create test account
        // Note: You should run `nodemailer.createTestAccount()` to get credentials
      }

      this.transporter = nodemailer.createTransport(emailConfig)
    }

    return this.transporter!
  }

  /**
   * Generate email verification template
   */
  private static generateVerificationEmailTemplate(data: EmailVerificationData): EmailTemplate {
    const { recipientName, verificationUrl, organizationName, expiresAt } = data

    const expiryHours = Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))

    const subject = `Verifikasi Email - ${organizationName || 'SPPG Platform'}`
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Verifikasi Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #666; }
          .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Selamat Datang di SPPG Platform</h1>
        </div>
        <div class="content">
          <h2>Halo ${recipientName},</h2>
          <p>Terima kasih telah mendaftar di SPPG Platform. Untuk menyelesaikan registrasi Anda, silakan verifikasi alamat email ini dengan mengklik tombol di bawah:</p>
          
          <p style="text-align: center;">
            <a href="${verificationUrl}" class="button">Verifikasi Email</a>
          </p>
          
          <div class="warning">
            <strong>⏰ Penting:</strong> Link verifikasi ini akan kedaluwarsa dalam ${expiryHours} jam.
          </div>
          
          <p>Jika tombol di atas tidak berfungsi, Anda dapat menyalin dan menempel URL berikut ke browser Anda:</p>
          <p style="word-break: break-all; background: #e5e7eb; padding: 10px; border-radius: 4px; font-family: monospace;">
            ${verificationUrl}
          </p>
          
          <p>Jika Anda tidak membuat akun di SPPG Platform, Anda dapat mengabaikan email ini dengan aman.</p>
          
          <p>Salam hangat,<br>Tim SPPG Platform</p>
        </div>
        <div class="footer">
          <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
          <p>&copy; 2024 SPPG Platform. Semua hak cipta dilindungi.</p>
        </div>
      </body>
      </html>
    `

    const text = `
Selamat Datang di SPPG Platform

Halo ${recipientName},

Terima kasih telah mendaftar di SPPG Platform. Untuk menyelesaikan registrasi Anda, silakan verifikasi alamat email ini dengan mengunjungi link berikut:

${verificationUrl}

PENTING: Link verifikasi ini akan kedaluwarsa dalam ${expiryHours} jam.

Jika Anda tidak membuat akun di SPPG Platform, Anda dapat mengabaikan email ini dengan aman.

Salam hangat,
Tim SPPG Platform

---
Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
© 2024 SPPG Platform. Semua hak cipta dilindungi.
    `

    return { subject, html, text }
  }

  /**
   * Send email verification
   */
  static async sendEmailVerification(
    recipientEmail: string,
    recipientName: string,
    organizationName?: string
  ): Promise<EmailSendResult> {
    try {
      // Generate verification token
      const tokenResult = await TokenService.generateEmailVerificationToken(recipientEmail)
      
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Failed to generate verification token'
        }
      }

      // Create verification URL
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const verificationUrl = `${baseUrl}/verify-email/${tokenResult.token}`

      // Generate email template
      const template = this.generateVerificationEmailTemplate({
        recipientName,
        recipientEmail,
        verificationUrl,
        organizationName,
        expiresAt: tokenResult.expiresAt
      })

      // Send email
      const transporter = this.getTransporter()
      const info = await transporter.sendMail({
        from: `"SPPG Platform" <${process.env.SMTP_FROM || 'noreply@sppg-platform.com'}>`,
        to: recipientEmail,
        subject: template.subject,
        text: template.text,
        html: template.html
      })

      console.log('Email verification sent:', {
        recipient: recipientEmail,
        messageId: info.messageId,
        preview: process.env.NODE_ENV === 'development' ? nodemailer.getTestMessageUrl(info) : null
      })

      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error) {
      console.error('Error sending email verification:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordReset(
    recipientEmail: string,
    recipientName: string
  ): Promise<EmailSendResult> {
    try {
      // Generate password reset token
      const tokenResult = await TokenService.generatePasswordResetToken(recipientEmail)
      
      if (!tokenResult.success) {
        return {
          success: false,
          error: 'Failed to generate reset token'
        }
      }

      // Create reset URL
      const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
      const resetUrl = `${baseUrl}/reset-password/${tokenResult.token}`

      const expiryHours = Math.ceil((tokenResult.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60))

      const subject = 'Reset Password - SPPG Platform'
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Reset Password</h1>
          </div>
          <div class="content">
            <h2>Halo ${recipientName},</h2>
            <p>Kami menerima permintaan untuk mereset password akun Anda. Klik tombol di bawah untuk membuat password baru:</p>
            
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            
            <div class="warning">
              <strong>⚠️ Keamanan:</strong> Link reset password ini akan kedaluwarsa dalam ${expiryHours} jam untuk keamanan akun Anda.
            </div>
            
            <p>Jika Anda tidak meminta reset password, silakan abaikan email ini. Password Anda tidak akan berubah.</p>
            
            <p>Salam,<br>Tim SPPG Platform</p>
          </div>
        </body>
        </html>
      `

      const text = `
Reset Password - SPPG Platform

Halo ${recipientName},

Kami menerima permintaan untuk mereset password akun Anda. Kunjungi link berikut untuk membuat password baru:

${resetUrl}

KEAMANAN: Link ini akan kedaluwarsa dalam ${expiryHours} jam.

Jika Anda tidak meminta reset password, silakan abaikan email ini.

Salam,
Tim SPPG Platform
      `

      // Send email
      const transporter = this.getTransporter()
      const info = await transporter.sendMail({
        from: `"SPPG Platform" <${process.env.SMTP_FROM || 'noreply@sppg-platform.com'}>`,
        to: recipientEmail,
        subject,
        text,
        html
      })

      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error) {
      console.error('Error sending password reset:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  /**
   * Send welcome email after successful verification
   */
  static async sendWelcomeEmail(
    recipientEmail: string,
    recipientName: string,
    organizationName: string
  ): Promise<EmailSendResult> {
    try {
      const subject = `Selamat Datang di SPPG Platform - ${organizationName}`
      
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .success { background: #d1fae5; border-left: 4px solid #059669; padding: 15px; margin: 20px 0; }
            .next-steps { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✅ Akun Berhasil Diverifikasi!</h1>
          </div>
          <div class="content">
            <div class="success">
              <strong>Selamat!</strong> Email Anda telah berhasil diverifikasi dan akun ${organizationName} siap digunakan.
            </div>
            
            <h2>Halo ${recipientName},</h2>
            <p>Terima kasih telah bergabung dengan SPPG Platform. Akun organisasi <strong>${organizationName}</strong> Anda sudah aktif dan siap digunakan untuk mengelola operasional gizi gratis.</p>
            
            <div class="next-steps">
              <h3>Langkah Selanjutnya:</h3>
              <ul>
                <li>🏢 Lengkapi profil organisasi Anda</li>
                <li>👥 Undang anggota tim untuk bergabung</li>
                <li>📋 Mulai buat menu mingguan pertama</li>
                <li>📦 Setup inventory dan supplier</li>
                <li>📊 Jelajahi dashboard analytics</li>
              </ul>
            </div>
            
            <p>Jika Anda membutuhkan bantuan, tim support kami siap membantu melalui platform atau email support@sppg-platform.com</p>
            
            <p>Selamat memulai perjalanan SPPG yang lebih efisien!</p>
            
            <p>Salam hangat,<br>Tim SPPG Platform</p>
          </div>
        </body>
        </html>
      `

      const text = `
Selamat! Akun Berhasil Diverifikasi

Halo ${recipientName},

Terima kasih telah bergabung dengan SPPG Platform. Akun organisasi ${organizationName} Anda sudah aktif dan siap digunakan.

Langkah Selanjutnya:
- Lengkapi profil organisasi Anda  
- Undang anggota tim untuk bergabung
- Mulai buat menu mingguan pertama
- Setup inventory dan supplier
- Jelajahi dashboard analytics

Butuh bantuan? Hubungi support@sppg-platform.com

Selamat memulai perjalanan SPPG yang lebih efisien!

Salam hangat,
Tim SPPG Platform
      `

      // Send email
      const transporter = this.getTransporter()
      const info = await transporter.sendMail({
        from: `"SPPG Platform" <${process.env.SMTP_FROM || 'noreply@sppg-platform.com'}>`,
        to: recipientEmail,
        subject,
        text,
        html
      })

      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error) {
      console.error('Error sending welcome email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown email error'
      }
    }
  }

  /**
   * Test email configuration
   */
  static async testEmailConfiguration(): Promise<EmailSendResult> {
    try {
      const transporter = this.getTransporter()
      await transporter.verify()
      
      return {
        success: true,
        messageId: 'configuration-test'
      }
    } catch (error) {
      console.error('Email configuration test failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Configuration test failed'
      }
    }
  }
}