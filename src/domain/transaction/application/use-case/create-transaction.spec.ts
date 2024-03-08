import { InMemoryTransactionsRepository } from 'test/repositories/in-memory-transactions-repository'
import { CreateTransactionUseCase } from './create-transaction'

let inMemoryTransactionsRepository: InMemoryTransactionsRepository
let sut: CreateTransactionUseCase

describe('Create Transaction', () => {
  beforeEach(() => {
    inMemoryTransactionsRepository = new InMemoryTransactionsRepository()
    sut = new CreateTransactionUseCase(inMemoryTransactionsRepository)
  })

  it('should be able to create a transaction', async () => {
    const result = await sut.execute({
      userId: '1',
      clientId: '1',
      orderId: '1',
      value: 100,
      description: 'Test',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTransactionsRepository.items).toHaveLength(1)
    expect(inMemoryTransactionsRepository.items[0].value).toBe(100)
  })
})
