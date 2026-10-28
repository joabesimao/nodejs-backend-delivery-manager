import { DeleteNotificationController } from "./delete-notification";
import { InvalidParamError } from "../../../errors";
import { badRequest, noContent, noExists, serverError, unauthorized } from "../../../helpers/http/http-helper";

const makeSut = () => {
  const deleteNotification = { delete: jest.fn().mockResolvedValue(true) };
  return { sut: new DeleteNotificationController(deleteNotification), deleteNotification };
};

describe("DeleteNotification Controller", () => {
  test("Should return 401 without an authenticated account", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: {}, params: { id: "3" } })).toEqual(unauthorized());
  });

  test("Should return 400 for an invalid id", async () => {
    const { sut } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "0" } })).toEqual(
      badRequest(new InvalidParamError("id"))
    );
  });

  test("Should return 204 when deleted and 400 when not found", async () => {
    const { sut, deleteNotification } = makeSut();
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(noContent());
    expect(deleteNotification.delete).toHaveBeenCalledWith(1, 3);
    deleteNotification.delete.mockResolvedValueOnce(false);
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(noExists());
  });

  test("Should return 500 if DeleteNotification throws", async () => {
    const { sut, deleteNotification } = makeSut();
    deleteNotification.delete.mockRejectedValueOnce(new Error());
    expect(await sut.handle({ headers: { accountId: 1 }, params: { id: "3" } })).toEqual(serverError(new Error()));
  });
});
