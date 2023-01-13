export default interface OrderViewModel {
  _id: string;
  customerId: string;
  sellerId: string;
  status: number;
  // confirm_status: ConfirmStatus;
  total_amount: number;
  orderItems: [
    {
      productId: string;
      quantity: number;
      unitPrice: number;
    }
  ];
}
