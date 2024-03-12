import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'
import { UserFactory } from 'test/factories/make-user'

describe('Delete Product (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    productFactory = moduleRef.get(ProductFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /products/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const product = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const productId = product.id.toString()

    const response = await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const productOnDatabase = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    expect(productOnDatabase).toBeNull()
  })
})
