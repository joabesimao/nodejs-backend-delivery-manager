import { DbdeleteOrderDelivery } from "./db-delete-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../protocols/db/order-delivery/delete-order-delivery";

interface SutTypes {
  sut: DbdeleteOrderDelivery;
  deleteOrderDeliveryRepositoryStub: DeleteOrderDeliveryByIdRepository;
}

const makeDeleteOrderDeliveryRepository =
  (): DeleteOrderDeliveryByIdRepository => {
    class DeleteOrderDeliveryRepositoryStub
      implements DeleteOrderDeliveryByIdRepository
    {
      async deleteById(id: number): Promise<string> {
        return new Promise((resolve) =>
          resolve("Pedido de Entrega,Deletado com Sucesso!")
        );
      }
    }
    return new DeleteOrderDeliveryRepositoryStub();
  };

const makeSut = (): SutTypes => {
  const deleteOrderDeliveryRepositoryStub = makeDeleteOrderDeliveryRepository();
  const sut = new DbdeleteOrderDelivery(deleteOrderDeliveryRepositoryStub);
  return {
    sut,
    deleteOrderDeliveryRepositoryStub,
  };
};

describe("DbDeleteOrderDelivery Usecase", () => {
  const id = 8;
  test("Should call DeleteOrderDeliveryRepository with correct id", async () => {
    const { sut, deleteOrderDeliveryRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(deleteOrderDeliveryRepositoryStub, "deleteById");
    await sut.delete(id);
    expect(addSpy).toHaveBeenCalledWith(8);
  });
});
