import {
  DecodedToken,
  EncryptOptions,
  Encrypter,
} from "../../../data/protocols/criptography/encrypter";
import jwt, { SignOptions } from "jsonwebtoken";
import { Decrypter } from "../../../data/protocols/criptography/decrypter";

type JwtPayload = DecodedToken;

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string, options?: EncryptOptions): Promise<string> {
    const token = await jwt.sign(
      {
        id: value,
        type: options?.type ?? "access",
      },
      this.secret,
      options?.expiresIn
        ? ({
            expiresIn: options.expiresIn,
          } as SignOptions)
        : undefined,
    );

    return token;
  }

  async decrypt(value: string): Promise<string> {
    let payload: JwtPayload;

    try {
      payload = (await jwt.verify(value, this.secret)) as JwtPayload;
    } catch {
      return null;
    }

    if (!payload?.id) {
      return null;
    }

    return String(payload.id);
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
