import { OrderWithClient } from '@/domain/shop/enterprise/entities/value-objects/order-with-client'
import { OrderItemPresenter } from './order-item-presenter'

export class OrderWithClientPresenter {
  public static toHTTP(orderWithClient: OrderWithClient) {
    return {
      id: orderWithClient.orderId.toString(),
      clientId: orderWithClient.clientId.toString(),
      clientName: orderWithClient.clientName,
      items: orderWithClient.items.map(OrderItemPresenter.toHTTP),
      total: orderWithClient.orderTotal,
      createdAt: orderWithClient.createdAt,
      updatedAt: orderWithClient.updatedAt,
    }
  }
}
