import { Product, ProductVariation } from "../../../models/product/product";

export interface AddProductModel {
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string;
  brand?: string;
  model?: string;
  unit?: string;
  barcode?: string;
  status?: boolean;
  notes?: string;
  imageBase64?: string;
  imageMimeType?: string;
  variations?: ProductVariation[];
}

export interface AddProduct {
  add(product: AddProductModel): Promise<Product>;
}
