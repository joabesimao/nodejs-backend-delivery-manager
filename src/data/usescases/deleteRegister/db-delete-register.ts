import { DeleteRegister } from "../../../domain/usescases/deleteRegister/delete-register";
import { DeleteRegisterByIdRepository } from "../../protocols/db/register/delete-register-repository";

export class DbDeleteRegisterByIdRepository implements DeleteRegister {
  constructor(
    private readonly deleteByIdRepository: DeleteRegisterByIdRepository
  ) {}
  async delete(id: number): Promise<string> {
    const registerDeleted = await this.deleteByIdRepository.deleteById(id);
    return registerDeleted;
  }
}
