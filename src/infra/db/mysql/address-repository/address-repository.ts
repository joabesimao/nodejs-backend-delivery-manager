import { PrismaClient } from "@prisma/client";
import { AddAddressRepository } from "../../../../data/protocols/db/address/add-address";
import { DeleteAddressRepository } from "../../../../data/protocols/db/address/delete-address";
import { LoadAddressRepository } from "../../../../data/protocols/db/address/load-address";
import { UpdateAddressRepository } from "../../../../data/protocols/db/address/update-address";
import { Address } from "../../../../domain/models/register/address-model";
import { AddAddressModel } from "../../../../domain/usescases/address/add-address";
import { UpdateAddressModel } from "../../../../domain/usescases/address/update-address";
import { pickDefined } from "../helpers/pick-defined";

const ADDRESS_FIELDS = ["street", "neighborhood", "city", "numberHouse", "reference"] as const;

export class AddressMysqlRepository
  implements
    AddAddressRepository,
    LoadAddressRepository,
    UpdateAddressRepository,
    DeleteAddressRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async add(address: AddAddressModel): Promise<Address> {
    const createAddress = await this.prisma.address.create({
      data: {
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        numberHouse: address.numberHouse,
        reference: address.reference,
      },
    });
    return createAddress;
  }

  async loadAll(): Promise<Address[]> {
    const loadAllAddress = await this.prisma.address.findMany();
    return loadAllAddress;
  }

  async update(id: number, infoToUpdate: UpdateAddressModel): Promise<Address> {
    return await this.prisma.address.update({
      where: { id: Number(id) },
      data: pickDefined(infoToUpdate, ADDRESS_FIELDS),
    });
  }

  async deleteOne(id: number): Promise<string> {
    await this.prisma.address.delete({
      where: { id: Number(id) },
    });
    return "Deletado com sucesso!";
  }
}
