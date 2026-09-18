export interface ProductVariation {
  attribute: string;
  value: string;
}

export interface ProductModel {
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

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string | null;
  brand?: string | null;
  model?: string | null;
  unit?: string | null;
  barcode?: string | null;
  status: boolean;
  notes?: string | null;
  imageBase64?: string | null;
  imageMimeType?: string | null;
  variations?: ProductVariation[];
}

export interface LoadProductFilter {
  name?: string;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  limit?: number;
  offset?: number;
}

export interface LoadProductResult {
  items: Product[];
  total: number;
}
