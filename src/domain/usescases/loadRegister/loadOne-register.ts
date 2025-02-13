import { LoadRegisterModel } from "../../models/register/register-load-model";

export interface LoadOneRegisters {
  loadById(id: number): Promise<LoadRegisterModel>;
}
