import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Order } from '@/domain/shop/enterprise/entities/order'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'

interface GetOrderByIdUseCaseRequest {
  id: string
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>
export class GetOrderByIdUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    id,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(id)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}
