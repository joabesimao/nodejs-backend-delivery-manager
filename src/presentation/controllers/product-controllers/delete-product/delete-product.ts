import { DeleteProductById } from "../../../../domain/usecases/product/delete-product/delete-product";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class DeleteProductController implements Controller {
  constructor(private readonly deleteProduct: DeleteProductById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.deleteProduct.delete(Number(id));
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
