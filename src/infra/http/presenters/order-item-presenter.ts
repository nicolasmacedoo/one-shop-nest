import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'

export class OrderItemPresenter {
  public static toHTTP(orderItem: OrderItem) {
    return {
      productId: orderItem.productId.toString(),
      quantity: orderItem.quantity,
    }
  }
}
