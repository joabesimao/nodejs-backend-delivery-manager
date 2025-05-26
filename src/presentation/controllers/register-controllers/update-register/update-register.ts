import { Prisma } from "@prisma/client";
import { UpdateRegister } from "../../../../domain/usescases/register/update-register";
import { noExists, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class UpdateRegisterController implements Controller {
  constructor(private readonly update: UpdateRegister) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const updateData = await this.update.update(
        httpRequest.params.id,
        httpRequest.body
      );

      return ok(updateData);
    } catch (error) {
      return serverError(error);
    }
  }
}
