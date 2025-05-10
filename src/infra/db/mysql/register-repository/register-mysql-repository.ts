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
import { prisma } from "../helpers";

export class RegisterMySqlRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    UpdateRegisterRepository,
    DeleteRegisterByIdRepository
{
  async add(dataInfo: AddRegisterModel): Promise<RegisterModel> {
    const register = await prisma.register.create({
      data: {
        client: {
          create: {
            name: dataInfo.client.name,
            lastName: dataInfo.client.lastName,
            phone: dataInfo.client.phone,
          },
        },
        address: {
          create: {
            street: dataInfo.address.street,
            city: dataInfo.address.city,
            neighborhood: dataInfo.address.neighborhood,
            numberHouse: dataInfo.address.numberHouse,
            reference: dataInfo.address.reference,
          },
        },
      },
    });

    return register as any;
  }

  async loadById(id: number): Promise<LoadRegisterModel> {
    const loadRegisterById = await prisma.register.findUnique({
      where: { id: id },
    });
    return loadRegisterById as unknown as LoadRegisterModel;
  }

  async updateOneRegisterById(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<LoadRegisterModel> {
    const { client, address } = info;
    const updateRegister = await prisma.register.update({
      where: {
        id: Number(id),
      },
      data: {
        client: {
          update: {
            data: {
              ...client,
            },
          },
        },
        address: {
          update: {
            data: {
              ...address,
            },
          },
        },
      },
    });
    return updateRegister as unknown as LoadRegisterModel;
  }

  async deleteById(id: number): Promise<string> {
    await prisma.register.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }

  async loadAll(): Promise<LoadRegisterModel[]> {
    const loadRegisters = await prisma.register.findMany({
      include: {
        client: {
          include: {
            Register: {
              include: {
                client: true,
                address: true,
              },
            },
          },
        },
      },
    });

    return loadRegisters as unknown as LoadRegisterModel[];
  }
}
