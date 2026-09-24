export class InvalidKmError extends Error {
  constructor() {
    super("O km informado deve ser maior que o último km registrado para este veículo.");
    this.name = "InvalidKmError";
  }
}
