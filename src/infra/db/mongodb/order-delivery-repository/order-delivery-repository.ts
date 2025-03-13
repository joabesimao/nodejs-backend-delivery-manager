import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/order-delivery";
import { MongoHelper } from "../helpers/mongo-helper";

export class OrderDeliveryMongoRepository
  implements AddOrderDeliveryRepository
{
  async addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const orderDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );
    const result = await orderDeliveryCollection.insertOne(orderOfDelivery);
    const obj = await orderDeliveryCollection.findOne(result.insertedId);
    const { _id, register, quantity, amount, data } = obj;

    const orderDeliveryCreated: OrderDeliveryModel = {
      id: _id as any,
      register: register,
      quantity: quantity,
      amount: amount,
      data: data,
    };
    return orderDeliveryCreated;
  }
}
