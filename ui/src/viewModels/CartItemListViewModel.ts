export interface CartItem {
  productId: string;
  sellerId: string;
  title?: string;
  quantity: number;
  unitPrice: number;
}

export interface CartItemList extends Array<CartItem> {}

export function createEmptyCartItem(): CartItem {
  return { productId: "", sellerId: "", quantity: 0, unitPrice: 0 };
}
