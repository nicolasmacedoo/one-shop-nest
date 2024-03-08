import { ProductsRepository } from '@/domain/shop/application/repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Either, right } from '@/core/either'

interface FetchProductsUseCaseRequest {
  userId: string
  page: number
}

type FetchProductsUseCaseResponse = Either<
  null,
  {
    products: Product[]
  }
>
export class FetchProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    userId,
    page,
  }: FetchProductsUseCaseRequest): Promise<FetchProductsUseCaseResponse> {
    const products = await this.productsRepository.findMany(userId, {
      page,
    })

    return right({
      products,
    })
  }
}
