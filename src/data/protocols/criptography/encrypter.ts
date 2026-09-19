export interface EncryptOptions {
  expiresIn?: string;
  type?: "access" | "refresh";
}

export interface DecodedToken {
  id?: string;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}

export interface Encrypter {
  encrypt(value: string, options?: EncryptOptions): Promise<string>;
  decode(value: string): Promise<DecodedToken | null>;
}
