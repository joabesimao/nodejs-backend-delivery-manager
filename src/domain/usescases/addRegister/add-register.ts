export interface AddRegisterModel {
  name: string;
  address: string;
  phone: string;
  quantity: string;
}

export interface AddRegister {
  add(data: AddRegisterModel): Promise<void>;
}
