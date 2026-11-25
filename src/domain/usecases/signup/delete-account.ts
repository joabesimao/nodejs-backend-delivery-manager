export interface DeleteAccount {
  deleteAccountById(id: number, requesterId: number): Promise<string>;
}
