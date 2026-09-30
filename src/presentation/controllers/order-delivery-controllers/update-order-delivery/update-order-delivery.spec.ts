import { UpdateOrderDeliveryController } from "./update-order-delivery";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { OrderFieldChangeDeniedError } from "../../../errors";
import { forbidden, ok, serverError } from "../../../helpers/http/http-helper";
import { HttpRequest } from "../../../protocols/http";

const makeFakeOrder = (): OrderDeliveryModel =>
  ({ id: 1, amount: 50, quantity: "2", status: "finished" } as unknown as OrderDeliveryModel);

const makeUpdateOrderDelivery = (): UpdateOrderDelivery => {
  class UpdateOrderDeliveryStub implements UpdateOrderDelivery {
    async update(): Promise<OrderDeliveryModel> {
      return makeFakeOrder();
    }
  }
  return new UpdateOrderDeliveryStub();
};

const makeRequest = (body: Record<string, unknown> = {}): HttpRequest => ({
  params: { id: "1" },
  headers: { accountId: 3, accountRole: "entregador" },
  body: { status: "finished", ...body },
});

describe("UpdateOrderDelivery Controller", () => {
  test("Should pass accountId and accountRole from the token, ignoring the body", async () => {
    const updateOrderDelivery = makeUpdateOrderDelivery();
    const updateSpy = jest.spyOn(updateOrderDelivery, "update");
    const sut = new UpdateOrderDeliveryController(updateOrderDelivery);
    await sut.handle(makeRequest({ accountId: 99, accountRole: "admin" }));
    expect(updateSpy).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ accountId: 3, accountRole: "entregador" }) as UpdateOrderDeliveryModel
    );
  });

  test("Should return 200 on success", async () => {
    const sut = new UpdateOrderDeliveryController(makeUpdateOrderDelivery());
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(ok(makeFakeOrder()));
  });

  test("Should return 403 if the usecase denies the field change", async () => {
    const updateOrderDelivery = makeUpdateOrderDelivery();
    jest
      .spyOn(updateOrderDelivery, "update")
      .mockRejectedValueOnce(new OrderFieldChangeDeniedError());
    const sut = new UpdateOrderDeliveryController(updateOrderDelivery);
    const httpResponse = await sut.handle(makeRequest({ amount: 1 }));
    expect(httpResponse).toEqual(forbidden(new OrderFieldChangeDeniedError()));
  });

  test("Should return 500 on unexpected errors", async () => {
    const updateOrderDelivery = makeUpdateOrderDelivery();
    jest.spyOn(updateOrderDelivery, "update").mockRejectedValueOnce(new Error());
    const sut = new UpdateOrderDeliveryController(updateOrderDelivery);
    const httpResponse = await sut.handle(makeRequest());
    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
