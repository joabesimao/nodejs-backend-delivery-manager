import { ClientModel } from "../../../../domain/models/client/client-model";
import { LoadOneClient } from "../../../../domain/usescases/client/load-client";
import { LoadOneClientRepository } from "../../../protocols/db/client/load-client";

export class DbLoadOneClient implements LoadOneClient {
  constructor(
    private readonly loadOneClientRepository: LoadOneClientRepository
  ) {}
  async loadOne(id: number): Promise<ClientModel> {
    const oneClient = await this.loadOneClientRepository.loadOne(id);
    return oneClient;
  }
}
