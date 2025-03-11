import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { MongoHelper } from "../helpers/mongo-helper";
import { map } from "../register-repository/register-mapper";

export class AccountMongoRepository implements FindAccountByEmailRepository {
  async loadAccountByEmail(email: string): Promise<AccountModel> {
    const accountCollection = await MongoHelper.getCollection("accounts");
    const account = await accountCollection.findOne({
      email: email,
    });
    if (!account) {
      return null;
    }
    return map(account);
  }
}
