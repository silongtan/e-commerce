export default function orderStatusConverter(status: number): string {
  switch (status) {
    case 0: //OrderStatus.Pending:
      return "Pending";
    case 1: //OrderStatus.Processing:
      return "Processing";
    case 2: //OrderStatus.Shipping:
      return "Shipping";
    case 3: //OrderStatus.Completed:
      return "Completed";
    case 4: //OrderStatus.Closed:
      return "Closed";
    default:
      throw new Error("not suppose to go here.");
  }
}
