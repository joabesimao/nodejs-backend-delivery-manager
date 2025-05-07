import {
  RegisterModel,
  AddRegister,
  AddRegisterModel,
} from "./db-add-register-protocols";
import { AddRegisterRepository } from "../../protocols/db/register/add-register-repository";
import { LoadRegisterByNameRepository } from "../../protocols/db/register/load-register-repository";
export class DbAddRegister implements AddRegister {
  constructor(
    private readonly registerRepository: AddRegisterRepository,
    private readonly registerByNameRepository: LoadRegisterByNameRepository
  ) {}

  async add(data: AddRegisterModel): Promise<RegisterModel> {
    /* const register = await this.registerByNameRepository.findByName(
      data.client.name
    ); */
    /*   if (!register) {*/
    const result = await this.registerRepository.add(data);
    return result;
  }
}
