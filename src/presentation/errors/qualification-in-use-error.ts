export class QualificationInUseError extends Error {
  constructor() {
    super("Número de habilitação já cadastrado no sistema.");
    this.name = "QualificationInUseError";
  }
}
