import { AddClientRepository } from "../../../../data/protocols/db/client-repository/add-client";
import { LoadClientRepository } from "../../../../data/protocols/db/client-repository/load-client";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/add-client/add-client";
import { prisma } from "../helpers";

export class ClientMysqlRepository
  implements AddClientRepository, LoadClientRepository
{
  async add(client: AddClientModel): Promise<ClientModel> {
    const createClient = await prisma.client.create({
      data: {
        name: client.name,
        lastName: client.lastName,
        phone: client.phone,
      },
    });

    return createClient;
  }

  async loadAll(): Promise<ClientModel[]> {
    const loadClientList = await prisma.client.findMany();
    return loadClientList;
  }
}

