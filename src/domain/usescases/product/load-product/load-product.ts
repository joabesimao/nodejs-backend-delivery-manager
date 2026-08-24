import { Product } from "../../../models/product/product";

export interface LoadAllProduct {
  load(): Promise<Product[]>;
}

export interface LoadProductById {
  loadOne(id: number): Promise<Product>;
}
