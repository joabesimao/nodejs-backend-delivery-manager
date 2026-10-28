import { DbAddFuelRefill } from "./db-add-fuel-refill";
import { AddFuelRefillRepository } from "../../../protocols/db/fuel-refill/add-fuel-refill";
import { LoadFuelRefillRepository } from "../../../protocols/db/fuel-refill/load-fuel-refill";
import { RecalculateFuelRefillKmRepository } from "../../../protocols/db/fuel-refill/recalculate-fuel-refill-km";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { KM_OUT_OF_ORDER_MESSAGE } from "../../../helpers/km-sequence";
import { InvalidKmError } from "../../../../presentation/errors";

interface SutTypes {
  sut: DbAddFuelRefill;
  loadFuelRefillRepositoryStub: LoadFuelRefillRepository;
  addFuelRefillRepositoryStub: AddFuelRefillRepository;
  recalculateFuelRefillKmRepositoryStub: RecalculateFuelRefillKmRepository;
}

const makeFakeFuelRefill = (): FuelRefill => ({
  id: 1,
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  previousKm: undefined,
  kmDriven: undefined,
  liters: 20,
  pricePerLiter: 7.5,
  totalValue: 150,
  refillDate: new Date("2026-09-23T00:00:00.000Z"),
  createdAt: new Date("2026-09-23T00:00:00.000Z"),
});

const makeAddFuelRefillModel = (): AddFuelRefillModel => ({
  vehicleId: 1,
  deliverymanId: 1,
  km: 1000,
  liters: 20,
  pricePerLiter: 7.5,
  totalValue: 150,
  refillDate: new Date("2026-09-23T00:00:00.000Z"),
});

const makeExisting = (id: number, km: number, date: string): FuelRefill => ({
  ...makeFakeFuelRefill(),
  id,
  km,
  refillDate: new Date(date),
});

const makeLoadFuelRefillRepositoryStub = (): LoadFuelRefillRepository => {
  class LoadFuelRefillRepositoryStub implements LoadFuelRefillRepository {
    async loadAll(): Promise<FuelRefill[]> {
      return await new Promise((resolve) => resolve([]));
    }
  }
  return new LoadFuelRefillRepositoryStub();
};

const makeAddFuelRefillRepositoryStub = (): AddFuelRefillRepository => {
  class AddFuelRefillRepositoryStub implements AddFuelRefillRepository {
    async add(data: any): Promise<FuelRefill> {
      return await new Promise((resolve) => resolve(makeFakeFuelRefill()));
    }
  }
  return new AddFuelRefillRepositoryStub();
};

const makeRecalculateFuelRefillKmRepositoryStub = (): RecalculateFuelRefillKmRepository => {
  class RecalculateFuelRefillKmRepositoryStub implements RecalculateFuelRefillKmRepository {
    async recalculateKmChain(): Promise<void> {
      return await new Promise((resolve) => resolve());
    }
  }
  return new RecalculateFuelRefillKmRepositoryStub();
};

const makeSut = (): SutTypes => {
  const loadFuelRefillRepositoryStub = makeLoadFuelRefillRepositoryStub();
  const addFuelRefillRepositoryStub = makeAddFuelRefillRepositoryStub();
  const recalculateFuelRefillKmRepositoryStub = makeRecalculateFuelRefillKmRepositoryStub();
  const sut = new DbAddFuelRefill(
    loadFuelRefillRepositoryStub,
    addFuelRefillRepositoryStub,
    recalculateFuelRefillKmRepositoryStub
  );
  return { sut, loadFuelRefillRepositoryStub, addFuelRefillRepositoryStub, recalculateFuelRefillKmRepositoryStub };
};

const mockExisting = (stub: LoadFuelRefillRepository, refills: FuelRefill[]): void => {
  jest.spyOn(stub, "loadAll").mockResolvedValueOnce(refills);
};

