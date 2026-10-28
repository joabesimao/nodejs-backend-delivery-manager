import { UpdateDeliveryman } from "../../../../domain/usescases/deliveryman/update-deliveryman";
import { CpfInUseError, QualificationInUseError } from "../../../errors";
import { badRequest, conflict, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";
import { Validation } from "../../../protocols/validation";

export class UpdateDeliverymanController implements Controller {
  constructor(
    private readonly updateDeliveryman: UpdateDeliveryman,
    private readonly validation: Validation
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const error = await this.validation.validate(httpRequest.body);
      if (error) {
        return badRequest(error);
      }
      const result = await this.updateDeliveryman.update(Number(id), httpRequest.body);
      return ok(result);
    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("cpf")) {
        return conflict(new CpfInUseError());
      }
      if (error.code === "P2002" && error.meta?.target?.includes("numberQualification")) {
        return conflict(new QualificationInUseError());
      }
      return serverError(error);
    }
  }
}
