import { Client } from "../../../usescases/register-usecases/add-register/db-add-register-protocols";

export interface UpdateClientRepository {
  update(id: number, infoToUpdate: Client): Promise<Client>;
}
