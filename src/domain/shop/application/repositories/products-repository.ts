import { Product } from '@/domain/shop/enterprise/entities/product'
import { PaginationParams } from '@/core/repositories/pagination-params'

export abstract class ProductsRepository {
  abstract findById(id: string): Promise<Product | null>
  abstract findMany(
    userId: string,
    params: PaginationParams,
  ): Promise<{ products: Product[]; totalCount: number }>

  abstract save(product: Product): Promise<void>
  abstract create(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
}
