import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderByIdUseCase } from '@/domain/shop/application/use-cases/get-order-by-id'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get a order by id', async () => {
    const newOrder = makeOrder()

    await inMemoryOrdersRepository.create(newOrder)

    const result = await sut.execute({
      id: newOrder.id.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toMatchObject({
      order: expect.objectContaining({
        id: newOrder.id,
      }),
    })
  })

  it('should not be able to get a order by id if it does not exist', async () => {
    const result = await sut.execute({
      id: 'invalid-id',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
