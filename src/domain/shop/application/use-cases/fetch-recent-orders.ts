import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Either, right } from '@/core/either'
import { Order } from '../../enterprise/entities/order'

interface FetchRecentOrdersUseCaseRequest {
  userId: string
  page: number
}

type FetchRecentOrdersUseCaseResponse = Either<
  null,
  {
    orders: Order[]
  }
>
export class FetchOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
  }: FetchRecentOrdersUseCaseRequest): Promise<FetchRecentOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyRecent(userId, {
      page,
    })

    return right({
      orders,
    })
  }
}
