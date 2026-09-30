import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import { OrderFieldChangeDeniedError } from "../../../../presentation/errors";
import { LoadOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/load-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../protocols/db/order-delivery/update-order-delivery";

// Roles que só podem mudar o status: valor e entregador ficam travados.
const STATUS_ONLY_ROLES = ["entregador"];

const isProvided = (value: unknown): boolean =>
  value !== undefined && value !== null && value !== "";

export class DbUpdateOrderDelivery implements UpdateOrderDelivery {
  constructor(
    private readonly orderDeliveryRepository: UpdateOrderDeliveryRepository,
    private readonly loadOrderDeliveryByIdRepository: LoadOrderDeliveryByIdRepository
  ) {}

  async update(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    if (info.accountRole && STATUS_ONLY_ROLES.includes(info.accountRole)) {
      await this.ensureRestrictedFieldsUnchanged(id, info);
    }

    const orderDeliveryUpdate = await this.orderDeliveryRepository.updateOrder(
      id,
      info
    );
    return orderDeliveryUpdate;
  }

  // O frontend reenvia valor e entregador ao finalizar; mandar os mesmos
  // valores é permitido, alterá-los não.
  private async ensureRestrictedFieldsUnchanged(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<void> {
    const current = await this.loadOrderDeliveryByIdRepository.getOneOrderOfDelivery(
      id,
      info.accountId
    );
    if (!current) {
      return;
    }

    const amountChanged =
      isProvided(info.amount) && Number(info.amount) !== Number(current.amount);
    const deliverymanChanged =
      isProvided(info.deliverymanId) &&
      Number(info.deliverymanId) !== (current.deliveryman?.id ?? null);

    if (amountChanged || deliverymanChanged) {
      throw new OrderFieldChangeDeniedError();
    }
  }
}
