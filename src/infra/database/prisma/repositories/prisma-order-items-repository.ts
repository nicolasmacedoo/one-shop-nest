import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderItemsRepository implements OrderItemsRepository {
  findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    throw new Error('Method not implemented.')
  }

  deleteManyByOrderId(orderId: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
