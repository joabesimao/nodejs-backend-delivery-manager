import { DeleteFuelRefillController } from "./delete-fuel-refill";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const deleteFuelRefill = { delete: jest.fn().mockResolvedValue(true) };
  const sut = new DeleteFuelRefillController(deleteFuelRefill);
  return { sut, deleteFuelRefill };
};

describe("DeleteFuelRefill Controller", () => {
  test("Should call DeleteFuelRefill with correct id", async () => {
    const { sut, deleteFuelRefill } = makeSut();
    await sut.handle({ params: { id: "3" } });
    expect(deleteFuelRefill.delete).toHaveBeenCalledWith(3);
  });

  test("Should return noExists if refill does not exist", async () => {
    const { sut, deleteFuelRefill } = makeSut();
    deleteFuelRefill.delete.mockResolvedValueOnce(false);
    expect(await sut.handle({ params: { id: "3" } })).toEqual(noExists());
  });

  test("Should return 500 if DeleteFuelRefill throws", async () => {
    const { sut, deleteFuelRefill } = makeSut();
    deleteFuelRefill.delete.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ params: { id: "3" } })).toEqual(serverError(new Error()));
  });

  test("Should return 200 on success", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ params: { id: "3" } })).toEqual(ok("Deletado com sucesso!"));
  });
});
