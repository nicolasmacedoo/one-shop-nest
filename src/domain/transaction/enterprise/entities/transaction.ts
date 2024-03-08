import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

interface TransactionProps {
  userId: UniqueEntityID
  clientId: UniqueEntityID
  orderId: UniqueEntityID
  value: number
  description: string
  date: Date
  createdAt: Date
}

export class Transaction extends Entity<TransactionProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get clientId(): UniqueEntityID {
    return this.props.clientId
  }

  get orderId(): UniqueEntityID {
    return this.props.orderId
  }

  get value(): number {
    return this.props.value
  }

  get description(): string {
    return this.props.description
  }

  get date(): Date {
    return this.props.date
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  static create(
    props: Optional<TransactionProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const transaction = new Transaction(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return transaction
  }
}
