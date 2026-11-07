export class ResourceInUseError extends Error {
  constructor() {
    super("Não é possível excluir: existem registros vinculados a este item.");
    this.name = "ResourceInUseError";
  }
}
