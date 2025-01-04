import { AddRegister } from "../../../domain/usescases/addRegister/add-register";
import { Controller } from "../../protocols/controller";
import { HttpRequest, HttpResponse } from "../../protocols/http";

export class AddRegisterController implements Controller {
  constructor(private readonly addRegister: AddRegister) {}
  handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    this.addRegister.add(httpRequest.body);
    return null;
  }
}
