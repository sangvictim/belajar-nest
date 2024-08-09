import type { User } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { QueryableDto, SchemaDto } from '@types';

export const findAuthQuerySchema = z.object({
  search: z.string().optional(),
} satisfies SchemaDto<User, QueryableDto>);

export class FindAuthQueryDto extends createZodDto(findAuthQuerySchema) { }
