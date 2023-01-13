export enum OrderStatus {
  // 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单。
  Pending = 0, // order init
  Processing = 1, // seller accept
  Shipping = 2, // seller shipped
  Completed = 3, // buyer select
  Closed = 4, // seller deny
}
