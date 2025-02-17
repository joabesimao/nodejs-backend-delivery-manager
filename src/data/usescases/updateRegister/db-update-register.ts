import { UpdateRegister } from "../../../domain/usescases/updateRegister/update-register";
import { UpdateRegisterRepository } from "../../protocols/db/register/update-register-repository";
import { RegisterModel } from "../addRegister/db-addRegister-protocols";

export class DbUpdateRegister implements UpdateRegister {
  constructor(
    private readonly updateRegisterRepository: UpdateRegisterRepository
  ) {}
  async update(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<Promise<RegisterModel>> {
    const result = await this.updateRegisterRepository.updateOneRegisterById(
      id,
      info
    );
    return result;
  }
}
