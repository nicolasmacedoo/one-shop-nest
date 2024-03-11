import { Module } from '@nestjs/common'

import { Encrypter } from '@/domain/shop/application/cryptography/encrypter'
import { HashComparer } from '@/domain/shop/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/shop/application/cryptography/hash-generator'

import { JwtEnctypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEnctypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
