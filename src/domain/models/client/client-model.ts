export interface ClientModel {
  id: number;
  name: string;
  lastName: string;
  phone: string;
}

export type Client = Omit<ClientModel, "id">;
