import { PrismaClient } from "@prisma/client";
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
import { AddRegisterModel } from "../../../../domain/usescases/register/add-register";
import { pickDefined } from "../helpers/pick-defined";

const REGISTER_INCLUDE = { client: true, address: true } as const;

export class RegisterMySqlRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    LoadRegisterByNameRepository,
    UpdateRegisterRepository,
    DeleteRegisterByIdRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(dataInfo: AddRegisterModel): Promise<RegisterModel> {
    const register = await this.prisma.register.create({
      data: {
        client: {
          create: {
            name: dataInfo.client.name,
            cpf: dataInfo.client.cpf,
            phone: dataInfo.client.phone,
          },
        },
        address: {
          create: {
            street: dataInfo.address.street,
            city: dataInfo.address.city,
            neighborhood: dataInfo.address.neighborhood,
            numberHouse: Number(dataInfo.address.numberHouse),
            reference: dataInfo.address.reference,
          },
        },
      },
    });

    return register as any;
  }

  async loadById(id: number): Promise<LoadRegisterModel> {
    const loadRegisterById = await this.prisma.register.findUnique({
      where: { id: Number(id) },
      include: REGISTER_INCLUDE,
    });
    return loadRegisterById as unknown as LoadRegisterModel;
  }

  async findByName(name: string): Promise<LoadRegisterModel> {
    const registerFound = await this.prisma.register.findFirst({
      where: { client: { name } },
      include: REGISTER_INCLUDE,
    });
    return registerFound as unknown as LoadRegisterModel;
  }

  async updateOneRegisterById(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<LoadRegisterModel> {
    const { client, address } = info;
    const { cpf, ...clientData } = pickDefined(client, ["name", "cpf", "phone", "status"]);
    const { numberHouse, ...addressData } = pickDefined(address, [
      "street",
      "neighborhood",
      "city",
      "numberHouse",
      "reference",
    ]);

    const updateRegister = await this.prisma.register.update({
      where: { id: Number(id) },
      data: {
        client: {
          update: {
            data: {
              ...clientData,
              ...(cpf !== undefined && { cpf: cpf.replace(/\D/g, "") }),
            },
          },
        },
        address: {
          update: {
            data: {
              ...addressData,
              ...(numberHouse !== undefined && { numberHouse: Number(numberHouse) }),
            },
          },
        },
      },
    });
    return updateRegister as unknown as LoadRegisterModel;
  }

  async deleteById(id: number): Promise<string> {
    await this.prisma.$transaction(async (tx) => {
      const { clientId, addressId } = await tx.register.delete({
        where: { id: Number(id) },
      });
      await tx.client.delete({ where: { id: clientId } });
      await tx.address.delete({ where: { id: addressId } });
    });
    return "Deletado com sucesso!";
  }

  async loadAll(): Promise<LoadRegisterModel[]> {
    const loadRegisters = await this.prisma.register.findMany({
      include: REGISTER_INCLUDE,
    });

    return loadRegisters as unknown as LoadRegisterModel[];
  }
}
