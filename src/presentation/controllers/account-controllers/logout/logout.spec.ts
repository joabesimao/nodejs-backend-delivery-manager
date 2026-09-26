import { LogoutController } from "./logout";
import { UpdateRefreshTokenRepository } from "../../../../data/protocols/db/access-token-repository/update-refresh-token-repository";
import { HttpRequest } from "../../../protocols/http";
import { noContent, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeUpdateRefreshTokenRepository =
  (): UpdateRefreshTokenRepository => {
    class UpdateRefreshTokenRepositoryStub
      implements UpdateRefreshTokenRepository {
      async updateRefreshToken(
        id: number,
        refreshTokenHash: string | null,
        expiresAt: Date | null
      ): Promise<void> {
        return await new Promise((resolve) => resolve());
      }
    }
    return new UpdateRefreshTokenRepositoryStub();
  };

interface SutTypes {
  sut: LogoutController;
  updateRefreshTokenRepositoryStub: UpdateRefreshTokenRepository;
}

const makeSut = (): SutTypes => {
  const updateRefreshTokenRepositoryStub = makeUpdateRefreshTokenRepository();
  const sut = new LogoutController(updateRefreshTokenRepositoryStub);
  return { sut, updateRefreshTokenRepositoryStub };
};

const makeFakeRequest = (): HttpRequest => ({
  headers: { accountId: 1 },
});

describe("Logout Controller", () => {
  test("Should return 401 if accountId is missing from headers", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({ headers: {} });
    expect(httpResponse).toEqual(unauthorized());
  });

  test("Should call UpdateRefreshTokenRepository with correct values", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(
      updateRefreshTokenRepositoryStub,
      "updateRefreshToken"
    );
    await sut.handle(makeFakeRequest());
    expect(updateSpy).toHaveBeenCalledWith(1, null, null);
  });

  test("Should return 204 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(noContent());
  });

  test("Should return 500 if UpdateRefreshTokenRepository throws", async () => {
    const { sut, updateRefreshTokenRepositoryStub } = makeSut();
    jest
      .spyOn(updateRefreshTokenRepositoryStub, "updateRefreshToken")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
