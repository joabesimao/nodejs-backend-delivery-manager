import { ObjectId } from "mongodb";
import { UpdateAccessTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { FindAccountByEmailRepository } from "../../../../data/protocols/db/account/find-account-by-email-repository";
import { AccountModel } from "../../../../domain/models/account/account-model";
import { MongoHelper } from "../helpers/mongo-helper";
import { map } from "../register-repository/register-mapper";

export class AccountMongoRepository
  implements FindAccountByEmailRepository, UpdateAccessTokenRepository
{
  async updateAccessToken(id: number, token: string): Promise<void> {
    const objectId = new ObjectId(id);
    const accountCollection = await MongoHelper.getCollection("accounts");
    await accountCollection.updateOne(
      {
        _id: objectId,
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
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
