import { GlobalSearchResult } from "../../../domain/models/search/global-search";
import { GlobalSearch } from "../../../domain/usescases/search/global-search";
import { GlobalSearchRepository } from "../../protocols/db/search/global-search-repository";
import { formatDeliverymanName } from "../dashboard-usecases/dashboard-helpers";

const MIN_TERM_LENGTH = 2;
const RESULT_LIMIT = 5;

export class DbGlobalSearch implements GlobalSearch {
  constructor(private readonly globalSearchRepository: GlobalSearchRepository) {}

  async search(term: string): Promise<GlobalSearchResult> {
    if (term.length < MIN_TERM_LENGTH) {
      return { query: term, orders: [], clients: [], deliverymen: [] };
    }

    const orderId = /^\d+$/.test(term) ? Number(term) : undefined;
    const [orders, clients, deliverymen] = await Promise.all([
      this.globalSearchRepository.searchOrders(term, orderId, RESULT_LIMIT),
      this.globalSearchRepository.searchClients(term, RESULT_LIMIT),
      this.globalSearchRepository.searchDeliverymen(term, RESULT_LIMIT),
    ]);

    return {
      query: term,
      orders: orders.map((order) => ({
        id: order.id,
        status: order.status,
        amount: order.amount,
        clientName: order.clientName ?? "",
        deliverymanName: order.deliveryman ? formatDeliverymanName(order.deliveryman) : null,
      })),
      clients,
      deliverymen,
    };
  }
}
