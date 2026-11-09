export class ChatAccountNotFoundError extends Error {
  constructor() {
    super("Conta não encontrada");
    this.name = "ChatAccountNotFoundError";
  }
}
