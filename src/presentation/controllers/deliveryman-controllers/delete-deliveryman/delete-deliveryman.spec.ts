import { DeleteDeliverymanController } from "./delete-deliveryman";
import { HttpRequest } from "../../../protocols/http";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { DeleteDeliveryman } from "../../../../domain/usescases/deliveryman/delete-deliveryman";

const makeFakeRequest = (): HttpRequest => ({
  params: {
    id: "1",
  },
});

interface SutTypes {
  sut: DeleteDeliverymanController;
  deleteDeliverymanStub: DeleteDeliveryman;
}

const makeDeleteDeliverymanStub = (): DeleteDeliveryman => {
  class DeleteDeliverymanStub implements DeleteDeliveryman {
    async delete(id: number): Promise<string> {
      return await new Promise((resolve) =>
        resolve("Entregador Deletado com Sucesso!")
      );
    }
  }
  return new DeleteDeliverymanStub();
};

const makeSut = (): SutTypes => {
  const deleteDeliverymanStub = makeDeleteDeliverymanStub();
  const sut = new DeleteDeliverymanController(deleteDeliverymanStub);
  return {
    sut,
    deleteDeliverymanStub,
  };
};

describe("DeleteDeliveryman Controller", () => {
  test("Should call DeleteDeliveryman with correct values", async () => {
    const { sut, deleteDeliverymanStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteDeliverymanStub, "delete");
    await sut.handle(makeFakeRequest());
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 500 if DeleteDeliveryman throws", async () => {
    const { sut, deleteDeliverymanStub } = makeSut();
    jest
      .spyOn(deleteDeliverymanStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok("Entregador Deletado com Sucesso!"));
  });
});
