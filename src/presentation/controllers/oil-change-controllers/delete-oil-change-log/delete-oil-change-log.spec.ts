import { DeleteOilChangeLogController } from "./delete-oil-change-log";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const deleteOilChangeLog = { delete: jest.fn().mockResolvedValue(true) };
  const sut = new DeleteOilChangeLogController(deleteOilChangeLog);
  return { sut, deleteOilChangeLog };
};

describe("DeleteOilChangeLog Controller", () => {
  test("Should call DeleteOilChangeLog with correct id", async () => {
    const { sut, deleteOilChangeLog } = makeSut();
    await sut.handle({ params: { id: "3" } });
    expect(deleteOilChangeLog.delete).toHaveBeenCalledWith(3);
  });

  test("Should return noExists if log does not exist", async () => {
    const { sut, deleteOilChangeLog } = makeSut();
    deleteOilChangeLog.delete.mockResolvedValueOnce(false);
    expect(await sut.handle({ params: { id: "3" } })).toEqual(noExists());
  });

  test("Should return 500 if DeleteOilChangeLog throws", async () => {
    const { sut, deleteOilChangeLog } = makeSut();
    deleteOilChangeLog.delete.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ params: { id: "3" } })).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ params: { id: "3" } })).toEqual(ok("Deletado com sucesso!"));
  });
});
