import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { success } from '@utils';
import { FindAllResponse, OneUserResponse, UpdateUserBodyDto } from './dto';
import { CreateUserBodyDto } from './dto/create-user.dto';
import { FindUserQueryDto } from './dto/find-user.dto';
import { UserService } from './user.service';

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  @ApiOkResponse({
    type: FindAllResponse,
  })
  @ApiOperation({
    tags: ['User'],
    summary: 'Get List User',
  })
  async findAll(@Query() query: FindUserQueryDto): Promise<FindAllResponse> {
    return success(await this.userService.findAll(query), 'List User');
  }

  @Post()
  @ApiCreatedResponse({
    type: OneUserResponse,
  })
  @ApiOperation({
    tags: ['User'],
    summary: 'Create New User',
  })
  async create(@Body() data: CreateUserBodyDto): Promise<OneUserResponse> {
    return success(await this.userService.create(data));
  }

  @Put()
  @ApiOkResponse({
    type: OneUserResponse,
  })
  @ApiOperation({
    tags: ['User'],
    summary: 'Update User',
  })
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserBodyDto,
  ): Promise<OneUserResponse> {
    return success(await this.userService.update(+id, data));
  }

  @Delete()
  @ApiOkResponse({
    type: OneUserResponse,
  })
  @ApiOperation({
    tags: ['User'],
    summary: 'Delete User',
  })
  async delete(@Param('id') id: string): Promise<OneUserResponse> {
    return success(await this.userService.delete(+id));
  }
}
