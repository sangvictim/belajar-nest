import { Body, Controller, Post } from "@nestjs/common";
import { success } from "@utils";
import { AuthService } from "./auth.service";
import { LoginBodySchema, RegisterBodyDto } from "./dto";


@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: AuthService) { }


  @Post('register')
  async register(@Body() data: RegisterBodyDto) {
    return success(await this.registerService.create(data))
  }


  @Post('login')
  async login(@Body() data: LoginBodySchema) {
    return success(await this.registerService.login(data))
  }
}