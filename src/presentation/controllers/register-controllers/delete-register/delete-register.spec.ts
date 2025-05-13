import { DeleteRegisterController } from "./delete-register";
import { DeleteRegister } from "../../../../domain/usescases/register/delete-register";
import { ok, serverError } from "../../../helpers/http/http-helper";

const makeDeleteRegisterStub = (): DeleteRegister => {
  class DeleteRegisterStub implements DeleteRegister {
    async delete(id: Number): Promise<string> {
      return new Promise((resolve) => resolve("registro apagado com sucesso"));
    }
  }
  return new DeleteRegisterStub();
};

interface SutTypes {
  sut: DeleteRegisterController;
  deleteRegisterStub: DeleteRegister;
}
const makeSut = (): SutTypes => {
  const deleteRegisterStub = makeDeleteRegisterStub();
  const sut = new DeleteRegisterController(deleteRegisterStub);
  return {
    sut,
    deleteRegisterStub,
  };
};

const id = {
  params: 1,
};
describe("DeleteRegister Controller", () => {
  test("Should call DeleteRegister with correct values", async () => {
    const { sut, deleteRegisterStub } = makeSut();
    const deleteRegisterSpy = jest.spyOn(deleteRegisterStub, "delete");
    await sut.handle(id);
    expect(deleteRegisterSpy).toHaveBeenCalled();
  });

  test("Should call DeleteRegister on success", async () => {
    const { sut } = makeSut();

    const deletedRegister = await sut.handle(id);
    expect(deletedRegister).toEqual(ok("registro apagado com sucesso"));
  });

  test("Should return 500 if DeleteRegister throws", async () => {
    const { sut, deleteRegisterStub } = makeSut();
    jest
      .spyOn(deleteRegisterStub, "delete")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const deletedRegister = await sut.handle(id);
    expect(deletedRegister).toEqual(serverError(new Error("")));
  });
});
