import { ClientModel } from "../../../domain/models/client/client-model";
import { LoadClient } from "../../../domain/usescases/load-client/load-client";
import { LoadOneClientRepository } from "../../protocols/db/client-repository/load-client";

export class DbLoadOneClient implements LoadClient {
  constructor(
    private readonly loadOneClientRepository: LoadOneClientRepository
  ) {}
  async loadOne(id: number): Promise<ClientModel> {
    const oneClient = await this.loadOneClientRepository.loadOne(id);
    return oneClient;
  }
}
