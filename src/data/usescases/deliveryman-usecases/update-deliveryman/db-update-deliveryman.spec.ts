import { DbUpdateDeliveryman } from "./db-update-deliveryman";
import { UpdateDeliverymanRepository } from "../../../protocols/db/deliveryman/update-deliveryman";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { UpdateDeliverymanModel } from "../../../../domain/usescases/deliveryman/update-deliveryman";

const makeFakeDeliveryman = (): Deliveryman => ({
  id: 1,
  name: "any_name",
  lastName: "any_lastName",
  numberQualification: "any_numberQualification",
  phone: "any_phone",
});

interface SutTypes {
  sut: DbUpdateDeliveryman;
  updateDeliverymanRepositoryStub: UpdateDeliverymanRepository;
}

const makeUpdateDeliverymanRepository = (): UpdateDeliverymanRepository => {
  class UpdateDeliverymanRepositoryStub
    implements UpdateDeliverymanRepository
  {
    async update(
      id: number,
      data: Partial<Deliveryman>
    ): Promise<Deliveryman> {
      return new Promise((resolve) => resolve(makeFakeDeliveryman()));
    }
  }
  return new UpdateDeliverymanRepositoryStub();
};

const makeSut = (): SutTypes => {
  const updateDeliverymanRepositoryStub = makeUpdateDeliverymanRepository();
  const sut = new DbUpdateDeliveryman(updateDeliverymanRepositoryStub);
  return {
    sut,
    updateDeliverymanRepositoryStub,
  };
};

describe("DbUpdateDeliveryman Usecase", () => {
  const id = 1;
  const data: UpdateDeliverymanModel = { name: "any_name" };

  test("Should call UpdateDeliverymanRepository with correct values", async () => {
    const { sut, updateDeliverymanRepositoryStub } = makeSut();
    const updateSpy = jest.spyOn(updateDeliverymanRepositoryStub, "update");
    await sut.update(id, data);
    expect(updateSpy).toHaveBeenCalledWith(1, { name: "any_name" });
  });

  test("Should throw if UpdateDeliverymanRepository throws", async () => {
    const { sut, updateDeliverymanRepositoryStub } = makeSut();
    jest
      .spyOn(updateDeliverymanRepositoryStub, "update")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.update(id, data);
    await expect(promise).rejects.toThrow();
  });

  test("Should return a Deliveryman on success", async () => {
    const { sut } = makeSut();
    const deliveryman = await sut.update(id, data);
    expect(deliveryman).toEqual(makeFakeDeliveryman());
  });
});
