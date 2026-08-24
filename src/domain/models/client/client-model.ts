export interface ClientModel {
  name: string;
  lastName: string;
  cpf:string;
  phone: string;
  status?: boolean;
}

export type Client = ClientModel;
