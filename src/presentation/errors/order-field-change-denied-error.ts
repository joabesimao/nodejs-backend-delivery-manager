export class OrderFieldChangeDeniedError extends Error {
  constructor() {
    super("Entregador não pode alterar o valor nem o entregador da entrega.");
    this.name = "OrderFieldChangeDeniedError";
  }
}
