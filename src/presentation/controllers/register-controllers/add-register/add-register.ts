import { AddRegister } from "../../../../domain/usescases/register/add-register";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";
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
        return mapDomainError(errorBodyClient) ?? badRequest(errorBodyClient);
      }

      const errorBodyAddress = await this.validationAddress.validate(
        httpRequest.body.address
      );

      if (errorBodyAddress) {
        return badRequest(errorBodyAddress);
      }

      const result = await this.addRegister.add({
        client,
        address,
      });

      return ok(result);
    } catch (error) {
      const domainResponse = mapDomainError(error);
      if (domainResponse) {
        return domainResponse;
      }
      console.error("[AddRegisterController] Error:", error);
      return serverError(error);
    }
  }
}
