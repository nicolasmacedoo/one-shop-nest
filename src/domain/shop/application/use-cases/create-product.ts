import { ProductsRepository } from '../repositories/products-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Either, right } from '@/core/either'

interface CreateProductUseCaseRequest {
  userId: string
  name: string
  stock: number
  price: number
}

type CreateProductUseCaseResponse = Either<
  null,
  {
    product: Product
  }
>

export class CreateProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    name,
    stock,
    price,
    userId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const product = Product.create({
      userId: new UniqueEntityID(userId),
      name,
      stock,
      price,
    })

    await this.productsRepository.create(product)

    return right({
      product,
    })
  }
}
