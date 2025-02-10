import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";

export interface LoadRegisterRepository {
  loadAll(): Promise<LoadRegisterModel[]>;
}

export interface LoadRegisterByIdRepository {
  loadById(id: number): Promise<LoadRegisterModel>;
}
