import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Clients (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let clientFactory: ClientFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, ClientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    clientFactory = moduleRef.get(ClientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /clients', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    await Promise.all([
      clientFactory.makePrismaClient({
        name: 'Junior',
        userId: user.id,
      }),
      clientFactory.makePrismaClient({
        name: 'Astolfo',
        userId: user.id,
      }),
      clientFactory.makePrismaClient({
        name: 'Geraldo',
        userId: user.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get('/clients')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    console.log(response.body)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      clients: expect.arrayContaining([
        expect.objectContaining({ name: 'Junior' }),
        expect.objectContaining({ name: 'Astolfo' }),
        expect.objectContaining({ name: 'Geraldo' }),
      ]),
      totalCount: 3,
    })
  })
})
