import { ProductsRepository } from '../repositories/products-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteProductUseCaseRequest {
  productId: string
  userId: string
}

type DeleteProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    userId,
  }: DeleteProductUseCaseRequest): Promise<DeleteProductUseCaseResponse> {
    const product = await this.productsRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== product.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.productsRepository.delete(product)

    return right(null)
  }
}
