import { DbAuthentication } from "./db-authentication";
import { AccountModel } from "../../../domain/models/account/account-model";
import { LoadAccountByEmailRepository } from "../../../data/protocols/authentication/load-account-by-email-repository";
import { HashComparer } from "../../../data/protocols/criptography/hash-comparer";
import { AuthenticationModel } from "../../../domain/usescases/authentication/authentication";
import { Encrypter } from "../../protocols/criptography/encrypter";
import { UpdateAccessTokenRepository } from "../../../data/protocols/db/access-token-repository/update-access-token-repository";

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

const makeTokenGenerator = (): Encrypter => {
  class TokenGeneratorStub implements Encrypter {
    async encrypt(id: string): Promise<string> {
      return new Promise((resolve) => resolve("any_token"));
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
interface SutTypes {
  sut: DbAuthentication;
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
  hashCompareStub: HashComparer;
  encrypterStub: Encrypter;
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompare();
  const encrypterStub = makeTokenGenerator();
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  );
  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub,
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
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
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
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBeNull();
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

  test("Should call Encrypter with correct id", async () => {
    const { sut, encrypterStub } = makeSut();
    const generateSpy = jest.spyOn(encrypterStub, "encrypt");
    await sut.auth(makeFakeAuthentication());
    expect(generateSpy).toHaveBeenCalledWith("1");
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

  test("Should return TokenGenerator on succeeds", async () => {
    const { sut } = makeSut();
    const token = await sut.auth(makeFakeAuthentication());
    expect(token).toBe("any_token");
  });

  test("Should call UpdateAccessTokenRepository with correct values", async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateAccessTokenRepositoryStub,
      "updateAccessToken"
    );
    await sut.auth(makeFakeAuthentication());
    expect(updateSpy).toHaveBeenCalledWith(1, "any_token");
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
});
