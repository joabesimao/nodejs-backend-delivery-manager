import { Product } from "../../../models/product/product";

export interface AddProductModel {
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface AddProduct {
  add(product: AddProductModel): Promise<Product>;
}
