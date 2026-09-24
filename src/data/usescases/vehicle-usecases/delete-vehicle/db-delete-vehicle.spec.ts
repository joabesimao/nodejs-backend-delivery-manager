import { DbDeleteVehicle } from "./db-delete-vehicle";
import { DeleteVehicleRepository } from "../../../protocols/db/vehicle/delete-vehicle";

interface SutTypes {
  sut: DbDeleteVehicle;
  deleteVehicleRepositoryStub: DeleteVehicleRepository;
}

const makeDeleteVehicleRepository = (): DeleteVehicleRepository => {
  class DeleteVehicleRepositoryStub implements DeleteVehicleRepository {
    async deleteOne(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteVehicleRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteVehicleRepositoryStub = makeDeleteVehicleRepository();
  const sut = new DbDeleteVehicle(deleteVehicleRepositoryStub);
  return {
    sut,
    deleteVehicleRepositoryStub,
  };
};

describe("DbDeleteVehicle Usecase", () => {
  test("Should call DeleteVehicleRepository with correct id", async () => {
    const { sut, deleteVehicleRepositoryStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteVehicleRepositoryStub, "deleteOne");
    await sut.delete(1);
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should throw if DeleteVehicleRepository throws", async () => {
    const { sut, deleteVehicleRepositoryStub } = makeSut();
    jest
      .spyOn(deleteVehicleRepositoryStub, "deleteOne")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const promise = sut.delete(1);
    await expect(promise).rejects.toThrow();
  });

  test("Should return success message", async () => {
    const { sut } = makeSut();
    const message = await sut.delete(1);
    expect(message).toBe("Deletado com sucesso!");
  });
});
