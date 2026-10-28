import {
  OrderDeliveryModel,
  OrderStatus,
} from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { UpdateOrderDelivery } from "../../../../domain/usescases/order-delivery/update-order-delivery";
import {
  OrderFieldChangeDeniedError,
  OrderStatusTransitionError,
} from "../../../../presentation/errors";
import { LoadOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/load-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../protocols/db/order-delivery/update-order-delivery";

const STATUS_ONLY_ROLES = ["entregador"];

const STATUS_SEQUENCE: OrderStatus[] = ["actived", "delivered", "finished"];

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
    const current = await this.loadOrderDeliveryByIdRepository.getOneOrderOfDelivery(
      id,
      info.accountId
    );

    if (current) {
      this.ensureStatusTransitionAllowed(current, info);

      if (info.accountRole && STATUS_ONLY_ROLES.includes(info.accountRole)) {
        this.ensureRestrictedFieldsUnchanged(current, info);
      }
    }

    const orderDeliveryUpdate = await this.orderDeliveryRepository.updateOrder(
      id,
      info
    );
    return orderDeliveryUpdate;
  }

  private ensureStatusTransitionAllowed(
    current: OrderDeliveryModel,
    info: UpdateOrderDeliveryModel
  ): void {
    if (current.status === "finished") {
      throw new OrderStatusTransitionError(current.status);
    }

    if (
      info.status &&
      STATUS_SEQUENCE.indexOf(info.status) < STATUS_SEQUENCE.indexOf(current.status)
    ) {
      throw new OrderStatusTransitionError(current.status, info.status);
    }
  }

  private ensureRestrictedFieldsUnchanged(
    current: OrderDeliveryModel,
    info: UpdateOrderDeliveryModel
  ): void {
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
