import { ObjectId } from "mongodb";
import { AddRegisterRepository } from "../../../../data/protocols/db/register/add-register-repository";
import { DeleteRegisterByIdRepository } from "../../../../data/protocols/db/register/delete-register-repository";
import {
  LoadRegisterRepository,
  LoadRegisterByIdRepository,
} from "../../../../data/protocols/db/register/load-register-repository";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/addRegister/add-register";
import { MongoHelper } from "../helpers/mongo-helper";

export class RegisterMongoRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    DeleteRegisterByIdRepository
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
    const allRegister = await registerCollection.find().toArray();
    return allRegister as unknown as RegisterModel[];
  }

  async loadById(id: number): Promise<LoadRegisterModel> {
    const objId = new ObjectId(id);

    const registerCollection = await MongoHelper.getCollection("registers");
    const reg = await registerCollection.findOne({
      _id: objId,
    });

    return reg as any;
  }

  async deleteById(id: number): Promise<string> {
    const objId = new ObjectId(id);
    const registerCollection = await MongoHelper.getCollection("registers");
    const deleteRegister = await registerCollection.deleteOne({ _id: objId });
    const result = deleteRegister.acknowledged;
    if (result) {
      return "Deletado com sucesso!";
    }
  }
}
