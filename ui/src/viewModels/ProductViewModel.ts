export default interface ProductViewModel {
  _id: string;
  sellerId: string;
  title: string;
  description: string;
  salePrice: number;
  isActive: boolean;
}
export function createEmptyProduct(): ProductViewModel {
  return {
    _id: "",
    sellerId: "",
    title: "",
    description: "",
    salePrice: 0,
    isActive: false,
  };
}
