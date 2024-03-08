import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ClientProps {
  userId: UniqueEntityID
  name: string
  document: string
  email?: string
  phone?: string
  createdAt: Date
  updatedAt?: Date
}

export class Client extends Entity<ClientProps> {
  get userId(): UniqueEntityID {
    return this.props.userId
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get document(): string {
    return this.props.document
  }

  set document(document: string) {
    this.props.document = document
    this.touch()
  }

  get email(): string | undefined {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
    this.touch()
  }

  get phone(): string | undefined {
    return this.props.phone
  }

  set phone(phone: string) {
    this.props.phone = phone
    this.touch()
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ClientProps, 'createdAt' | 'phone' | 'email'>,
    id?: UniqueEntityID,
  ) {
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return client
  }
}
