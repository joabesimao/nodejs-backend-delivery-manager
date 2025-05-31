import { ObjectId } from "mongodb";
import { AddOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/add-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../../data/protocols/db/order-delivery/delete-order-delivery";
import {
  LoadOrderDeliveryByIdRepository,
  LoadOrderDeliveryRepository,
} from "../../../../data/protocols/db/order-delivery/load-order-delivery";
import { UpdateOrderDeliveryRepository } from "../../../../data/protocols/db/order-delivery/update-order-delivery";
import { OrderDeliveryModel } from "../../../../domain/models/order-delivery/order-delivery";
import { UpdateOrderDeliveryModel } from "../../../../domain/models/order-delivery/update-order-delivery";
import { AddOrderDeliveryModel } from "../../../../domain/usescases/order-delivery/add-order-delivery";
import { MongoHelper } from "../helpers/mongo-helper";

export class OrderDeliveryMongoRepository
  implements
    AddOrderDeliveryRepository,
    LoadOrderDeliveryRepository,
    LoadOrderDeliveryByIdRepository,
    UpdateOrderDeliveryRepository,
    DeleteOrderDeliveryByIdRepository
{
  async updateOrder(
    id: number,
    info: UpdateOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const objId = new ObjectId(id);
    const orderDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );
    await orderDeliveryCollection.updateOne(
      { _id: objId },
      { $set: { ...info } }
    );
    const result = await orderDeliveryCollection.findOne({ _id: objId });
    return result as unknown as OrderDeliveryModel;
  }

  async getAllOrderOfDelivery(): Promise<OrderDeliveryModel[]> {
    const listOfOrdersOfDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );
    const allListOfOrdersOfDelivery = await listOfOrdersOfDeliveryCollection
      .find()
      .toArray();
    return allListOfOrdersOfDelivery as unknown as OrderDeliveryModel[];
  }

  async getOneOrderOfDelivery(id: number): Promise<OrderDeliveryModel> {
    const objId = new ObjectId(id);
    const orderDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );
    const order = await orderDeliveryCollection.findOne({
      _id: objId,
    });
    return order as unknown as OrderDeliveryModel;
  }

  async addOrderOfDelivery(
    orderOfDelivery: AddOrderDeliveryModel
  ): Promise<OrderDeliveryModel> {
    const orderDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );

    const registerCollection = await MongoHelper.getCollection("registers");
    const reg = await registerCollection.findOne({});
    const result = await orderDeliveryCollection.insertOne({
      register: reg,
      info: orderOfDelivery,
    });

    const orderDeliveryCreated: OrderDeliveryModel = {
      register: reg as any,
      quantity: orderOfDelivery.quantity,
      amount: orderOfDelivery.amount,
      data: orderOfDelivery.data,
    };
    return orderDeliveryCreated;
  }

  async deleteById(id: number): Promise<string> {
    const objectId = new ObjectId(id);
    const orderDeliveryCollection = await MongoHelper.getCollection(
      "orderDeliverys"
    );
    const deleteOrder = await orderDeliveryCollection.deleteOne({
      _id: objectId,
    });
    const result = deleteOrder.acknowledged;
    if (result) {
      return "Pedido de Entrega Deletado com sucesso!";
    }
  }
}
