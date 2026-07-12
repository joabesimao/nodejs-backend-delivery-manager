import { Encrypter } from "../../../data/protocols/criptography/encrypter";
import jwt from "jsonwebtoken";
import { Decrypter } from "../../../data/protocols/criptography/decrypter";
import type { SignOptions } from "jsonwebtoken";

type EncryptOptions = {
  expiresIn?: SignOptions["expiresIn"];
  type?: "access" | "refresh";
};

type JwtPayload = {
  id?: string;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
};

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string, options?: EncryptOptions): Promise<string> {
    const token = await jwt.sign(
      {
        id: value,
        type: options?.type ?? "access",
      },
      this.secret,
      options?.expiresIn ? { expiresIn: options.expiresIn } : undefined,
    );

    return token;
  }

  async decrypt(value: string): Promise<string> {
    try {
      const payload = (await jwt.verify(value, this.secret)) as JwtPayload;

      if (!payload?.id) {
        return null;
      }

      return String(payload.id);
    } catch {
      return null;
    }
  }

  async decode(value: string): Promise<JwtPayload | null> {
    try {
      const payload = (await jwt.verify(value, this.secret)) as JwtPayload;
      return payload;
    } catch {
      return null;
    }
  }
}
