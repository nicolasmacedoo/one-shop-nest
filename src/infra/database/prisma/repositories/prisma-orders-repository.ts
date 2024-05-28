import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrderWithClient } from '@/domain/shop/enterprise/entities/value-objects/order-with-client'
import { PrismaOrderWithClientMapper } from '../mappers/prisma-order-with-client'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderItemsRepository: OrderItemsRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        orderItem: true,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyRecent(
    userId: string,
    { page, query }: PaginationParams,
  ): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItem: true,
      },
      skip: (page - 1) * 10,
      take: 10,
    })

    console.log('orders prisma', orders[0].orderItem)

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyRecentWithClient(
    userId: string,
    { page, query }: PaginationParams,
  ): Promise<OrderWithClient[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItem: true,
        client: true,
      },
      skip: (page - 1) * 10,
      take: 10,
    })

    return orders.map(PrismaOrderWithClientMapper.toDomain)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPersistence(order)

    await this.prisma.order.create({
      data,
    })

    // await this.prisma.order.create({
    //   data: {
    //     ...data,
    //     orderItem: {
    //       create: order.items.getItems().map((item) => ({
    //         productId: item.productId.toString(),
    //         quantity: item.quantity,
    //       })),
    //     },
    //   },
    // })

    // await this.orderItemsRepository.createMany(order.items.getItems())
  }

  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
