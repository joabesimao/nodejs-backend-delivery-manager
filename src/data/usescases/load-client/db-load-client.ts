import { ClientModel } from "../../../domain/models/client/client-model";
import { LoadRegisterModel } from "../../../domain/models/register/register-load-model";
import { LoadClients } from "../../../domain/usescases/load-client/load-client";
import { LoadRegisters } from "../../../domain/usescases/load-register/load-register";
import { LoadClientRepository } from "../../protocols/db/client-repository/load-client";
import { LoadRegisterRepository } from "../../protocols/db/register/load-register-repository";

export class DbLoadClients implements LoadClients {
  constructor(private readonly loadClientRepository: LoadClientRepository) {}
  async load(): Promise<ClientModel[]> {
    const clientsList = await this.loadClientRepository.loadAll();
    return clientsList as unknown as ClientModel[];
  }
}
