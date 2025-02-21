import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";

export interface LoadRegisterRepository {
  loadAll(): Promise<LoadRegisterModel[]>;
}

export interface LoadRegisterByIdRepository {
  loadById(id: number): Promise<LoadRegisterModel>;
}

export interface LoadRegisterByNameRepository {
  findByName(name: string): Promise<LoadRegisterModel>;
}
