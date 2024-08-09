import type { Prisma, User } from '@prisma/client';
import { ExtractedQuery } from '@types';

export type AuthExtractedQuery = ExtractedQuery<Prisma.UserWhereInput[]>;
export type AuthSearchParam = {
  search: Partial<Pick<User, 'username' | 'email'>>;
};
