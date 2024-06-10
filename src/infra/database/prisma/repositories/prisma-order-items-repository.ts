import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderItemMapper } from '../mappers/prisma-order-item-mapper'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    const data = orderItems.map((orderItem) => ({
      orderId: orderItem.orderId.toString(),
      productId: orderItem.productId.toString(),
      quantity: orderItem.quantity,
      price: orderItem.price,
    }))

    await this.prisma.orderItem.createMany({
      data,
    })
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    const itemsIds = orderItems.map((item) => {
      return item.id.toString()
    })

    await this.prisma.orderItem.deleteMany({
      where: {
        id: {
          in: itemsIds,
        },
      },
    })

    // await Promise.all(
    //   orderItems.map(async (item) => {
    //     await this.prisma.orderItem.delete({
    //       where: {
    //         id: item.id.toString(),
    //       },
    //     })
    //   }),
    // )
  }

  async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    const orderItems = await this.prisma.orderItem.findMany({
      where: {
        orderId,
      },
    })

    return orderItems.map(PrismaOrderItemMapper.toDomain)
  }

  deleteManyByOrderId(orderId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
