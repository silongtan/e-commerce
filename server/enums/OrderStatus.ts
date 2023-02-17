export enum OrderStatus {
  Pending = 0, // order init
  Processing = 1, // seller accept
  Shipping = 2, // seller shipped
  Completed = 3, // buyer select
  Closed = 4, // seller deny
}
