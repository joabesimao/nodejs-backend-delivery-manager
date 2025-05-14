import { DeleteClient } from "../../../../domain/usescases/client/delete-client";
import { DeleteClientRepository } from "../../../protocols/db/client/delete-client";

export class DbDeleteClient implements DeleteClient {
  constructor(
    private readonly deleteClientRepository: DeleteClientRepository
  ) {}
  async delete(id: number): Promise<string> {
    const deletedClient = await this.deleteClientRepository.deleteOne(id);
    return deletedClient;
  }
}
