import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadOneRegisters } from "../../../../domain/usescases/register/load-one-register";
import { LoadRegisterByIdRepository } from "../../../protocols/db/register/load-register-repository";

export class DbLoadRegistersById implements LoadOneRegisters {
  constructor(
    private readonly loadRegisterByIdRepository: LoadRegisterByIdRepository
  ) {}
  async loadById(id: number): Promise<LoadRegisterModel> {
    const register = await this.loadRegisterByIdRepository.loadById(id);
    return register;
  }
}
