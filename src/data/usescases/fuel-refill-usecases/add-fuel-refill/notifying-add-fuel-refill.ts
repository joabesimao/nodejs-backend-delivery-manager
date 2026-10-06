import { AccountRole } from "@prisma/client";
import { ActorContext } from "../../../../domain/models/actor-context";
import { FuelRefill } from "../../../../domain/models/fuel-refill/fuel-refill-model";
import { AddFuelRefill, AddFuelRefillModel } from "../../../../domain/usescases/fuel-refill/add-fuel-refill";
import { NotifyAccounts } from "../../../../domain/usescases/notification/notify-accounts";
import { LoadOilChangeLogRepository } from "../../../protocols/db/oil-change/load-oil-change-log";
import { LoadNotificationRecipientsRepository } from "../../../protocols/db/notification/load-notification-recipients";
import { describeVehicle, formatKm } from "../../../helpers/vehicle-label";

export const OIL_CHANGE_WARNING_KM = 500;

export class NotifyingAddFuelRefill implements AddFuelRefill {
  constructor(
    private readonly addFuelRefill: AddFuelRefill,
    private readonly loadOilChangeLogRepository: LoadOilChangeLogRepository,
    private readonly loadNotificationRecipientsRepository: LoadNotificationRecipientsRepository,
    private readonly notifyAccounts: NotifyAccounts,
    private readonly managerRoles: AccountRole[]
  ) {}

  async add(refill: AddFuelRefillModel, context?: ActorContext): Promise<FuelRefill> {
    const created = await this.addFuelRefill.add(refill, context);
    try {
      await this.notifyManagers(created, context?.actorAccountId);
    } catch (error) {
      console.error("[notification] falha ao notificar abastecimento", { fuelRefillId: created.id, error });
    }
    return created;
  }

  private async notifyManagers(refill: FuelRefill, actorAccountId?: number): Promise<void> {
    const managerIds = await this.loadNotificationRecipientsRepository.loadRecipientIds({
      roles: this.managerRoles,
    });
    if (managerIds.length === 0) {
      return;
    }
    const vehicleLabel = describeVehicle(refill.vehicle, refill.vehicleId);

    await this.notifyAccounts.notify({
      recipientIds: managerIds.filter((id) => id !== actorAccountId),
      type: "fuel_refill_created",
      title: "Abastecimento registrado",
      body: `${vehicleLabel}: ${refill.liters.toLocaleString("pt-BR")} L em ${formatKm(refill.km)}.`,
      link: "/cadastros/abastecimento",
      data: { vehicleId: refill.vehicleId, fuelRefillId: refill.id },
    });

    await this.notifyOilChangeDue(refill, vehicleLabel, managerIds);
  }

  private async notifyOilChangeDue(refill: FuelRefill, vehicleLabel: string, managerIds: number[]): Promise<void> {
    const [lastChange] = await this.loadOilChangeLogRepository.loadAll({ vehicleId: refill.vehicleId });
    if (!lastChange || refill.km < lastChange.km) {
      return;
    }
    const remainingKm = lastChange.nextChangeKm - refill.km;
    if (remainingKm > OIL_CHANGE_WARNING_KM) {
      return;
    }
    const overdue = remainingKm <= 0;
    const expected = `prevista em ${formatKm(lastChange.nextChangeKm)}`;

    await this.notifyAccounts.notify({
      recipientIds: managerIds,
      type: "oil_change_due",
      title: overdue ? "Troca de óleo vencida" : "Troca de óleo próxima",
      body: overdue
        ? `${vehicleLabel}: troca vencida há ${formatKm(-remainingKm)} (${expected}).`
        : `${vehicleLabel}: faltam ${formatKm(remainingKm)} para a troca (${expected}).`,
      link: "/cadastros/troca-oleo",
      data: { vehicleId: refill.vehicleId, nextChangeKm: lastChange.nextChangeKm, currentKm: refill.km },
      dedupeKey: `oil:vehicle:${refill.vehicleId}:${lastChange.nextChangeKm}:${overdue ? "overdue" : "soon"}`,
      dedupe: "skip",
    });
  }
}
