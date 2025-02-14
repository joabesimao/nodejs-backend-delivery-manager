import { DeleteRegisterByIdRepository } from "../../../data/protocols/db/register/delete-register-repository";
import { DbDeleteRegisterByIdRepository } from "./db-delete-register";
interface SutTypes {
  sut: DbDeleteRegisterByIdRepository;
  deleteRegisterByIdRepositoryStub: DeleteRegisterByIdRepository;
}
const makeDeleteRegisterByIdRepository = (): DeleteRegisterByIdRepository => {
  class DeleteRegisterByIdRepositoryStub
    implements DeleteRegisterByIdRepository
  {
    async deleteById(id: number): Promise<string> {
      return new Promise((resolve) => resolve("Deletado com sucesso!"));
    }
  }
  return new DeleteRegisterByIdRepositoryStub();
};

const makeSut = (): SutTypes => {
  const deleteRegisterByIdRepositoryStub = makeDeleteRegisterByIdRepository();
  const sut = new DbDeleteRegisterByIdRepository(
    deleteRegisterByIdRepositoryStub
  );
  return {
    sut,
    deleteRegisterByIdRepositoryStub,
  };
};
describe("DbDeleteRegistersById", () => {
  test("Should call DeleteRegisterByIdRepository with id correct", async () => {
    const { sut, deleteRegisterByIdRepositoryStub } = makeSut();
    const deleteByIdSpy = jest.spyOn(
      deleteRegisterByIdRepositoryStub,
      "deleteById"
    );
    await sut.delete(1);
    expect(deleteByIdSpy).toHaveBeenCalledWith(1);
  });
});
