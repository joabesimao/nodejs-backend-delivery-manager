import { ClientModel } from "../../../usescases/add-register/db-add-register-protocols";

export interface LoadClientRepository {
  loadAll(): Promise<ClientModel[]>;
}

export interface LoadOneClientRepository {
  loadOne(id: number): Promise<ClientModel>;
}
