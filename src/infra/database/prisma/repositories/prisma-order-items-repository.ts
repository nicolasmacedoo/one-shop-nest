import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createMany(orderItems: OrderItem[]): Promise<void> {
    if (orderItems.length === 0) {
      return
    }

    const data = orderItems.map((orderItem) => ({
      orderId: orderItem.orderId.toString(),
      productId: orderItem.productId.toString(),
      quantity: orderItem.quantity,
    }))

    await this.prisma.orderItem.createMany({
      data,
    })
  }

  deleteMany(orderItems: OrderItem[]): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    throw new Error('Method not implemented.')
  }

  deleteManyByOrderId(orderId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
