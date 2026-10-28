export interface ClientModel {
  name: string;
  cpf: string;
  phone: string;
  status?: boolean;
}

export type Client = ClientModel;
