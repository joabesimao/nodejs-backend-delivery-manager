import { DeleteOrderDeliveryController } from "./delete-order-delivery";
import { DeleteOrderDelivery } from "../../../../domain/usescases/order-delivery/delete-order-delivery";
import { ok, serverError } from "../../../helpers/http/http-helper";

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
    async delete(id: Number): Promise<string> {
      return new Promise((resolve) =>
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
});
