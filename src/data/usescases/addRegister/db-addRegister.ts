import { RegisterModel } from "../../../domain/models/register/register-model";
import {
  AddRegister,
  AddRegisterModel,
} from "../../../domain/usescases/addRegister/add-register";
import { AddRegisterRepository } from "../../protocols/db/register/add-register-repository";

export class DbAddRegister implements AddRegister {
  constructor(private readonly registerRepository: AddRegisterRepository) {}
  async add(data: AddRegisterModel): Promise<RegisterModel> {
    const result = await this.registerRepository.add(data);
    return result;
  }
}
