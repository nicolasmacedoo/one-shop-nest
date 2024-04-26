import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'

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

  findManyRecent(userId: string, params: PaginationParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
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
