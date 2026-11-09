import { PrismaClient } from "@prisma/client";
import { AddClientRepository } from "../../../../data/protocols/db/client/add-client";
import { DeleteClientRepository } from "../../../../data/protocols/db/client/delete-client";
import {
  LoadClientRepository,
  LoadOneClientRepository,
} from "../../../../data/protocols/db/client/load-client";
import { UpdateClientRepository } from "../../../../data/protocols/db/client/update-client";
import {
  Client,
  ClientModel,
} from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/client/add-client";
import { onlyDigits } from "../helpers/only-digits";
import { pickDefined } from "../helpers/pick-defined";
import { rethrowDeleteError, rethrowUniqueError } from "../helpers/prisma-errors";
import { CpfInUseError } from "../../../../domain/errors";

export class ClientMysqlRepository
  implements
    AddClientRepository,
    LoadClientRepository,
    LoadOneClientRepository,
    UpdateClientRepository,
    DeleteClientRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(client: AddClientModel): Promise<ClientModel> {
    const { name, cpf, phone } = client;
    try {
      return await this.prisma.client.create({
        data: { name, phone, cpf: onlyDigits(cpf) },
      });
    } catch (error) {
      rethrowUniqueError(error, { cpf: () => new CpfInUseError() });
    }
  }

  async loadAll(): Promise<ClientModel[]> {
    const loadClientList = await this.prisma.client.findMany({
      include: {
        Register: {
          include: {
            address: true,
          },
        },
      },
    });
    return loadClientList as any;
  }

  async loadOne(id: number): Promise<ClientModel> {
    const loadOneClient = await this.prisma.client.findUnique({
      where: { id: Number(id) },
    });
    return loadOneClient;
  }

  async update(id: number, infoToUpdate: Client): Promise<Client> {
    const { cpf, ...rest } = pickDefined(infoToUpdate, ["name", "cpf", "phone", "status"]);
    try {
      return await this.prisma.client.update({
        where: { id: Number(id) },
        data: {
          ...rest,
          ...(cpf !== undefined && { cpf: onlyDigits(cpf) }),
        },
      });
    } catch (error) {
      rethrowUniqueError(error, { cpf: () => new CpfInUseError() });
    }
  }

  async deleteOne(id: number): Promise<string> {
    try {
      await this.prisma.client.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      rethrowDeleteError(error);
    }
    return "Deletado com sucesso!";
  }
}
