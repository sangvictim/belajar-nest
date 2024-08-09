import { Module } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from '../zod/validation.pipe';
import { AuthModule } from './auth/auth.module';
import { AppConfigModule } from './config';
import { PrismaModule } from './prisma';
import { UserModule } from './user';

@Module({
  imports: [AppConfigModule, PrismaModule, UserModule, AuthModule, ThrottlerModule.forRoot([{
    ttl: 60,
    limit: 10
  }])],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule { }
