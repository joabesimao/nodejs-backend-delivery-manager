import { Client } from "../../models/client/client-model";

export interface AddClientModel {
  name: string;
  lastName: string;
  phone: string;
}

export interface AddClient {
  add(client: AddClientModel): Promise<Client>;
}
