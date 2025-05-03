import { AddClientRepository } from "../../../../data/protocols/db/client-repository/add-client";
import { ClientModel } from "../../../../domain/models/client/client-model";
import { AddClientModel } from "../../../../domain/usescases/add-client/add-client";
import { prisma } from "../helpers";

export class ClientMysqlRepository implements AddClientRepository {
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
}
