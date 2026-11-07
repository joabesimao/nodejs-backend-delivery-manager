export class PlateInUseError extends Error {
  constructor() {
    super("Placa já cadastrada no sistema.");
    this.name = "PlateInUseError";
  }
}
