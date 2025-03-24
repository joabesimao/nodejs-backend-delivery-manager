import { DeleteOrderDeliveryController } from "./delete-order-delivery";
import { DeleteOrderDelivery } from "../../../domain/usescases/order-delivery/delete-order-delivery";
import { ok } from "../../helpers/http/http-helper";

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
});
