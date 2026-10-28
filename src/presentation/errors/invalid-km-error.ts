export class InvalidKmError extends Error {
  constructor(message = "O km informado deve ser maior que o último km registrado para este veículo.") {
    super(message);
    this.name = "InvalidKmError";
  }
}
