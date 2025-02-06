import { LoadRegisterModel } from "../../../domain/models/register/register-load-model";
import { LoadRegisters } from "../../../domain/usescases/loadRegister/load-register";
import { LoadRegisterRepository } from "../../protocols/db/register/load-register-repository";

export class DbLoadRegisters implements LoadRegisters {
  constructor(
    private readonly loadRegisterRepository: LoadRegisterRepository
  ) {}
  async load(): Promise<LoadRegisterModel[]> {
    await this.loadRegisterRepository.loadAll();
    return [];
  }
}
