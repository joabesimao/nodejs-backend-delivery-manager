export class LastAdminError extends Error {
  constructor() {
    super("Não é possível remover ou desativar o último administrador ativo");
    this.name = "LastAdminError";
  }
}
