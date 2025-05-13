import { UpdateClient } from "../../../../domain/usescases/client/update-client";
import { UpdateClientRepository } from "../../../protocols/db/client/update-client";
import {
  ClientModel,
  Client,
} from "../../register-usecases/add-register/db-add-register-protocols";

export class DbUpdateClient implements UpdateClient {
  constructor(
    private readonly updateClientRepository: UpdateClientRepository
  ) {}
  async update(id: number, infoToUpdate: ClientModel): Promise<Client> {
    const updateClient = await this.updateClientRepository.update(
      id,
      infoToUpdate
    );
    return updateClient;
  }
}
