import { AddAddressRepository } from "../../../../data/protocols/db/address/add-address";
import { LoadAddressRepository } from "../../../../data/protocols/db/address/load-address";
import { Address } from "../../../../domain/models/register/address-model";
import { AddAddressModel } from "../../../../domain/usescases/add-address/add-address";
import { prisma } from "../helpers";

export class AddressMysqlRepository
  implements AddAddressRepository, LoadAddressRepository
{
  async add(address: AddAddressModel): Promise<Address> {
    const createAddress = await prisma.address.create({
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
    const loadAllAddress = await prisma.address.findMany();
    return loadAllAddress;
  }
}
