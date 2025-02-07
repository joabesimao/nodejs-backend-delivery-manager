import { AddRegisterRepository } from "../../../../data/protocols/db/register/add-register-repository";
import { LoadRegisterRepository } from "../../../../data/protocols/db/register/load-register-repository";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/addRegister/add-register";
import { MongoHelper } from "../helpers/mongo-helper";

export class RegisterMongoRepository
  implements AddRegisterRepository, LoadRegisterRepository
{
  async add(data: AddRegisterModel): Promise<RegisterModel> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const result = await registerCollection.insertOne(data);
    const object = await registerCollection.findOne(result.insertedId);
    const { _id, client, address, amount, quantity } = object;

    const register: RegisterModel = {
      id: _id as any,
      client: client,
      address: address,
      amount: amount,
      quantity: quantity,
    };
    return register;
  }

  async loadAll(): Promise<LoadRegisterModel[]> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const reg = await registerCollection.find().toArray();
    return reg as any as RegisterModel[];
  }
}
