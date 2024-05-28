import { OrderWithClient } from '@/domain/shop/enterprise/entities/value-objects/order-with-client'

export class OrderWithClientPresenter {
  public static toHTTP(orderWithClient: OrderWithClient) {
    return {
      id: orderWithClient.orderId.toString(),
      client: orderWithClient.clientName,
      items: orderWithClient.items,
      total: orderWithClient.orderTotal,
      createdAt: orderWithClient.createdAt,
      updatedAt: orderWithClient.updatedAt,
    }
  }
}
