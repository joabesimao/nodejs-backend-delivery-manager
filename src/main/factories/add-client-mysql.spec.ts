import { makeAddClientController } from "./add-client-mysql";
import { AddClientController } from "../../presentation/controllers/client-controllers/add-client/add-client";
import { Controller } from "../../presentation/protocols/controller";

describe("AddClientController Factory", () => {
  test("Should return a Controller instance", () => {
    const controller: Controller = makeAddClientController();
    expect(controller).toBeInstanceOf(AddClientController);
  });
});
