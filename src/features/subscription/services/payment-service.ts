/**
 * Payment Service
 * Comprehensive payment processing service with multiple payment gateways
 */

import { 
  PaymentData, 
  PaymentResponse, 
  PaymentValidation,
  PaymentCalculation,
  PaymentMethod,
  PaymentStatus,
  VirtualAccountDetails
} from '../types/payment';
import { calculatePaymentFee } from '../config/payment-methods';
// BANK_ACCOUNTS now comes from API endpoint: /api/billing/payment/bank-accounts

export class PaymentService {
  
  /**
   * Create payment transaction
   */
  async createPayment(paymentData: PaymentData, subscriptionId: string): Promise<PaymentResponse> {
    try {
      const validation = this.validatePaymentData(paymentData);
      if (!validation.isValid) {
        return {
          success: false,
          transactionId: '',
          status: 'FAILED',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid payment data',
            details: { errors: validation.errors }
          }
        };
      }

      switch (paymentData.method) {
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
          return await this.processCreditCardPayment(paymentData, subscriptionId);
        
        case 'VIRTUAL_ACCOUNT':
          return await this.processVirtualAccountPayment(paymentData, subscriptionId);
        
        case 'E_WALLET':
          return await this.processEWalletPayment(paymentData, subscriptionId);
        
        case 'QRIS':
          return await this.processQRISPayment(paymentData, subscriptionId);
        
        case 'BANK_TRANSFER':
          return await this.processBankTransferPayment(paymentData, subscriptionId);
        
        case 'INSTALLMENT':
          return await this.processInstallmentPayment(paymentData, subscriptionId);
        
        case 'INVOICE':
          return await this.processInvoicePayment(paymentData, subscriptionId);
        
        case 'COD':
          return await this.processCODPayment(paymentData, subscriptionId);
        
        default:
          return {
            success: false,
            transactionId: '',
            status: 'FAILED',
            error: {
              code: 'UNSUPPORTED_METHOD',
              message: 'Payment method not supported'
            }
          };
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      return {
        success: false,
        transactionId: '',
        status: 'FAILED',
        error: {
          code: 'PAYMENT_ERROR',
          message: error instanceof Error ? error.message : 'Unknown payment error'
        }
      };
    }
  }

