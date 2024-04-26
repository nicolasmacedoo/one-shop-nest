import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Optional } from '@/core/types/optional'
import { OrderItemsList } from './order-items-list'
import { OrderCreatedEvent } from '../events/order-created-event'

export interface OrderProps {
  userId: UniqueEntityID
  clientId: UniqueEntityID
  items: OrderItemsList
  total: number
  createdAt: Date
  updatedAt?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get clientId(): UniqueEntityID {
    return this.props.clientId
  }

  set clientId(clientId: UniqueEntityID) {
    this.props.clientId = clientId
    this.touch()
  }

  get items(): OrderItemsList {
    return this.props.items
  }

  set items(items: OrderItemsList) {
    this.props.items = items
    this.touch()
  }

  get total(): number {
    return this.props.total
  }

  set total(total: number) {
    this.props.total = total
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined | null {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'createdAt' | 'total'>,
    id?: UniqueEntityID,
  ) {
    const order = new Order(
      {
        ...props,
        total: props.items.currentItems.reduce((acc, item) => {
          return acc + item.quantity * item.price
        }, 0),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderCreatedEvent(order))
    }

    return order
  }
}
