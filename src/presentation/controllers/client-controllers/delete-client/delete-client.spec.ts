import { DeleteClientController } from "./delete-client";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { DeleteClient } from "../../../../domain/usescases/client/delete-client";
import { HttpRequest } from "../../../protocols/http";

interface SutTypes {
  sut: DeleteClientController;
  deleteClientStub: DeleteClient;
}

const fakeHttpRequest: HttpRequest = {
  params: {
    id: 4,
  },
};

const makeDeleteClient = (): DeleteClient => {
  class DeleteClientStub implements DeleteClient {
    async delete(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Client Deletado com Sucesso!"));
    }
  }
  return new DeleteClientStub();
};

const makeSut = (): SutTypes => {
  const deleteClientStub = makeDeleteClient();
  const sut = new DeleteClientController(deleteClientStub);
  return {
    sut,
    deleteClientStub,
  };
};

describe("Delete CLient Controller", () => {
  const id = 7;

  test("Should call DeleteClient", async () => {
    const { sut, deleteClientStub } = makeSut();
    const loadSpy = jest.spyOn(deleteClientStub, "delete");
    await sut.handle(fakeHttpRequest);
    expect(loadSpy).toHaveBeenCalled();
  });

  test("Should call DeleteClient with correct values", async () => {
    const { sut, deleteClientStub } = makeSut();
    const loadSpy = jest.spyOn(deleteClientStub, "delete");
    await sut.handle(fakeHttpRequest);
    expect(loadSpy).toHaveBeenCalledWith(4);
  });

  test("Should delete one client and return 200 on success", async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(fakeHttpRequest);
    expect(httpResponse).toEqual(ok("Client Deletado com Sucesso!"));
  });

  test("Should return 500 if Delete throws", async () => {
    const { sut, deleteClientStub } = makeSut();
    jest
      .spyOn(deleteClientStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(fakeHttpRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