  /**
   * Process Credit Card Payment via Midtrans
   */
  private async processCreditCardPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    
    const midtransPayload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: paymentData.amount
      },
      credit_card: {
        secure: true,
        card_number: paymentData.creditCard?.cardNumber,
        cvv: paymentData.creditCard?.cvv,
        expiry_month: paymentData.creditCard?.expiryMonth,
        expiry_year: paymentData.creditCard?.expiryYear
      },
      customer_details: {
        first_name: paymentData.creditCard?.holderName?.split(' ')[0],
        last_name: paymentData.creditCard?.holderName?.split(' ').slice(1).join(' '),
        email: `customer@${subscriptionId}.com`, // This should come from subscription data
        billing_address: paymentData.billingAddress
      }
    };

    // Simulate API call to Midtrans
    const response = await this.callMidtransAPI('/charge', midtransPayload);
    
    return {
      success: response.transaction_status === 'capture',
      transactionId,
      status: this.mapMidtransStatus((response as any).transaction_status),
      paymentUrl: (response as any).redirect_url
    };
  }

  /**
   * Process Virtual Account Payment
   */
  private async processVirtualAccountPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    const bankCode = paymentData.virtualAccount?.provider || 'BCA';
    
    const virtualAccountDetails: VirtualAccountDetails = {
      provider: bankCode,
      accountNumber: `${bankCode}${Date.now().toString().slice(-8)}`,
      expiredAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const midtransPayload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: paymentData.amount
      },
      bank_transfer: {
        bank: bankCode.toLowerCase()
      }
    };

    const response = await this.callMidtransAPI('/charge', midtransPayload);
    
    return {
      success: true,
      transactionId,
      status: 'PENDING',
      virtualAccount: virtualAccountDetails,
      instructions: [
        `Transfer ke Virtual Account: ${virtualAccountDetails.accountNumber}`,
        `Bank: ${bankCode}`,
        `Jumlah: Rp ${paymentData.amount.toLocaleString('id-ID')}`,
        `Berlaku hingga: ${virtualAccountDetails.expiredAt.toLocaleString('id-ID')}`
      ]
    };
  }

  /**
   * Process E-Wallet Payment
   */
  private async processEWalletPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    const provider = paymentData.eWallet?.provider || 'GOPAY';

    const midtransPayload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: paymentData.amount
      },
      [provider.toLowerCase()]: {
        enable_callback: true,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/callback`
      }
    };

    const response = await this.callMidtransAPI('/charge', midtransPayload);
    
    return {
      success: true,
      transactionId,
      status: 'PENDING',
      paymentUrl: (response as any).actions?.[0]?.url,
      instructions: [
        `Buka aplikasi ${provider}`,
        'Scan QR code atau klik link pembayaran',
        `Konfirmasi pembayaran sebesar Rp ${paymentData.amount.toLocaleString('id-ID')}`
      ]
    };
  }

  /**
   * Process QRIS Payment
   */
  private async processQRISPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();

    const midtransPayload = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: paymentData.amount
      },
      qris: {
        acquirer: 'gopay'
      }
    };

    const response = await this.callMidtransAPI('/charge', midtransPayload);
    
    return {
      success: true,
      transactionId,
      status: 'PENDING',
      qrCode: (response as any).qr_string,
      instructions: [
        'Buka aplikasi bank atau e-wallet favorit Anda',
        'Pilih menu Scan QR atau QRIS',
        'Scan QR code di bawah ini',
        `Konfirmasi pembayaran sebesar Rp ${paymentData.amount.toLocaleString('id-ID')}`
      ]
    };
  }

  /**
   * Process Manual Bank Transfer
   */
  private async processBankTransferPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    
    // Fetch bank accounts from API
    const bankAccountsResponse = await fetch('/api/billing/payment/bank-accounts')
    const bankAccountsData = await bankAccountsResponse.json()
    const defaultBankAccount = bankAccountsData.accounts?.[0] || {
      bankName: 'BCA', 
      accountNumber: 'Loading...', 
      accountName: 'SPPG Platform'
    }
    
    const bankAccount = paymentData.bankTransfer || defaultBankAccount;

    return {
      success: true,
      transactionId,
      status: 'PENDING',
      instructions: [
        `Transfer ke rekening berikut:`,
        `Bank: ${bankAccount.bankName}`,
        `No. Rekening: ${bankAccount.accountNumber}`,
        `Atas Nama: ${bankAccount.accountName}`,
        `Jumlah: Rp ${paymentData.amount.toLocaleString('id-ID')}`,
        `Kode Unik: ${transactionId.slice(-6)}`,
        '',
        'Setelah transfer, konfirmasi pembayaran melalui WhatsApp atau email.',
        'Proses verifikasi membutuhkan waktu 1-3 hari kerja.'
      ]
    };
  }

  /**
   * Process Installment Payment
   */
  private async processInstallmentPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    const installment = paymentData.installmentPlan;

    if (!installment) {
      return {
        success: false,
        transactionId: '',
        status: 'FAILED',
        error: {
          code: 'MISSING_INSTALLMENT_DATA',
          message: 'Installment plan data is required'
        }
      };
    }

    // Process first installment
    const firstInstallmentPayment = {
      ...paymentData,
      method: 'CREDIT_CARD' as PaymentMethod,
      amount: installment.monthlyAmount
    };

    return await this.processCreditCardPayment(firstInstallmentPayment, subscriptionId);
  }

  /**
   * Process Invoice Payment
   */
  private async processInvoicePayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();
    const invoiceDetails = paymentData.invoiceDetails;

    return {
      success: true,
      transactionId,
      status: 'PENDING',
      instructions: [
        'Invoice telah dikirim ke email Anda',
        `Nomor Invoice: ${transactionId}`,
        `Jumlah Tagihan: Rp ${paymentData.amount.toLocaleString('id-ID')}`,
        `Jatuh Tempo: ${invoiceDetails?.dueDate.toLocaleDateString('id-ID')}`,
        `Terms: ${invoiceDetails?.terms}`,
        '',
        'Silakan lakukan pembayaran sesuai instruksi dalam invoice.',
        'Hubungi customer service jika ada pertanyaan.'
      ]
    };
  }

  /**
   * Process Cash on Delivery Payment
   */
  private async processCODPayment(
    paymentData: PaymentData, 
    subscriptionId: string
  ): Promise<PaymentResponse> {
    const transactionId = this.generateTransactionId();

    return {
      success: true,
      transactionId,
      status: 'PENDING',
      instructions: [
        'Pembayaran akan dilakukan saat kunjungan tim kami',
        'Tim customer success akan menghubungi untuk penjadwalan',
        `Jumlah yang harus dibayar: Rp ${paymentData.amount.toLocaleString('id-ID')}`,
        'Metode pembayaran: Cash atau transfer langsung',
        '',
        'Pastikan Anda siap dengan dokumen yang diperlukan:',
        '- KTP/Identitas resmi',
        '- Surat kuasa (jika diperlukan)',
        '- Dokumen pendukung lainnya'
      ]
    };
  }

  /**
   * Validate payment data
   */
  private validatePaymentData(paymentData: PaymentData): PaymentValidation {
    const errors: { field: string; message: string; }[] = [];

    if (!paymentData.method) {
      errors.push({ field: 'method', message: 'Payment method is required' });
    }

    if (!paymentData.amount || paymentData.amount <= 0) {
      errors.push({ field: 'amount', message: 'Valid amount is required' });
    }

    // Method-specific validation
    switch (paymentData.method) {
      case 'CREDIT_CARD':
      case 'DEBIT_CARD':
        if (!paymentData.creditCard) {
          errors.push({ field: 'creditCard', message: 'Credit card details are required' });
        } else {
          const card = paymentData.creditCard;
          if (!card.cardNumber || card.cardNumber.length < 13) {
            errors.push({ field: 'cardNumber', message: 'Valid card number is required' });
          }
          if (!card.cvv || card.cvv.length < 3) {
            errors.push({ field: 'cvv', message: 'Valid CVV is required' });
          }
          if (!card.holderName) {
            errors.push({ field: 'holderName', message: 'Card holder name is required' });
          }
        }
        break;

      case 'INSTALLMENT':
        if (!paymentData.installmentPlan) {
          errors.push({ field: 'installmentPlan', message: 'Installment plan is required' });
        }
        break;

      case 'E_WALLET':
        if (!paymentData.eWallet) {
          errors.push({ field: 'eWallet', message: 'E-wallet details are required' });
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate total payment with fees and taxes
   */
  calculatePayment(amount: number, method: PaymentMethod): PaymentCalculation {
    const paymentFee = calculatePaymentFee(method, amount);
    const tax = Math.round(amount * 0.11); // 11% PPN
    const subtotal = amount;
    const total = subtotal + paymentFee + tax;

    return {
      subtotal,
      tax,
      fees: paymentFee,
      discount: 0,
      total,
      currency: 'IDR',
      breakdown: {
        packagePrice: amount,
        setupFee: 0,
        paymentFee,
        taxAmount: tax,
        discountAmount: 0
      }
    };
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    try {
      // Simulate API call to check status
      const response = await this.callMidtransAPI(`/${transactionId}/status`);
      return this.mapMidtransStatus((response as any).transaction_status);
    } catch (error) {
      console.error('Error checking payment status:', error);
      return 'FAILED';
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `SPPG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Call Midtrans API (simulated)
   */
  private async callMidtransAPI(endpoint: string, payload?: unknown): Promise<Record<string, unknown>> {
    // This is a mock implementation
    // In production, you would use actual Midtrans SDK or HTTP client
    
    console.log(`Calling Midtrans API: ${endpoint}`, payload);
    
    // Simulate API response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          transaction_id: this.generateTransactionId(),
          transaction_status: 'pending',
          redirect_url: 'https://api.midtrans.com/v2/token/redirect',
          qr_string: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          actions: [{ name: 'generate-qr-code', method: 'GET', url: 'https://api.midtrans.com/qr' }]
        });
      }, 1000);
    });
  }

  /**
   * Map Midtrans status to our PaymentStatus
   */
  private mapMidtransStatus(midtransStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'capture': 'COMPLETED',
      'settlement': 'COMPLETED',
      'pending': 'PENDING',
      'deny': 'FAILED',
      'cancel': 'CANCELLED',
      'expire': 'EXPIRED',
      'failure': 'FAILED',
      'refund': 'REFUNDED'
    };

    return statusMap[midtransStatus] || 'FAILED';
  }
}