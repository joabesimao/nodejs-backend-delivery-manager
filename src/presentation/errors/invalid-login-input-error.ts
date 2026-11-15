export class InvalidLoginInputError extends Error {
  constructor() {
    super("Informe um e-mail válido e a senha.");
    this.name = "InvalidLoginInputError";
  }
}
