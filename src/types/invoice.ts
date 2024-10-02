export interface IInvoice {
  id: string;
  customerName: string;
  date: string;
  discount: number;
  due: number;
  total: number;
  profit: number;
  note?: string | null;
  updateBy: string;
  products: JSON;
  customerId: string;
  createdAt: Date;
}
