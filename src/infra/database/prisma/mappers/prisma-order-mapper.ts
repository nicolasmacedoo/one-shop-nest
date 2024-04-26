import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { OrderItemsList } from '@/domain/shop/enterprise/entities/order-items-list'
import { Order as PrismaOrder, Prisma } from '@prisma/client'

export class PrismaOrderMapper {
  public static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        clientId: new UniqueEntityID(raw.clientId),
        userId: new UniqueEntityID(raw.userId),
        items: new OrderItemsList(),
        total: raw.total.toNumber(),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  public static toPersistence(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      clientId: order.clientId.toString(),
      userId: order.userId.toString(),
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItem: {
        create: order.items.getItems().map((item) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
        })),
      },
    }
  }
}

// return {
//   id: order.id.toString(),
//   clientId: order.clientId.toString(),
//   userId: order.userId.toString(),
//   total: order.total,
//   createdAt: order.createdAt,
//   updatedAt: order.updatedAt,
// }
