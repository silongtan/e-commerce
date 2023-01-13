export default function userRoleConverter(status: number): string {
  switch (status) {
    case 1: //UserRole.Buyer:
      return "Buyer";
    case 2: //UserRole.Seller:
      return "Seller";
    case 3: //UserRole.Admin:
      return "Admin";
    default:
      return "";
      // throw new Error("not suppose to go here.");
  }
}
