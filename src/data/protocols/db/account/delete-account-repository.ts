export interface DeleteAccountRepository {
  deleteById(id: number): Promise<string>;
}
