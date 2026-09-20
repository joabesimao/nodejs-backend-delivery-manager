export class SelfActionError extends Error {
  constructor() {
    super("Não é possível excluir ou desativar a própria conta");
    this.name = "SelfActionError";
  }
}
