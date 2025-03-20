export class CreatePaymentDto {
    amount: number;
    status: 'Paid' | 'Pending' | 'Partial' | 'Refunded';
    method: 'Credit Card' | 'Cash' | 'Bank Transfer' | 'PayPal' | 'To Be Paid';
    date: string;
    transactionId?: string;
  }