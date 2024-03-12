import { ProductsRepository } from '../repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface EditProductUseCaseRequest {
  productId: string
  userId: string
  name: string
  price: number
  stock: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

@Injectable()
export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    userId,
    name,
    price,
    stock,
  }: EditProductUseCaseRequest): Promise<EditProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== product.userId.toString()) {
      return left(new NotAllowedError())
    }

    product.name = name
    product.price = price
    product.stock = stock

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
