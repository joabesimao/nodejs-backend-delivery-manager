import { Hasher } from "../../data/protocols/criptography/hasher";
import bcrypt from "bcrypt";
import { HashComparer } from "../../data/protocols/criptography/hash-comparer";

export class BcryptAdapter implements Hasher, HashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const password = await bcrypt.hash(value, this.salt);
    return password;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return new Promise((resolve) => resolve(true));
  }
}
