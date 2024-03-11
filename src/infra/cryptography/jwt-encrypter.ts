import { Encrypter } from '@/domain/shop/application/cryptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEnctypter implements Encrypter {
  constructor(private readonly jwtService: JwtService) {}

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
