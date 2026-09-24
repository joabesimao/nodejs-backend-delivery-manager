import { DeleteVehicleController } from "./delete-vehicle";
import { HttpRequest } from "../../../protocols/http";
import { conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { VehicleInUseError } from "../../../errors";
import { DeleteVehicle } from "../../../../domain/usescases/vehicle/delete-vehicle";

const makeFakeRequest = (): HttpRequest => ({
  params: { id: "1" },
});

interface SutTypes {
  sut: DeleteVehicleController;
  deleteVehicleStub: DeleteVehicle;
}

const makeDeleteVehicleStub = (): DeleteVehicle => {
  class DeleteVehicleStub implements DeleteVehicle {
    async delete(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteVehicleStub();
};

const makeSut = (): SutTypes => {
  const deleteVehicleStub = makeDeleteVehicleStub();
  const sut = new DeleteVehicleController(deleteVehicleStub);
  return {
    sut,
    deleteVehicleStub,
  };
};

describe("DeleteVehicle Controller", () => {
  test("Should call DeleteVehicle with correct id", async () => {
    const { sut, deleteVehicleStub } = makeSut();
    const deleteSpy = jest.spyOn(deleteVehicleStub, "delete");
    await sut.handle(makeFakeRequest());
    expect(deleteSpy).toHaveBeenCalledWith(1);
  });

  test("Should return 500 if DeleteVehicle throws", async () => {
    const { sut, deleteVehicleStub } = makeSut();
    jest
      .spyOn(deleteVehicleStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 409 if vehicle has related records", async () => {
    const { sut, deleteVehicleStub } = makeSut();
    jest
      .spyOn(deleteVehicleStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(Object.assign(new Error(), { code: "P2003" })))
      );
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(conflict(new VehicleInUseError()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok("Deletado com sucesso!"));
  });
});
