import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { OrderWithClient } from '@/domain/shop/enterprise/entities/value-objects/order-with-client'
import {
  Order as PrismaOrder,
  Client as PrismaClient,
  OrderItem as PrismaOrderItem,
} from '@prisma/client'

type PrismaOrderWithClient = PrismaOrder & {
  client: PrismaClient
  orderItem: PrismaOrderItem[]
}

export class PrismaOrderWithClientMapper {
  static toDomain(raw: PrismaOrderWithClient): OrderWithClient {
    return OrderWithClient.create({
      orderId: new UniqueEntityID(raw.id),
      clientId: new UniqueEntityID(raw.client.id),
      clientName: raw.client.name,
      orderTotal: Number(raw.total),
      // items: raw.orderItem.map((item) => ({
      //   productId: new UniqueEntityID(item.productId),
      //   quantity: item.quantity,
      // })),
      items: raw.orderItem.map((item) =>
        OrderItem.create({
          orderId: new UniqueEntityID(raw.id),
          price: Number(item.price),
          productId: new UniqueEntityID(item.productId),
          quantity: item.quantity,
        }),
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
