export interface IProduct {
  id: string;
  name: string;
  slug: string;
  supplierId?: string;
  unitId: string;
  quantity: number;
  minQuantity: number;
  purchase: number;
  sell: number;
  retail: number;
  comment?: string;
  updateBy?: string;
  createdAt: string;
}
