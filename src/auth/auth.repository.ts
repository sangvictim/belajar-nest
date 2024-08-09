import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma';
import { FindAuthQueryDto, LoginBodySchema, RegisterBodyDto } from './dto';
import { AuthExtractedQuery, AuthSearchParam } from './type';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) { }
  extractQuery(query: FindAuthQueryDto): AuthExtractedQuery {
    const filter: AuthExtractedQuery['filter'] = [];
    let search: AuthExtractedQuery['search'] = [];
    if (query.search) {
      search = [
        {
          username: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: query.search,
            mode: 'insensitive',
          },
        },
      ];
    }
    return {
      filter,
      search,
    };
  }



  create(data: RegisterBodyDto) {
    return this.prisma.user.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        created_at: true,
        updated_at: true,
      }
    });
  }

  findByEmail(data: LoginBodySchema) {
    return this.prisma.user.findFirst({
      where: {
        email: data.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        username: true,
        created_at: true,
        updated_at: true,
      }
    })
  }

  async isExist({ search: { username, email } }: AuthSearchParam): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        deleted_at: null,
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    return !!user;
  }
}
