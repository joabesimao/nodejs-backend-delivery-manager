import { AddRegisterModel } from "../../../../domain/usescases/addRegister/add-register";

export interface AddRegisterRepository {
  add(registerData: AddRegisterModel): Promise<void>;
}
