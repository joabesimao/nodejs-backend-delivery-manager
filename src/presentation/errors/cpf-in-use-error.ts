export class CpfInUseError extends Error {
  constructor() {
    super("CPF já cadastrado no sistema.");
    this.name = "CpfInUseError";
  }
}
