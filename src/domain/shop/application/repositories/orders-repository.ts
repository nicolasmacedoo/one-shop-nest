import { Order } from '@/domain/shop/enterprise/entities/order'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class OrdersRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyRecent(
    userId: string,
    params: PaginationParams,
  ): Promise<Order[]>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
