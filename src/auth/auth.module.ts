import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user';
import { jwtConstants } from './constants';

@Module({
  imports: [UserModule, JwtModule.register({
    global: true,
    signOptions: { expiresIn: '24h' },
    secret: process.env.JWT_SECRET
  })],
  providers: [AuthService, AuthRepository],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
