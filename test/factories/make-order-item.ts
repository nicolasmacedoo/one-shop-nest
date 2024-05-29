import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  OrderItem,
  OrderItemProps,
} from '@/domain/shop/enterprise/entities/order-item'
import { PrismaOrderItemMapper } from '@/infra/database/prisma/mappers/prisma-order-item-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeOrderItem(
  override: Partial<OrderItemProps> = {},
  id?: UniqueEntityID,
): OrderItem {
  return OrderItem.create(
    {
      productId: new UniqueEntityID(),
      orderId: new UniqueEntityID(),
      quantity: faker.number.int({ min: 1, max: 100 }),
      price: parseFloat(
        faker.commerce.price({
          min: 1,
          max: 100,
          dec: 2,
        }),
      ),
      ...override,
    },
    id,
  )
}

@Injectable()
export class OrderItemFactory {
  constructor(private readonly prisa: PrismaService) {}

  async makePrismaOrderItem(
    data: Partial<OrderItemProps> = {},
  ): Promise<OrderItemProps> {
    const orderItem = makeOrderItem(data)

    await this.prisa.orderItem.create({
      data: PrismaOrderItemMapper.toPersistence(orderItem),
    })

    return orderItem
  }
}
