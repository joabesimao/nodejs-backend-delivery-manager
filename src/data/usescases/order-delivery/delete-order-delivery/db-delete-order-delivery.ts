import { DeleteOrderDelivery } from "../../../../domain/usescases/order-delivery/delete-order-delivery";
import { DeleteOrderDeliveryByIdRepository } from "../../../protocols/db/order-delivery/delete-order-delivery";

export class DbdeleteOrderDelivery implements DeleteOrderDelivery {
  constructor(
    private readonly deleteOrderDeliveryRepository: DeleteOrderDeliveryByIdRepository
  ) {}
  async delete(id: number): Promise<string> {
    const result = await this.deleteOrderDeliveryRepository.deleteById(id);
    return result;
  }
}
