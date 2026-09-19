import { DbLoadDeliveryman } from "./db-load-deliveryman";
import { LoadDeliverymanRepository } from "../../../protocols/db/deliveryman/load-deliveryman";
import { Deliveryman } from "../../../../domain/models/deliveryman/deliveryman-model";

const makeFakeDeliverymanList = (): Deliveryman[] => [
  {
    id: 1,
    name: "any_name",
    lastName: "any_lastName",
    numberQualification: "any_numberQualification",
    phone: "any_phone",
  },
  {
    id: 2,
    name: "other_name",
    lastName: "other_lastName",
    numberQualification: "other_numberQualification",
    phone: "other_phone",
  },
];

interface SutTypes {
  sut: DbLoadDeliveryman;
  loadDeliverymanRepositoryStub: LoadDeliverymanRepository;
}

const makeLoadDeliverymanRepository = (): LoadDeliverymanRepository => {
  class LoadDeliverymanRepositoryStub implements LoadDeliverymanRepository {
    async loadAll(): Promise<Deliveryman[]> {
      return new Promise((resolve) => resolve(makeFakeDeliverymanList()));
    }
  }
  return new LoadDeliverymanRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadDeliverymanRepositoryStub = makeLoadDeliverymanRepository();
  const sut = new DbLoadDeliveryman(loadDeliverymanRepositoryStub);
  return {
    sut,
    loadDeliverymanRepositoryStub,
  };
};

describe("DbLoadDeliveryman Usecase", () => {
  test("Should call LoadDeliverymanRepository", async () => {
    const { sut, loadDeliverymanRepositoryStub } = makeSut();
    const loadAllSpy = jest.spyOn(loadDeliverymanRepositoryStub, "loadAll");
    await sut.load();
    expect(loadAllSpy).toHaveBeenCalled();
  });

  test("Should throw if LoadDeliverymanRepository throws", async () => {
    const { sut, loadDeliverymanRepositoryStub } = makeSut();
    jest
      .spyOn(loadDeliverymanRepositoryStub, "loadAll")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.load();
    await expect(promise).rejects.toThrow();
  });

  test("Should return a list of Deliveryman on success", async () => {
    const { sut } = makeSut();
    const deliverymen = await sut.load();
    expect(deliverymen).toEqual(makeFakeDeliverymanList());
  });
});
