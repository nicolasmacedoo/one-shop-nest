import { CreateProductUseCase } from './create-product'
import { InMemoryProductsRepository } from 'test/repositories/in-memory-products-repository'

let inMemoryProductsRepository: InMemoryProductsRepository
let sut: CreateProductUseCase

describe('Create Product', () => {
  beforeEach(() => {
    inMemoryProductsRepository = new InMemoryProductsRepository()
    sut = new CreateProductUseCase(inMemoryProductsRepository)
  })

  it('should be able to create a product', async () => {
    const result = await sut.execute({
      userId: '1',
      name: 'Product 1',
      quantity: 10,
      price: 100,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductsRepository.items[0]).toEqual(result.value?.product)
  })
})
