import { AddClientRepository } from "../../../../data/protocols/db/client-repository/add-client";
import {
  LoadClientRepository,
  LoadOneClientRepository,
} from "../../../../data/protocols/db/client-repository/load-client";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/add-client/add-client";
import { prisma } from "../helpers";

export class ClientMysqlRepository
  implements AddClientRepository, LoadClientRepository, LoadOneClientRepository
{
  async add(client: AddClientModel): Promise<ClientModel> {
    const createClient = await prisma.client.create({
      data: {
        name: client.name,
        lastName: client.lastName,
        phone: client.phone,
        address: {},
      },
    });

    return createClient;
  }

  async loadAll(): Promise<ClientModel[]> {
    const loadClientList = await prisma.client.findMany();
    return loadClientList;
  }

  async loadOne(id: number): Promise<ClientModel> {
    const loadOneClient = await prisma.client.findUnique({
      where: { id: Number(id) },
    });
    return loadOneClient;
  }
}
