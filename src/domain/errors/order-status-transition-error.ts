export class OrderStatusTransitionError extends Error {
  constructor(from: string, to?: string) {
    super(
      from === "finished"
        ? "Pedido finalizado não pode ser alterado."
        : `Status do pedido não pode voltar de "${from}" para "${to}".`
    );
    this.name = "OrderStatusTransitionError";
  }
}
