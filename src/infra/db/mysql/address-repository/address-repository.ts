import { AddAddressRepository } from "../../../../data/protocols/db/address/add-address";
import { Address } from "../../../../domain/models/register/address-model";
import { AddAddressModel } from "../../../../domain/usescases/add-address/add-address";
import { prisma } from "../helpers";

export class AddressMysqlRepository implements AddAddressRepository {
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
}
