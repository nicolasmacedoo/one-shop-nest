import { makeOrder } from 'test/factories/make-order'
import { OnOrderCreated } from './on-order-created'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryOrderItemsRepository } from 'test/repositories/in-memory-order-items-repository'
import { CreateTransactionUseCase } from '../use-case/create-transaction'
import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryOrderItemsRepository: InMemoryOrderItemsRepository
let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let createTransactionUseCase: CreateTransactionUseCase

let createTransactionExecuteSpy: MockInstance

describe('On Order Created', () => {
  beforeEach(() => {
    inMemoryOrderItemsRepository = new InMemoryOrderItemsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryOrderItemsRepository,
    )
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    createTransactionUseCase = new CreateTransactionUseCase(
      inMemoryTransactionsRepository,
    )

    createTransactionExecuteSpy = vi.spyOn(createTransactionUseCase, 'execute')

    new OnOrderCreated(createTransactionUseCase)
  })
  it('should created a transaction when an order is created', async () => {
    const order = makeOrder()

    inMemoryOrdersRepository.create(order)

    await waitFor(() => {
      expect(createTransactionExecuteSpy).toHaveBeenCalled()
    })
  })
})
