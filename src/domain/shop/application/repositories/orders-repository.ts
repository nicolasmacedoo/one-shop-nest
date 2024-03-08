import { Order } from '@/domain/shop/enterprise/entities/order'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface OrdersRepository {
  findById(id: string): Promise<Order | null>
  findManyRecent(userId: string, params: PaginationParams): Promise<Order[]>
  save(order: Order): Promise<void>
  create(order: Order): Promise<void>
  delete(order: Order): Promise<void>
}
