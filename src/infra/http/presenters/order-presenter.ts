import { Order } from '@/domain/shop/enterprise/entities/order'

export class OrderPresenter {
  public static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      client: order.clientId.toString(),
      items: order.items.getItems(),
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}
