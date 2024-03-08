import { Product } from '@/domain/shop/enterprise/entities/product'
import { PaginationParams } from '@/core/repositories/pagination-params'

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>
  findMany(userId: string, params: PaginationParams): Promise<Product[]>
  save(product: Product): Promise<void>
  create(product: Product): Promise<void>
  delete(product: Product): Promise<void>
}
