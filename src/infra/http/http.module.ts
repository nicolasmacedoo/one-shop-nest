import { Module } from '@nestjs/common'
import { AuthenticateController } from './controllers/authenticate.controller'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateProductController } from './controllers/create-product.controller'
import { FetchProductsController } from './controllers/fetch-products.controller'
import { PrismaService } from '../prisma/prisma.service'

@Module({
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateProductController,
    FetchProductsController,
  ],
  providers: [PrismaService],
})
export class HttpModule {}
