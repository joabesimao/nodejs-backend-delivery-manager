export class WeakPasswordError extends Error {
  constructor() {
    super("A senha deve ter no mínimo 8 caracteres e no máximo 72 bytes.");
    this.name = "WeakPasswordError";
  }
}
