import { RegisterModel } from "../../models/register/register-model";

export interface UpdateRegister {
  update(
    id: number,
    info: Partial<RegisterModel>
  ): Promise<Promise<RegisterModel>>;
}
