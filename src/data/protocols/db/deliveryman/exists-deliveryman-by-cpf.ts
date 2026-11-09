export interface ExistsDeliverymanByCpfRepository {
  existsByCpf(cpf: string): Promise<boolean>;
}
