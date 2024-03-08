import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ProductProps {
  userId: UniqueEntityID
  name: string
  stock: number
  price: number
  createdAt: Date
  updatedAt?: Date | null
}
export class Product extends Entity<ProductProps> {
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

  get stock(): number {
    return this.props.stock
  }

  set stock(value: number) {
    this.props.stock = value
    this.touch()
  }

  get price(): number {
    return this.props.price
  }

  set price(price: number) {
    this.props.price = price
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
    props: Optional<ProductProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
