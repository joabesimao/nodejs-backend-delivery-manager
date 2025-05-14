import { PrismaClient } from "@prisma/client";
import { AddRegisterRepository } from "../../../../data/protocols/db/register/add-register-repository";
import { DeleteRegisterByIdRepository } from "../../../../data/protocols/db/register/delete-register-repository";
import {
  LoadRegisterByIdRepository,
  LoadRegisterRepository,
} from "../../../../data/protocols/db/register/load-register-repository";
import { UpdateRegisterRepository } from "../../../../data/protocols/db/register/update-register-repository";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/register/add-register";

export class RegisterMySqlRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    UpdateRegisterRepository,
    DeleteRegisterByIdRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async add(dataInfo: AddRegisterModel): Promise<RegisterModel> {
    const register = await this.prisma.register.create({
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
    const loadRegisterById = await this.prisma.register.findUnique({
      where: { id: id },
    });
    return loadRegisterById as unknown as LoadRegisterModel;
  }

  async updateOneRegisterById(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<LoadRegisterModel> {
    const { client, address } = info;
    const updateRegister = await this.prisma.register.update({
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
    await this.prisma.register.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }

  async loadAll(): Promise<LoadRegisterModel[]> {
    const loadRegisters = await this.prisma.register.findMany({
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
