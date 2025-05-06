import { ClientModel } from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/add-client/add-client";

export interface AddClientRepository {
  add(client: AddClientModel): Promise<ClientModel>;
}
