export interface RecalculateFuelRefillKmRepository {
  recalculateKmChain(vehicleId: number): Promise<void>;
}
