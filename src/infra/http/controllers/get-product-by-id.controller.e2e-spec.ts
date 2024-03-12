import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ProductFactory } from 'test/factories/make-product'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Products (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let productFactory: ProductFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ProductFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    productFactory = moduleRef.get(ProductFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /products/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const product = await productFactory.makePrismaProduct({
      userId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get(`/products/${product.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      product: expect.objectContaining({
        name: product.name,
        price: product.price,
        stock: product.stock,
      }),
    })
  })
})
