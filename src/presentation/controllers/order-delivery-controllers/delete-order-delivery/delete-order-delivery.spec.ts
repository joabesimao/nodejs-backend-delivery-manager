import { DeleteOrderDeliveryController } from "./delete-order-delivery";
import { DeleteOrderDelivery } from "../../../../domain/usescases/order-delivery/delete-order-delivery";
import { conflict, noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { NotFoundError } from "../../../../domain/errors/not-found-error";
import { ResourceInUseError } from "../../../../domain/errors/resource-in-use-error";

interface SutTypes {
  sut: DeleteOrderDeliveryController;
  deleteOrderDeliveryStub: DeleteOrderDelivery;
}

const id = {
  params: 1,
};

const makeSut = (): SutTypes => {
  const deleteOrderDeliveryStub = makeDeleteOrderDeliveryStub();
  const sut = new DeleteOrderDeliveryController(deleteOrderDeliveryStub);
  return {
    sut,
    deleteOrderDeliveryStub,
  };
};

const makeDeleteOrderDeliveryStub = (): DeleteOrderDelivery => {
  class DeleteRegisterStub implements DeleteOrderDelivery {
    async delete(id: number): Promise<string> {
      return await new Promise((resolve) =>
        resolve("Pedido de Entrega Apagado com Sucesso")
      );
    }
  }
  return new DeleteRegisterStub();
};

describe("DeleteOrderDelivery Controller", () => {
  test("Should call DeleteOrder with correct values", async () => {
    const { sut, deleteOrderDeliveryStub } = makeSut();
    const deleteRegisterSpy = jest.spyOn(deleteOrderDeliveryStub, "delete");
    await sut.handle(id);
    expect(deleteRegisterSpy).toHaveBeenCalled();
  });

  test("Should return the message with DeleteOrderDelivery on success", async () => {
    const { sut } = makeSut();
    const deletedOrder = await sut.handle(id);
    expect(deletedOrder).toEqual(ok("Pedido de Entrega Apagado com Sucesso"));
  });

  test("Should return 500 if DeleteRegister throws", async () => {
    const { sut, deleteOrderDeliveryStub } = makeSut();
    jest
      .spyOn(deleteOrderDeliveryStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const deletedRegister = await sut.handle(id);
    expect(deletedRegister).toEqual(serverError(new Error("")));
  });

  test("Should return noExists if DeleteOrderDelivery throws NotFoundError", async () => {
    const { sut, deleteOrderDeliveryStub } = makeSut();
    const notFoundError = new NotFoundError();
    jest
      .spyOn(deleteOrderDeliveryStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(notFoundError))
      );

    const deletedRegister = await sut.handle(id);
    expect(deletedRegister).toEqual(noExists());
  });

  test("Should return conflict if DeleteOrderDelivery throws ResourceInUseError", async () => {
    const { sut, deleteOrderDeliveryStub } = makeSut();
    const resourceInUseError = new ResourceInUseError();
    jest
      .spyOn(deleteOrderDeliveryStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(resourceInUseError))
      );

    const deletedRegister = await sut.handle(id);
    expect(deletedRegister).toEqual(conflict(resourceInUseError));
  });
});
