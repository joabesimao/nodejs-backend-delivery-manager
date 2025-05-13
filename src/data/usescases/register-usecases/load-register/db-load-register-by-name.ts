import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { LoadOneRegistersByName } from "../../../../domain/usescases/register/load-one-register";
import { LoadRegisterByNameRepository } from "../../../protocols/db/register/load-register-repository";

export class DbLoadRegistersByName implements LoadOneRegistersByName {
  constructor(
    private readonly loadOneRegistersByNameRepository: LoadRegisterByNameRepository
  ) {}
  async loadByName(name: string): Promise<LoadRegisterModel> {
    const findRegisterByName =
      await this.loadOneRegistersByNameRepository.findByName(name);
    return findRegisterByName;
  }
}
