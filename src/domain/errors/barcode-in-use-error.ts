export class BarcodeInUseError extends Error {
  constructor() {
    super("Invalid param: barcode");
    this.name = "BarcodeInUseError";
  }
}
