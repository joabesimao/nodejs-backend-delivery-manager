import { LoadNotificationsParams, LoadNotificationsResult } from "../../../../domain/usecases/notification/load-notifications";

export interface LoadNotificationsRepository {
  load(params: LoadNotificationsParams): Promise<LoadNotificationsResult>;
}
