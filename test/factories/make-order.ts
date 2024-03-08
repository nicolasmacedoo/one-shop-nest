import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/shop/enterprise/entities/order'
import { OrderItemsList } from '@/domain/shop/enterprise/entities/order-items-list'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
): Order {
  return Order.create(
    {
      userId: new UniqueEntityID(),
      clientId: new UniqueEntityID(),
      items: new OrderItemsList(),
      ...override,
    },
    id,
  )
}
