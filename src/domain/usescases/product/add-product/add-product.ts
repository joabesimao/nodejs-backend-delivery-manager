import { Product } from "../../../models/product/product";

export interface AddProductModel {
  name: string;
  price: number;
  description: string;
  category: string;
}

export interface AddProduct {
  add(client: AddProductModel): Promise<Product>;
}
