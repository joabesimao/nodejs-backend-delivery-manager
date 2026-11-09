export class ChatMessageNotFoundError extends Error {
  constructor() {
    super("Mensagem não encontrada");
    this.name = "ChatMessageNotFoundError";
  }
}
