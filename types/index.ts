export interface Product {
  id: string;
  name: string;
  sku: string;
  hsnCode: string;
  price: number;
  quantity: number;
  costPrice: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  hsnCode: string;
}

export interface Payment {
  id: string;
  amount: number;
  date: string;
  method: 'cash' | 'upi' | 'bank_transfer' | 'cheque';
  reference?: string;
  notes?: string;
}

export interface Sale {
  id: string;
  buyerName: string;
  buyerGstin: string;
  placeOfSupply: string;
  items: SaleItem[];
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  payments: Payment[];
  cgst: number;
  sgst: number;
  igst: number;
  invoiceNumber: string;
  createdAt: string;
  shippingAddress: string;
  dueDate: string;
}

export interface KPI {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  monthlyRevenue: number;
  monthlySales: number;
} 