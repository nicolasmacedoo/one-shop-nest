import { OrderItem as PrismaOrderItem, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'

export class PrismaOrderItemMapper {
  public static toDomain(raw: PrismaOrderItem): OrderItem {
    return OrderItem.create({
      orderId: new UniqueEntityID(raw.orderId),
      productId: new UniqueEntityID(raw.productId),
      price: 12.33,
      quantity: raw.quantity,
    })
  }

  public static toPersistence(
    orderItem: OrderItem,
  ): Prisma.OrderItemUncheckedCreateInput {
    return {
      orderId: orderItem.orderId.toString(),
      productId: orderItem.productId.toString(),
      quantity: orderItem.quantity,
    }
  }
}
