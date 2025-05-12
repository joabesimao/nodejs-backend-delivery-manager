import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import {
  AddOrderDelivery,
  AddOrderDeliveryModel,
} from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { AddOrderDeliveryRepository } from "../../../protocols/db/order-delivery/add-order-delivery";

export class DbAddOrderDelivery implements AddOrderDelivery {
  constructor(
    private readonly addOrderDeliveryRepository: AddOrderDeliveryRepository
  ) {}
  async addOrderDelivery(
    orderDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const newOrderDelivery =
      await this.addOrderDeliveryRepository.addOrderOfDelivery(orderDelivery);
    return newOrderDelivery;
  }
}
