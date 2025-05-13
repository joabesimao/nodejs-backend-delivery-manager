import { Client, ClientModel } from "../../models/client/client-model";

export interface UpdateClient {
  update(id: number, infoToUpdate: ClientModel): Promise<Client>;
}
