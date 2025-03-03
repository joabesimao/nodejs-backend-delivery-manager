import { AddAccountRepository } from "../../../../data/protocols/db/account/add-account-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { AddAccountModel } from "../../../../domain/usescases/signup/add-account";
import { MongoHelper } from "../helpers/mongo-helper";

export class AddAccountMongoRepository implements AddAccountRepository {
  
  async add(account: AddAccountModel): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const accountData = await accountCollection.insertOne(account);
    const objectAccount = await accountCollection.findOne(
      accountData.insertedId
    );
    const { _id, name, email, password } = objectAccount;
    const resultAccount: AccountModel = {
      id: _id as any,
      name: name,
      email: email,
      password: password,
    };
    return resultAccount;
  }
}
