import { DbAddDeliveryman } from "./db-add-deliveryman";
import { AddDeliverymanRepository } from "../../../protocols/db/deliveryman/add-deliveryman";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";
import { AddDeliverymanModel } from "../../../../domain/usescases/deliveryman/add-deliveryman";

interface SutTypes {
  sut: DbAddDeliveryman;
  addDeliverymanRepositoryStub: AddDeliverymanRepository;
}

const makeDeliveryman = (): Deliveryman => ({
  id: 1,
  name: "any_name",
  lastName: "any_lastName",
  numberQualification: "any_numberQualification",
  phone: "any_phone",
  cpf: "any_cpf",
});

const makeAddDeliverymanModel = (): AddDeliverymanModel => ({
  name: "any_name",
  lastName: "any_lastName",
  numberQualification: "any_numberQualification",
  phone: "any_phone",
  cpf: "any_cpf",
});

const makeAddDeliverymanRepository = (): AddDeliverymanRepository => {
  class AddDeliverymanRepositoryStub implements AddDeliverymanRepository {
    async add(deliveryman: AddDeliverymanModel): Promise<Deliveryman> {
      return new Promise((resolve) => resolve(makeDeliveryman()));
    }
  }
  return new AddDeliverymanRepositoryStub();
};

const makeSut = (): SutTypes => {
  const addDeliverymanRepositoryStub = makeAddDeliverymanRepository();
  const sut = new DbAddDeliveryman(addDeliverymanRepositoryStub);
  return {
    sut,
    addDeliverymanRepositoryStub,
  };
};

describe("DbAddDeliveryman Usecase", () => {
  test("Should call AddDeliverymanRepository with correct values", async () => {
    const { sut, addDeliverymanRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addDeliverymanRepositoryStub, "add");
    await sut.add(makeAddDeliverymanModel());
    expect(addSpy).toHaveBeenCalledWith({
      name: "any_name",
      lastName: "any_lastName",
      numberQualification: "any_numberQualification",
      phone: "any_phone",
      cpf: "any_cpf",
    });
  });

  test("Should throw if AddDeliverymanRepository throws", async () => {
    const { sut, addDeliverymanRepositoryStub } = makeSut();
    jest
      .spyOn(addDeliverymanRepositoryStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.add(makeAddDeliverymanModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a Deliveryman on success", async () => {
    const { sut } = makeSut();
    const deliveryman = await sut.add(makeAddDeliverymanModel());
    expect(deliveryman).toEqual(makeDeliveryman());
  });
});
