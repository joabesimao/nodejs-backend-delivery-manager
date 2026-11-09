export class InvalidChatMessageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidChatMessageError";
  }
}
