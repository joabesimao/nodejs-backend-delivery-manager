import { ClientModel } from "../../../../domain/models/client/client-model";
import { LoadClients } from "../../../../domain/usescases/client/load-client";
import { LoadClientRepository } from "../../../protocols/db/client/load-client";

export class DbLoadClients implements LoadClients {
  constructor(private readonly loadClientRepository: LoadClientRepository) {}
  async load(): Promise<ClientModel[]> {
    const clientsList = await this.loadClientRepository.loadAll();
    return clientsList as unknown as ClientModel[];
  }
}
