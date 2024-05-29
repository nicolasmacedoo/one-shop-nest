import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/shop/enterprise/entities/order'
import { OrderItemsList } from '@/domain/shop/enterprise/entities/order-items-list'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
): Order {
  return Order.create(
    {
      userId: new UniqueEntityID(),
      clientId: new UniqueEntityID(),
      items: new OrderItemsList(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class OrderFactory {
  constructor(private readonly prisa: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}): Promise<Order> {
    const order = makeOrder(data)

    await this.prisa.order.create({
      data: PrismaOrderMapper.toPersistence(order),
    })

    return order
  }
}
