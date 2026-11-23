import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddRegisterModel } from "../../../../domain/usecases/register/add-register";

export interface AddRegisterRepository {
  add(dataInfo: AddRegisterModel): Promise<RegisterModel>;
}
