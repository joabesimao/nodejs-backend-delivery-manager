import { AddAccount } from "../../../../domain/usescases/signup/add-account";
import { EmailInUseError } from "../../../errors";
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class AddStaffAccountController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password, role } = httpRequest.body;

      const account = await this.addAccount.add({
        name,
        email,
        password,
        role,
      });
      if (!account) {
        return forbidden(new EmailInUseError());
      }

      return ok({
        id: account.id,
        name: account.name,
        email: account.email,
        role: account.role,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
