import { PaginationParams } from '@/core/repositories/pagination-params'
import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  findById(id: string): Promise<Order | null> {
    throw new Error('Method not implemented.')
  }

  findManyRecent(userId: string, params: PaginationParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  create(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
