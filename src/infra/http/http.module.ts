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
import { DeleteProductController } from './controllers/delete-product.controller'
import { DeleteProductUseCase } from '@/domain/shop/application/use-cases/delete-product'
import { CreateClientController } from './controllers/create-client.controller'
import { CreateClientUseCase } from '@/domain/shop/application/use-cases/create-client'
import { FetchClientsController } from './controllers/fetch-clients.controller'
import { FetchClientsUseCase } from '@/domain/shop/application/use-cases/fetch-clients'
import { EditClientController } from './controllers/edit-client.controller'
import { EditClientUseCase } from '@/domain/shop/application/use-cases/edit-client'
import { GetClientByIdController } from './controllers/get-client-by-id.controller'
import { GetClientByIdUseCase } from '@/domain/shop/application/use-cases/get-client-by-id'
import { DeleteClientController } from './controllers/delete-client.controller'
import { DeleteClientUseCase } from '@/domain/shop/application/use-cases/delete-client'
import { CreateOrderController } from './controllers/create-order.controller'
import { CreateOrderUseCase } from '@/domain/shop/application/use-cases/create-order'
import { GetUserProfileController } from './controllers/get-user-profile'
import { GetUserProfileUseCase } from '@/domain/shop/application/use-cases/get-user-profile'
import { FetchOrdersController } from './controllers/fetch-orders.controller'
import { FetchOrdersUseCase } from '@/domain/shop/application/use-cases/fetch-recent-orders'
import { EditOrderController } from './controllers/edit-order.controller'
import { EditOrderUseCase } from '@/domain/shop/application/use-cases/edit-order'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    FetchProductsController,
    GetProductByIdController,
    EditProductController,
    DeleteProductController,
    CreateClientController,
    FetchClientsController,
    EditClientController,
    GetClientByIdController,
    DeleteClientController,
    CreateOrderController,
    FetchOrdersController,
    EditOrderController,
    GetUserProfileController,
  ],
  providers: [
    CreateProductUseCase,
    FetchProductsUseCase,
    AuthenticateUserUseCase,
    RegisterUserUseCase,
    GetProductByIdUseCase,
    EditProductUseCase,
    DeleteProductUseCase,
    CreateClientUseCase,
    FetchClientsUseCase,
    EditClientUseCase,
    GetClientByIdUseCase,
    DeleteClientUseCase,
    CreateOrderUseCase,
    FetchOrdersUseCase,
    EditOrderUseCase,
    GetUserProfileUseCase,
  ],
})
export class HttpModule { }
