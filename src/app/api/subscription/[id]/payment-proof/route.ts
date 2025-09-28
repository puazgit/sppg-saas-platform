/**
 * API Route: Upload Payment Proof
 * POST /api/subscription/[id]/payment-proof
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: subscriptionId } = await params
    const formData = await request.formData()
    
    const file = formData.get('paymentProof') as File
    const bankAccount = formData.get('bankAccount') as string
    const transferAmount = formData.get('transferAmount') as string
    const transferDate = formData.get('transferDate') as string
    const transferNote = formData.get('transferNote') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file type and size
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed.' },
        { status: 400 }
      )
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File size too large. Maximum 5MB allowed.' },
        { status: 400 }
      )
    }

    // Check if subscription exists
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      return NextResponse.json(
        { success: false, error: 'Subscription not found' },
        { status: 404 }
      )
    }

    // Find pending invoice for this subscription's SPPG
    const pendingInvoice = await prisma.invoice.findFirst({
      where: { 
        sppgId: subscription.sppgId,
        status: 'PENDING' 
      },
      orderBy: { createdAt: 'desc' }
    })
    
    if (!pendingInvoice) {
      return NextResponse.json(
        { success: false, error: 'No pending invoice found' },
        { status: 400 }
      )
    }

    // Create uploads directory if not exists
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'payment-proofs')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `payment-proof-${subscriptionId}-${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)
    const publicPath = `/uploads/payment-proofs/${fileName}`

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Save to database
    await prisma.$transaction(async (tx) => {
      // Create file attachment record
      const fileAttachment = await tx.fileAttachment.create({
        data: {
          originalName: file.name,
          fileName: fileName,
          filePath: publicPath,
          fileSize: file.size,
          mimeType: file.type,
          entityType: 'Invoice',
          entityId: pendingInvoice.id,
          category: 'payment_proof',
          description: `Payment proof for invoice ${pendingInvoice.invoiceNumber}`,
          // uploadedBy: null, // Will be filled when user authentication is implemented
          sppgId: subscription.sppgId,
        }
      })

      // Update invoice with payment details
      await tx.invoice.update({
        where: { id: pendingInvoice.id },
        data: {
          status: 'PROCESSING', // Change status to processing
          paymentMethod: 'BANK_TRANSFER',
          paymentReference: bankAccount,
          paymentNotes: JSON.stringify({
            bankAccount,
            transferAmount: parseFloat(transferAmount),
            transferDate,
            transferNote,
            proofFileId: fileAttachment.id,
          }),
        }
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      data: {
        fileName,
        filePath: publicPath,
        invoiceStatus: 'PROCESSING',
      }
    })

  } catch (error) {
    console.error('[API] Error uploading payment proof:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}