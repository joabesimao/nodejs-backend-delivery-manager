import { LoadAllProduct } from "../../../../domain/usecases/product/load-product/load-product";
import { InvalidParamError } from "../../../errors";
import { badRequest, ok, serverError } from "../../../helpers/http/http-helper";
import { Controller } from "../../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../../protocols/http";

export class LoadProductController implements Controller {
  constructor(private readonly loadProduct: LoadAllProduct) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const query = httpRequest.query || {};
      const name = query.name ? String(query.name).trim() : undefined;
      const category = query.category ? String(query.category).trim() : undefined;

      const priceMin = query.priceMin !== undefined ? Number(query.priceMin) : undefined;
      const priceMax = query.priceMax !== undefined ? Number(query.priceMax) : undefined;
      if (priceMin !== undefined && (isNaN(priceMin) || priceMin < 0)) {
        return badRequest(new InvalidParamError("priceMin"));
      }
      if (priceMax !== undefined && (isNaN(priceMax) || priceMax < 0)) {
        return badRequest(new InvalidParamError("priceMax"));
      }
      if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
        return badRequest(new InvalidParamError("priceMin"));
      }

      const limit = query.limit !== undefined ? Math.min(Number(query.limit), 100) : 50;
      const offset = query.offset !== undefined ? Number(query.offset) : 0;
      if (isNaN(limit) || limit <= 0) {
        return badRequest(new InvalidParamError("limit"));
      }
      if (isNaN(offset) || offset < 0) {
        return badRequest(new InvalidParamError("offset"));
      }

      const { items, total } = await this.loadProduct.load({
        name,
        category,
        priceMin,
        priceMax,
        limit,
        offset,
      });

      return ok({
        items,
        pagination: { total, limit, offset, hasMore: offset + limit < total },
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
