import {
  DecodedToken,
  EncryptOptions,
  Encrypter,
} from "../../../data/protocols/criptography/encrypter";
import { randomUUID } from "crypto";
import jwt, { SignOptions } from "jsonwebtoken";
import { Decrypter } from "../../../data/protocols/criptography/decrypter";

type JwtPayload = DecodedToken;

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string, options?: EncryptOptions): Promise<string> {
    const signOptions: SignOptions = {
      ...(options?.expiresIn && {
        expiresIn: options.expiresIn as SignOptions["expiresIn"],
      }),
      // jti aleatório: sem ele, dois refresh tokens emitidos no mesmo segundo
      // seriam idênticos e a detecção de reuso não os distinguiria.
      ...(options?.type === "refresh" && { jwtid: randomUUID() }),
    };

    return jwt.sign(
      {
        id: value,
        type: options?.type ?? "access",
      },
      this.secret,
      Object.keys(signOptions).length ? signOptions : undefined,
    );
  }

  async decrypt(value: string): Promise<string> {
    let payload: JwtPayload;

    try {
      payload = jwt.verify(value, this.secret) as JwtPayload;
    } catch {
      return null;
    }

    // Only access tokens may authenticate requests; refresh tokens are
    // accepted exclusively by the refresh-token flow (via decode()).
    if (!payload?.id || payload.type !== "access") {
      return null;
    }

    return String(payload.id);
  }

  async decode(value: string): Promise<JwtPayload | null> {
    try {
      return jwt.verify(value, this.secret) as JwtPayload;
    } catch {
      return null;
    }
  }
}
