import { OrderItemsRepository } from '@/domain/shop/application/repositories/order-items-repository'
import { OrderItem } from '@/domain/shop/enterprise/entities/order-item'

export class InMemoryOrderItemsRepository implements OrderItemsRepository {
  public items: OrderItem[] = []

  async createMany(orderItems: OrderItem[]): Promise<void> {
    this.items.push(...orderItems)
  }

  async deleteMany(orderItems: OrderItem[]): Promise<void> {
    this.items = this.items.filter(
      (item) => !orderItems.some((orderItem) => orderItem.equals(item)),
    )
  }

  async findManyByOrderId(orderId: string): Promise<OrderItem[]> {
    return this.items.filter((item) => item.orderId.toString() === orderId)
  }

  async deleteManyByOrderId(orderId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.orderId.toString() !== orderId,
    )
  }
}
