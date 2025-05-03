import { ClientModel } from "../../models/client/client-model";
import { LoadRegisterModel } from "../../models/register/register-load-model";

export interface LoadClients {
  load(): Promise<ClientModel[]>;
}
