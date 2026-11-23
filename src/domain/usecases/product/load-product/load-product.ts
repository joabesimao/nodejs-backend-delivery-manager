import {
  Product,
  LoadProductFilter,
  LoadProductResult,
} from "../../../models/product/product";

export interface LoadAllProduct {
  load(filter?: LoadProductFilter): Promise<LoadProductResult>;
}

export interface LoadProductById {
  loadOne(id: number): Promise<Product>;
}
