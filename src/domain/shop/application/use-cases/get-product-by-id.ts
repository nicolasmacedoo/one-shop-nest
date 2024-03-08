import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'

interface GetProductByIdUseCaseRequest {
  id: string
}

type GetProductByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    product: Product
  }
>
export class GetProductByIdUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    id,
  }: GetProductByIdUseCaseRequest): Promise<GetProductByIdUseCaseResponse> {
    const product = await this.productsRepository.findById(id)

    if (!product) {
      return left(new ResourceNotFoundError())
    }

    return right({
      product,
    })
  }
}
