import { DbDeleteDeliveryman } from "./db-delete-deliveryman";
import { DeleteDeliverymanRepository } from "../../../protocols/db/deliveryman/delete-deliveryman";

interface SutTypes {
  sut: DbDeleteDeliveryman;
  deleteDeliverymanRepositoryStub: DeleteDeliverymanRepository;
}

const makeDeleteDeliverymanRepository = (): DeleteDeliverymanRepository => {
  class DeleteDeliverymanRepositoryStub
    implements DeleteDeliverymanRepository
  {
    async deleteOne(id: number): Promise<string> {
      return new Promise((resolve) =>
        resolve("Entregador Deletado com Sucesso!")
      );
    }
  }
  return new DeleteDeliverymanRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteDeliverymanRepositoryStub = makeDeleteDeliverymanRepository();
  const sut = new DbDeleteDeliveryman(deleteDeliverymanRepositoryStub);
  return {
    sut,
    deleteDeliverymanRepositoryStub,
  };
};

describe("DbDeleteDeliveryman Usecase", () => {
  const id = 1;

  test("Should call DeleteDeliverymanRepository with correct values", async () => {
    const { sut, deleteDeliverymanRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(
      deleteDeliverymanRepositoryStub,
      "deleteOne"
    );
    await sut.delete(id);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw if DeleteDeliverymanRepository throws", async () => {
    const { sut, deleteDeliverymanRepositoryStub } = makeSut();
    jest
      .spyOn(deleteDeliverymanRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(id);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a message on success", async () => {
    const { sut } = makeSut();
    const result = await sut.delete(id);
    expect(result).toEqual("Entregador Deletado com Sucesso!");
  });
});
