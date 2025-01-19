import { Encrypter } from "../../data/protocols/encrypter/encrypter";
import bcrypt from "bcrypt";

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}
  async encrypt(value: string): Promise<string> {
    const password = await bcrypt.hash(value,this.salt);
    return password;
  }
}
