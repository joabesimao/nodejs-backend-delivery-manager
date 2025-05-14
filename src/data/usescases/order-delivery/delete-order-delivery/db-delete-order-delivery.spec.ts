import { DbdeleteOrderDelivery } from "./db-delete-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/delete-order-delivery";

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

  test("Should DbDeleteOrderDelivery return on success", async () => {
    const { sut } = makeSut();
    const deletedOrder = await sut.delete(id);
    expect(deletedOrder).toBe("Pedido de Entrega,Deletado com Sucesso!");
  });

  test("Should throw if DbDeleteOrderDelivery throws", async () => {
    const { sut, deleteOrderDeliveryRepositoryStub } = makeSut();
    jest
      .spyOn(deleteOrderDeliveryRepositoryStub, "deleteById")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });
});
