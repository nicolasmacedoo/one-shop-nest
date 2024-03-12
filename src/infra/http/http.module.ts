import { Module } from '@nestjs/common'

import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchProductsController } from './controllers/fetch-products.controller'
import { GetProductByIdController } from './controllers/get-product-by-id.controller'

import { DatabaseModule } from '../database/database.module'
import { CreateProductUseCase } from '@/domain/shop/application/use-cases/create-product'
import { FetchProductsUseCase } from '@/domain/shop/application/use-cases/fetch-products'
import { AuthenticateUserUseCase } from '@/domain/shop/application/use-cases/authenticate-user'
import { RegisterUserUseCase } from '@/domain/shop/application/use-cases/register-user'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { GetProductByIdUseCase } from '@/domain/shop/application/use-cases/get-product-by-id'
import { EditProductController } from './controllers/edit-product.controller'
import { EditProductUseCase } from '@/domain/shop/application/use-cases/edit-product'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    FetchProductsController,
    GetProductByIdController,
    EditProductController,
  ],
  providers: [
    CreateProductUseCase,
    FetchProductsUseCase,
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    GetProductByIdUseCase,
    EditProductUseCase,
  ],
})
export class HttpModule {}
