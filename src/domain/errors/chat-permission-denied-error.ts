export class ChatPermissionDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatPermissionDeniedError";
  }
}
