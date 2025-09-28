import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Bank account information - should ideally come from environment variables
    // or database configuration for better security and flexibility
    const bankAccounts = [
      {
        id: 'bca',
        bankName: 'Bank BCA',
        accountNumber: process.env.BCA_ACCOUNT_NUMBER || '1234567890',
        accountName: process.env.COMPANY_NAME || 'PT SPPG PLATFORM INDONESIA',
        bankCode: '014',
        color: 'bg-blue-600'
      },
      {
        id: 'mandiri',
        bankName: 'Bank Mandiri',
        accountNumber: process.env.MANDIRI_ACCOUNT_NUMBER || '9876543210',
        accountName: process.env.COMPANY_NAME || 'PT SPPG PLATFORM INDONESIA',
        bankCode: '008',
        color: 'bg-yellow-600'
      },
      {
        id: 'bni',
        bankName: 'Bank BNI',
        accountNumber: process.env.BNI_ACCOUNT_NUMBER || '5555666777',
        accountName: process.env.COMPANY_NAME || 'PT SPPG PLATFORM INDONESIA',
        bankCode: '009',
        color: 'bg-orange-600'
      }
    ]

    return NextResponse.json({
      success: true,
      bankAccounts
    })
  } catch (error) {
    console.error('[API] Error fetching bank accounts:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}