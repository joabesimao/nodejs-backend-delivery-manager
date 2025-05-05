import { ClientModel } from "../../models/client/client-model";

export interface LoadClients {
  load(): Promise<ClientModel[]>;
}

export interface LoadClient {
  loadOne(id:number): Promise<ClientModel>;
}
