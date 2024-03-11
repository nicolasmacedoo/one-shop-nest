import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchProductsController } from './controllers/fetch-products.controller'
import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/shop/application/use-cases/create-product'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    FetchProductsController,
  ],
  providers: [CreateProductUseCase],
})
export class HttpModule {}