describe("DbAddFuelRefill Usecase", () => {
  test("Should load the refills of the same vehicle", async () => {
    const { sut, loadFuelRefillRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadFuelRefillRepositoryStub, "loadAll");
    await sut.add(makeAddFuelRefillModel());
    expect(loadSpy).toHaveBeenCalledWith({ vehicleId: 1 });
  });

  test("Should throw the default InvalidKmError if km is not greater than the last refill", async () => {
    const { sut, loadFuelRefillRepositoryStub, addFuelRefillRepositoryStub } = makeSut();
    mockExisting(loadFuelRefillRepositoryStub, [makeExisting(5, 1000, "2026-09-20")]);
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    await expect(sut.add(makeAddFuelRefillModel())).rejects.toEqual(new InvalidKmError());
    expect(addSpy).not.toHaveBeenCalled();
  });

  test("Should throw an out-of-order InvalidKmError if a backdated km is not lower than the next refill", async () => {
    const { sut, loadFuelRefillRepositoryStub } = makeSut();
    mockExisting(loadFuelRefillRepositoryStub, [
      makeExisting(5, 800, "2026-09-10"),
      makeExisting(6, 1000, "2026-09-30"),
    ]);
    await expect(sut.add(makeAddFuelRefillModel())).rejects.toEqual(new InvalidKmError(KM_OUT_OF_ORDER_MESSAGE));
  });

  test("Should add without previousKm/kmDriven on first refill for the vehicle", async () => {
    const { sut, addFuelRefillRepositoryStub, recalculateFuelRefillKmRepositoryStub } = makeSut();
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    const recalculateSpy = jest.spyOn(recalculateFuelRefillKmRepositoryStub, "recalculateKmChain");
    await sut.add(makeAddFuelRefillModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddFuelRefillModel(),
      previousKm: undefined,
      kmDriven: undefined,
    });
    expect(recalculateSpy).not.toHaveBeenCalled();
  });

  test("Should compute previousKm and kmDriven from the last refill", async () => {
    const { sut, loadFuelRefillRepositoryStub, addFuelRefillRepositoryStub, recalculateFuelRefillKmRepositoryStub } =
      makeSut();
    mockExisting(loadFuelRefillRepositoryStub, [makeExisting(5, 600, "2026-09-20"), makeExisting(4, 300, "2026-09-01")]);
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    const recalculateSpy = jest.spyOn(recalculateFuelRefillKmRepositoryStub, "recalculateKmChain");
    await sut.add(makeAddFuelRefillModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddFuelRefillModel(),
      previousKm: 600,
      kmDriven: 400,
    });
    expect(recalculateSpy).not.toHaveBeenCalled();
  });

  test("Should use the previous refill by date and recalculate the chain for a backdated refill", async () => {
    const { sut, loadFuelRefillRepositoryStub, addFuelRefillRepositoryStub, recalculateFuelRefillKmRepositoryStub } =
      makeSut();
    mockExisting(loadFuelRefillRepositoryStub, [
      makeExisting(6, 1500, "2026-09-30"),
      makeExisting(5, 800, "2026-09-10"),
    ]);
    const addSpy = jest.spyOn(addFuelRefillRepositoryStub, "add");
    const recalculateSpy = jest.spyOn(recalculateFuelRefillKmRepositoryStub, "recalculateKmChain");
    await sut.add(makeAddFuelRefillModel());
    expect(addSpy).toHaveBeenCalledWith({
      ...makeAddFuelRefillModel(),
      previousKm: 800,
      kmDriven: 200,
    });
    expect(recalculateSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw if AddFuelRefillRepository throws", async () => {
    const { sut, addFuelRefillRepositoryStub } = makeSut();
    jest
      .spyOn(addFuelRefillRepositoryStub, "add")
      .mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
    const promise = sut.add(makeAddFuelRefillModel());
    await expect(promise).rejects.toThrow();
  });

  test("Should return a FuelRefill on success", async () => {
    const { sut } = makeSut();
    const refill = await sut.add(makeAddFuelRefillModel());
    expect(refill).toEqual(makeFakeFuelRefill());
  });
});
