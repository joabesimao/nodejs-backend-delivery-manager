import {
  AddClient,
  AddClientModel,
} from "../../../../domain/usescases/add-client/add-client";
import { AddClientRepository } from "../../../protocols/db/client-repository/add-client";
import { Client } from "../../register-usecases/add-register/db-add-register-protocols";

export class DbAddClient implements AddClient {
  constructor(private readonly addClientRepository: AddClientRepository) {}
  async add(client: AddClientModel): Promise<Client> {
    const result = await this.addClientRepository.add(client);
    return result;
  }
}
