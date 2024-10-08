import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { FindUserQueryDto, UpdateUserBodyDto } from './dto';
import { CreateUserBodyDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) { }
  async findAll(query: FindUserQueryDto) {
    const { filter, search } = this.userRepo.extractQuery(query);
    return await this.userRepo.findAll({ query, filter, search });
  }

  async findById(id: number) {
    const user = await this.userRepo.findById(id);

    if (user) {
      return user;
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    }
  }

  async create(data: CreateUserBodyDto) {
    if (
      await this.userRepo.isExist({
        search: {
          username: data.username,
          name: data.name,
          email: data.email,
        },
      })
    ) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    }
    data.password = bcrypt.hashSync(data.password, 10);
    return await this.userRepo.create(data);
  }

  async update(id: number, { password, ...data }: UpdateUserBodyDto) {
    if (
      await this.userRepo.isExist({
        search: {
          username: data.username,
          name: data.name,
          email: data.email,
        },
        not: {
          id,
        },
      })
    ) {
      throw new HttpException('User already exist', HttpStatus.CONFLICT);
    }

    if (password) {
      password = bcrypt.hashSync(password, 10);
    }

    return await this.userRepo.update(id, { ...data, password });
  }

  async delete(id: number) {
    return await this.userRepo.delete(id);
  }
}
