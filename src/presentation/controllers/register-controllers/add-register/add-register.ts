import { AddRegister } from "../../../../domain/usescases/register/add-register";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddRegisterController implements Controller {
  constructor(
    private readonly addRegister: AddRegister,
    private readonly validationBody: Validation,
    private readonly validationClient: Validation,
    private readonly validationAddress: Validation
  ) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { client, address } = httpRequest.body;

      const errorBody = await this.validationBody.validate(httpRequest.body);
      if (errorBody) {
        return badRequest(errorBody);
      }

      const errorBodyClient = await this.validationClient.validate(
        httpRequest.body.client
      );
      if (errorBodyClient) {
        return badRequest(errorBodyClient);
      }

      const errorBodyAddress = await this.validationAddress.validate(
        httpRequest.body.address
      );

      if (errorBodyAddress) {
        return badRequest(errorBodyAddress);
      }

      const result = await this.addRegister.add({
        client: client,
        address: address,
      });

      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
