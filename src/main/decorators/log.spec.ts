import { LogControllerDecorator } from "./log";
import { Controller } from "../../presentation/protocols/controller";
import { HttpRequest, HttpResponse } from "../../presentation/protocols/http";

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        statusCode: 200,
        body: {
          name: "Joabe",
        },
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }
  return new ControllerStub();
};

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub();
  const sut = new LogControllerDecorator(controllerStub);
  return {
    sut,
    controllerStub,
  };
};

describe("LogController Decorator", () => {
  test("Should call controller handle", async () => {
    const { controllerStub, sut } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, "handle");

    const httpRequest = {
      body: {
        client: {
          id: 1,
          name: "any_name",
          lastName: "any_last_name",
          phone: "any_phone",
        },
        address: {
          street: "any_street",
          neighborhood: "any_neighborhood",
          numberHouse: 123,
          reference: "any_reference",
        },
        quantity: "any_quantity",
        amount: 1,
      },
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
