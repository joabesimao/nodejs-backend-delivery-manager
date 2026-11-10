import { AccountRole } from "../../domain/models/account/account-role";

export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface Actor {
  id: number;
  role: AccountRole;
  unitStoreId: number | null;
}

export interface HttpRequest {
  body?: any;
  headers?: any;
  params?: any;
  query?: any;
  accountId?: number;
  actor?: Actor;
}
