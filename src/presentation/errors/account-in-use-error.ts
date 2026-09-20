export class AccountInUseError extends Error {
  constructor() {
    super(
      "Esta conta possui histórico vinculado (ex.: mensagens de chat) e não pode ser excluída. Desative-a em vez de excluir.",
    );
    this.name = "AccountInUseError";
  }
}
