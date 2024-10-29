// types/order.ts
export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    totalAmount: number;
    discountAmount: number;
    finalAmount: number;
    status: OrderStatus;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
  }
  
  export type OrderStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';
  export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
  export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'TRANSFER';
  
  export interface OrderFilter {
    status: string;
    search: string;
  }