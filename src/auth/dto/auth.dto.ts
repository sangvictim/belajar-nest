import type { User } from '@prisma/client';
import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';
import { SchemaDto } from '@types';

export const registerBodySchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(3),
} satisfies SchemaDto<User>);

export const loginBodySchema = z.object({
  email: z.string().email().min(3),
  password: z.string().min(3),
} satisfies SchemaDto<User>);


export class LoginBodySchema extends createZodDto(loginBodySchema) { }
export class RegisterBodyDto extends createZodDto(registerBodySchema) { }
