import {
  AddRegister,
  AddRegisterModel,
} from "../../../domain/usescases/add-register/add-register";
import { AddRegisterController } from "./add-register";
import { HttpRequest } from "../../protocols/http";
import { ok, serverError } from "../../helpers/http/http-helper";
import { Validation } from "../../protocols/validation";
import { RegisterModel } from "../../../domain/models/register/register-model";
import { MissingParamError } from "../../errors";

const makeFakeRequest = (): HttpRequest => ({
  body: {
    client: {
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
  },
});
const makeFakeRegisterModel = (): RegisterModel => ({
  id: 1,
  client: {
    name: "any_name",
    lastName: "any_last_name",
    phone: "any_phone",
  },
  address: {
    street: "any_street",
    neighborhood: "any_neighborhood",
    numberHouse: 123,
    reference: "any_reference",
    city: "any_city",
  },
});
interface SutTypes {
  sut: AddRegisterController;
  addRegisterStub: AddRegister;
  validationStub: Validation;
}
const makeAddRegisterStub = (): AddRegister => {
  class AddRegisterStub implements AddRegister {
    async add(data: AddRegisterModel): Promise<RegisterModel> {
      return new Promise((resolve) => resolve(makeFakeRegisterModel()));
    }
  }
  return new AddRegisterStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate(input: any): Error {
      return null as any;
    }
  }
  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const addRegisterStub = makeAddRegisterStub();
  const validationStub = makeValidation();
  const sut = new AddRegisterController(addRegisterStub);
  return {
    sut,
    addRegisterStub,
    validationStub,
  };
};
describe("addRegister Controller", () => {
  test("Should call addRegister with correct values", async () => {
    const { sut, addRegisterStub } = makeSut();
    const addRegisterSpy = jest.spyOn(addRegisterStub, "add");
    const fakeRequest = makeFakeRequest();
    await sut.handle(fakeRequest);
    expect(addRegisterSpy).toHaveBeenCalledWith({
      client: {
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
    });
  });

  test("Should return 400 if not client provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
        address: {
          street: "any_street",
          neighborhood: "any_neighborhood",
          numberHouse: 123,
          reference: "any_reference",
        },
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("client"));
  });
  test("Should return 400 if not address provided", async () => {
    const { sut } = makeSut();

    const fakeRequest: HttpRequest = {
      body: {
        client: {
          name: "any_name",
          lastName: "any_last_name",
          phone: "any_phone",
        },
      },
    };
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError("address"));
  });

  test("Should return 500 if AddRegister throws", async () => {
    const { sut, addRegisterStub } = makeSut();
    jest
      .spyOn(addRegisterStub, "add")
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()) as any)
      );
    const fakeRequest = makeFakeRequest();
    const httpResponse = await sut.handle(fakeRequest);
    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test("Should return 200 on sucess", async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeRegisterModel()));
  });
});
