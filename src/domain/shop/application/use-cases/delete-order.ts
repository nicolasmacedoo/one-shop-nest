import { OrdersRepository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/domain/shop/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shop/application/use-cases/errors/not-allowed-error'

interface DeleteOrderUseCaseRequest {
  orderId: string
  userId: string
}

type DeleteOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteOrderUseCase {
  constructor(private ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    userId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (userId !== order.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.ordersRepository.delete(order)

    return right(null)
  }
}
