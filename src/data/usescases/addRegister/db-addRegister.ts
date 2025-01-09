import {
  AddRegister,
  AddRegisterModel,
} from "../../../domain/usescases/addRegister/add-register";
import { AddRegisterRepository } from "../../protocols/db/register/add-register-repository";

export class DbAddRegister implements AddRegister {
  constructor(private readonly registerRepository: AddRegisterRepository) {}
  async add(data: AddRegisterModel): Promise<void> {
    await this.registerRepository.add(data);
  }
}
