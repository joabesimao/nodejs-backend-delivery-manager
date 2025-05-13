export interface DeleteClient {
  delete(id: number): Promise<string>;
}
