export class InvalidCredentialsError extends Error {
  constructor() {
    super("E-mail ou senha incorretos.");
    this.name = "InvalidCredentialsError";
  }
}
