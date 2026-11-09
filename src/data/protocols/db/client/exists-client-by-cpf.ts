export interface ExistsClientByCpfRepository {
  existsByCpf(cpf: string): Promise<boolean>;
}
