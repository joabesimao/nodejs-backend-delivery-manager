import { AddRegisterRepository } from "../../../../data/protocols/db/register/add-register-repository";
import { DeleteRegisterByIdRepository } from "../../../../data/protocols/db/register/delete-register-repository";
import {
  LoadRegisterByIdRepository,
  LoadRegisterByNameRepository,
  LoadRegisterRepository,
} from "../../../../data/protocols/db/register/load-register-repository";
import { UpdateRegisterRepository } from "../../../../data/protocols/db/register/update-register-repository";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/add-register/add-register";
//import { prisma } from "../helpers";

export class RegisterMySqlRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    LoadRegisterByNameRepository,
    UpdateRegisterRepository,
    DeleteRegisterByIdRepository
{
  async add(data: AddRegisterModel): Promise<RegisterModel> {
    /* const createRegister = await prisma.register.create({
      data: { client: {}, address: {} },
    }); */
    return null
  }
  loadById(id: number): Promise<LoadRegisterModel> {
    throw new Error("Method not implemented.");
  }
  findByName(name: string): Promise<LoadRegisterModel> {
    throw new Error("Method not implemented.");
  }
  updateOneRegisterById(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<LoadRegisterModel> {
    throw new Error("Method not implemented.");
  }
  async deleteById(id: number): Promise<string> {
    return null;
  }
  async loadAll(): Promise<LoadRegisterModel[]> {
    return null;
  }
}
