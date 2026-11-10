import { UpdateAccount } from "../../../../domain/usescases/account/update-account";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";
import {
  badRequest,
  noExists,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { mapDomainError } from "../../../helpers/http/map-domain-error";

export class UpdateAccountController implements Controller {
  constructor(
    private readonly updateAccount: UpdateAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const id = Number(httpRequest.params.id);
      const requesterId = Number(httpRequest.actor?.id);
      const { name, email, role, active, password } = httpRequest.body;

      const account = await this.updateAccount.update(
        id,
        { name, email, role, active, password },
        requesterId,
      );

      if (!account) {
        return noExists();
      }

      return ok(account);
    } catch (error) {
      return mapDomainError(error) ?? serverError(error);
    }
  }
}
