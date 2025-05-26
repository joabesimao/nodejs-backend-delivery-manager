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

export class ClientMysqlRepository
  implements
    AddClientRepository,
    LoadClientRepository,
    LoadOneClientRepository,
    UpdateClientRepository,
    DeleteClientRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async add(client: AddClientModel): Promise<ClientModel> {
    const createClient = await this.prisma.client.create({
      data: {
        name: client.name,
        lastName: client.lastName,
        phone: client.phone,
      },
    });

    return createClient;
  }

  async loadAll(): Promise<ClientModel[]> {
    const loadClientList = await this.prisma.client.findMany();
    return loadClientList;
  }

  async loadOne(id: number): Promise<ClientModel> {
    const loadOneClient = await this.prisma.client.findUnique({
      where: { id: Number(id) },
    });
    return loadOneClient;
  }

  async update(id: number, infoToUpdate: Client): Promise<Client> {
    const updateClient = await this.prisma.client.update({
      where: { id: Number(id) },
      data: {
        ...infoToUpdate,
      },
    });
    return updateClient;
  }

  async deleteOne(id: number): Promise<string> {
    const deleteOneClient = await this.prisma.client.delete({
      where: { id: Number(id) },
    });

    return "Deletado com sucesso!";
  }
}
