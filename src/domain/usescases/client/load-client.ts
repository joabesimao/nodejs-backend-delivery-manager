import { ClientModel } from "../../models/client/client-model";

export interface LoadClients {
  load(): Promise<ClientModel[]>;
}

export interface LoadOneClient {
  loadOne(id: number): Promise<ClientModel>;
}
