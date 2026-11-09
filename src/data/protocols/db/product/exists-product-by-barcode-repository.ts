export interface ExistsProductByBarcodeRepository {
  existsByBarcode(barcode: string): Promise<boolean>;
}
