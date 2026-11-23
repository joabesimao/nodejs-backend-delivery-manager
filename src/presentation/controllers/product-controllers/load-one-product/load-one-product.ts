import { LoadProductById } from "../../../../domain/usecases/product/load-product/load-product";
import { ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadOneProductController implements Controller {
  constructor(private readonly loadProduct: LoadProductById) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const result = await this.loadProduct.loadOne(Number(id));
      return ok(result);
    } catch (error) {
      return serverError(error);
    }
  }
}
