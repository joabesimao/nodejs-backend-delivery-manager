export class VehicleInUseError extends Error {
  constructor() {
    super("Veículo possui trocas de óleo ou abastecimentos lançados e não pode ser excluído.");
    this.name = "VehicleInUseError";
  }
}
