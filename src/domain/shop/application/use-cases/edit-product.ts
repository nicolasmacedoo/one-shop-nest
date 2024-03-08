import { ProductsRepository } from '../repositories/products-repository'
import { Product } from '@/domain/shop/enterprise/entities/product'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'

interface EditProductUseCaseRequest {
  productId: string
  userId: string
  name: string
  stock: number
}

type EditProductUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    product: Product
  }
>

export class EditProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({
    productId,
    userId,
    name,
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
    product.stock = stock

    await this.productsRepository.save(product)

    return right({
      product,
    })
  }
}
