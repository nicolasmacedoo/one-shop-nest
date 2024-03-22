import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { ClientFactory } from 'test/factories/make-client'
import { UserFactory } from 'test/factories/make-user'

describe('Edit Product (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
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
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /clients/:id', async () => {
    const user = await userFactory.makePrismaUser()

    const accessToken = jwt.sign({ sub: user.id.toString() })

    const client = await clientFactory.makePrismaClient({
      userId: user.id,
    })

    const clientId = client.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/clients/${clientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Name',
        document: '12345678901',
        email: 'new-email@email.com',
        phone: '12345678901',
      })

    expect(response.statusCode).toBe(204)

    const productOnDatabase = await prisma.client.findUnique({
      where: {
        id: clientId,
      },
    })

    const editedClient = {
      name: productOnDatabase?.name,
      document: productOnDatabase?.document,
      email: productOnDatabase?.email,
      phone: productOnDatabase?.phone,
    }

    expect(editedClient).toMatchObject(
      expect.objectContaining({
        name: 'New Name',
        document: '12345678901',
        email: 'new-email@email.com',
        phone: '12345678901',
      }),
    )
  })
})
