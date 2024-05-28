import { OrdersRepository } from '@/domain/shop/application/repositories/orders-repository'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { OrderWithClient } from '../../enterprise/entities/value-objects/order-with-client'

interface FetchRecentOrdersUseCaseRequest {
  userId: string
  page: number
  query?: string
}

type FetchRecentOrdersUseCaseResponse = Either<
  null,
  {
    orders: OrderWithClient[]
  }
>

@Injectable()
export class FetchOrdersUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    userId,
    page,
    query,
  }: FetchRecentOrdersUseCaseRequest): Promise<FetchRecentOrdersUseCaseResponse> {
    const orders = await this.ordersRepository.findManyRecentWithClient(
      userId,
      {
        page,
        query,
      },
    )

    return right({
      orders,
    })
  }
}
