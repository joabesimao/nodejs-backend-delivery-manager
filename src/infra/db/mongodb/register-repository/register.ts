import { ObjectId } from "mongodb";
import { AddRegisterRepository } from "../../../../data/protocols/db/register/add-register-repository";
import { DeleteRegisterByIdRepository } from "../../../../data/protocols/db/register/delete-register-repository";
import {
  LoadRegisterRepository,
  LoadRegisterByIdRepository,
  LoadRegisterByNameRepository,
} from "../../../../data/protocols/db/register/load-register-repository";
import { UpdateRegisterRepository } from "../../../../data/protocols/db/register/update-register-repository";
import { LoadRegisterModel } from "../../../../domain/models/register/register-load-model";
import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/register/add-register";
import { MongoHelper } from "../helpers/mongo-helper";

export class RegisterMongoRepository
  implements
    AddRegisterRepository,
    LoadRegisterRepository,
    LoadRegisterByIdRepository,
    LoadRegisterByNameRepository,
    UpdateRegisterRepository,
    DeleteRegisterByIdRepository
{
  async add(data: AddRegisterModel): Promise<RegisterModel> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const result = await registerCollection.insertOne(data);
    const object = await registerCollection.findOne(result.insertedId);
    const { _id, client, address } = object;

    const register: RegisterModel = {
      id: _id as any,
      client: client,
      address: address,
    };
    return register;
  }

  async loadAll(): Promise<LoadRegisterModel[]> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const allRegister = await registerCollection.find().toArray();
    const numberOfRegisters = await this.countRegister();
    return allRegister.concat(
      `${numberOfRegisters} registros` as any
    ) as unknown as RegisterModel[];
  }

  async loadById(id: number): Promise<LoadRegisterModel> {
    const objId = new ObjectId(id);

    const registerCollection = await MongoHelper.getCollection("registers");
    const reg = await registerCollection.findOne({
      _id: objId,
    });

    return reg as unknown as LoadRegisterModel;
  }

  async findByName(name: string): Promise<LoadRegisterModel> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const register = await registerCollection.findOne({
      "client.name": name,
    });
    return register as unknown as LoadRegisterModel;
  }

  async updateOneRegisterById(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<LoadRegisterModel> {
    const objId = new ObjectId(id);
    const registerCollection = await MongoHelper.getCollection("registers");
    await registerCollection.updateOne({ _id: objId }, { $set: { ...info } });
    const result = await registerCollection.findOne({ _id: objId });
    return result as unknown as LoadRegisterModel;
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

  async countRegister(): Promise<number> {
    const registerCollection = await MongoHelper.getCollection("registers");
    const numberRegisters = registerCollection.countDocuments();
    return numberRegisters;
  }
}
