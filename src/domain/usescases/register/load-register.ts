import { LoadRegisterModel } from "../../models/register/register-load-model";

export interface LoadRegisters {
  load(): Promise<LoadRegisterModel[]>;
}
