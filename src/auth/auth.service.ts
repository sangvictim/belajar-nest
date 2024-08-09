import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import bcrypt from 'bcrypt';
import { LoginBodySchema, RegisterBodyDto } from "./dto";
import { AuthRepository } from "./auth.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) { }


  async create(data: RegisterBodyDto) {
    if (
      await this.authRepository.isExist({
        search: {
          username: data.username,
          email: data.email
        }
      })
    ) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    }
    data.password = bcrypt.hashSync(data.password, 10);
    return this.authRepository.create(data)
  }

  async login(data: LoginBodySchema) {
    // check if user exist
    if (
      !await this.authRepository.isExist({
        search: {
          email: data.email
        }
      })
    ) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }

    // check password
    const user = await this.authRepository.findByEmail(data);
    if (!bcrypt.compareSync(data.password, String(user?.password))) {
      throw new HttpException('Login failed', HttpStatus.UNAUTHORIZED);
    }

    const payload = { id: user?.id };

    let response = {
      id: user?.id,
      name: user?.name,
      username: user?.username,
      email: user?.email,
      created_at: user?.created_at,
      updated_at: user?.updated_at,
      token: await this.jwtService.signAsync(payload)
    }
    return response

  }
}