import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface OrderWithClientProps {
  orderId: UniqueEntityID
  clientId: UniqueEntityID
  clientName: string
  orderTotal: number
  items: {
    productId: UniqueEntityID
    quantity: number
  }[]
  createdAt: Date
  updatedAt?: Date | null
}

export class OrderWithClient extends ValueObject<OrderWithClientProps> {
  get orderId(): UniqueEntityID {
    return this.props.orderId
  }

  get clientId(): UniqueEntityID {
    return this.props.clientId
  }

  get clientName(): string {
    return this.props.clientName
  }

  get items(): {
    productId: UniqueEntityID
    quantity: number
  }[] {
    return this.props.items
  }

  get orderTotal(): number {
    return this.props.orderTotal
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  static create(props: OrderWithClientProps): OrderWithClient {
    return new OrderWithClient(props)
  }
}
