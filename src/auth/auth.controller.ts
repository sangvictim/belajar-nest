import { Body, Controller, Post } from "@nestjs/common";
import { success } from "@utils";
import { AuthService } from "./auth.service";
import { LoginBodySchema, RegisterBodyDto } from "./dto";
import { ApiOperation } from "@nestjs/swagger";


@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: AuthService) { }


  @Post('register')
  @ApiOperation({
    tags: ['Auth'],
    summary: 'Register User',
  })
  async register(@Body() data: RegisterBodyDto) {
    return success(await this.registerService.register(data))
  }


  @Post('login')
  @ApiOperation({
    tags: ['Auth'],
    summary: 'Login User',
  })
  async login(@Body() data: LoginBodySchema) {
    return success(await this.registerService.login(data))
  }
}