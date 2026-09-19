import { DbAuthentication } from "./db-authentication";
import { AccountModel } from "../../../domain/models/account/account-model";
import { LoadAccountByEmailRepository } from "../../../data/protocols/authentication/load-account-by-email-repository";
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer";
import { AuthenticationModel } from "../../../domain/usescases/authentication/authentication";
import {
  DecodedToken,
  EncryptOptions,
  Encrypter,
} from "../../protocols/criptography/encrypter";
import { UpdateAccessTokenRepository } from "../../../data/protocols/db/access-token-repository/update-access-token-repository";
import { UpdateRefreshTokenRepository } from "../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import { hashToken } from "../../../utils/hash-token";

const fakeAccount = () => {
  const account: AccountModel = {
    id: 1,
    name: "any_name",
    email: "any_email@email.com",
    password: "hashed_password",
  };
  return account;
};

const makeFakeAuthentication = (): AuthenticationModel => ({
  email: "any_email@email.com",
  password: "any_password",
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements LoadAccountByEmailRepository
  {
    async loadAccountByEmail(email: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(fakeAccount()));
    }
  }
  return new LoadAccountByEmailRepositoryStub();
};

const makeHashCompare = (): HashComparer => {
  class HashCompareStub implements HashComparer {
    async compare(value: string, hash: string): Promise<boolean> {
      return new Promise((resolve) => resolve(true));
    }
  }
  return new HashCompareStub();
};

const FAKE_EXP = Math.floor(Date.now() / 1000) + 3600;

const makeTokenGenerator = (): Encrypter => {
  class TokenGeneratorStub implements Encrypter {
    async encrypt(id: string, options?: EncryptOptions): Promise<string> {
      return options?.type === "refresh" ? "any_refresh_token" : "any_access_token";
    }

    async decode(value: string): Promise<DecodedToken | null> {
      return { id: "1", type: "refresh", exp: FAKE_EXP };
    }
  }
  return new TokenGeneratorStub();
};

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken(id: number, token: string): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateAccessTokenRepositoryStub();
};

const makeUpdateRefreshTokenRepository = (): UpdateRefreshTokenRepository => {
  class UpdateRefreshTokenRepositoryStub
    implements UpdateRefreshTokenRepository
  {
    async updateRefreshToken(
      id: number,
      refreshTokenHash: string | null,
      expiresAt: Date | null
    ): Promise<void> {
      return new Promise((resolve) => resolve());
    }
  }
  return new UpdateRefreshTokenRepositoryStub();
};

interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
  updateRefreshTokenRepositoryStub: UpdateRefreshTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const updateRefreshTokenRepositoryStub = makeUpdateRefreshTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    updateRefreshTokenRepositoryStub,
    "15m",
    "7d"
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
    updateRefreshTokenRepositoryStub,
  };
};

describe("DbAuthentication UseCase", () => {
  test("Should call LoadAccountByEmailRepository with correct email", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      "loadAccountByEmail"
    );
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith("any_email@email.com");
  });

  test("Should return null if LoadAccountByEmailRepository returns null ", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadAccountByEmail")
      .mockReturnValueOnce(null as any);
    const authResult = await sut.auth(makeFakeAuthentication());
    expect(authResult).toBeNull();
  });

  test("Should call HashComparer with correct values", async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(null as any);
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith("any_password", "hashed_password");
  });

  test("Should return null if HashComparer returns false", async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest
      .spyOn(hashCompareStub, "compare")
      .mockReturnValueOnce(new Promise((resolve, rejects) => resolve(false)));
    const authResult = await sut.auth(makeFakeAuthentication());
    expect(authResult).toBeNull();
  });

  test("Should throw if LoadAccountByEmailRepository throws ", async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest
      .spyOn(loadAccountByEmailRepositoryStub, "loadAccountByEmail")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("Should call Encrypter to generate access and refresh tokens with correct id and expiry", async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("1", {
      type: "access",
      expiresIn: "15m",
    });
    expect(generateSpy).toHaveBeenCalledWith("1", {
      type: "refresh",
      expiresIn: "7d",
    });
  });

  test("Should throw if Encrypter throws ", async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, "encrypt")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("Should return access and refresh tokens on success", async () => {
    const { sut } = makeSut();
    const authResult = await sut.auth(makeFakeAuthentication());
    expect(authResult).toEqual({
      accessToken: "any_access_token",
      refreshToken: "any_refresh_token",
    });
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith(1, "any_access_token");
  });

  test("Should throw if UpdateAccessTokenRepository throws ", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateAccessTokenRepositoryStub, "updateAccessToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });

  test("Should call UpdateRefreshTokenRepository with the hashed refresh token and expiry", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateRefreshTokenRepositoryStub,
      "updateRefreshToken"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      hashToken("any_refresh_token"),
      new Date(FAKE_EXP * 1000)
    );
  });

  test("Should throw if UpdateRefreshTokenRepository throws ", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow();
  });
});
