import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usescases/addRegister/add-register";

export interface AddRegisterRepository {
  add(data: AddRegisterModel): Promise<RegisterModel>;
}
