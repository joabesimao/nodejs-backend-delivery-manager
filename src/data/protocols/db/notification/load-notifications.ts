import { LoadNotificationsParams, LoadNotificationsResult } from "../../../../domain/usescases/notification/load-notifications";

export interface LoadNotificationsRepository {
  load(params: LoadNotificationsParams): Promise<LoadNotificationsResult>;
}
