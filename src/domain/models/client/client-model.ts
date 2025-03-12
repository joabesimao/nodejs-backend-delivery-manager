export interface ClientModel {
  name: string;
  lastName: string;
  phone: string;
}

export type Client = Omit<ClientModel, "id">;
