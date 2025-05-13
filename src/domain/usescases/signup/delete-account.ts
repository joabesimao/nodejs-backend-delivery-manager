export interface DeleteAccount {
  deleteAccountById(id: number): Promise<string>;
}
