import { makeAddAddressController } from "./add-address-mysql";
import { AddAddressController } from "../../presentation/controllers/address-controllers/add-address/add-address";
import { Controller } from "../../presentation/protocols/controller";

describe("AddAddressController Factory", () => {
  test("Should return a Controller instance", () => {
    const controller: Controller = makeAddAddressController();
    expect(controller).toBeInstanceOf(AddAddressController);
  });
});
