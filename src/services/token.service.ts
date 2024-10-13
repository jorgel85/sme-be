import { PrismaClient, Prisma, Token } from '@prisma/client';


const prisma = new PrismaClient();

export const createToken = async (input: Prisma.TokenCreateInput) => {
  return (await prisma.token.create({
    data: input,
  })) as Token;
};

export const findFirstToken = async (
  where: Prisma.TokenWhereInput,
  select?: Prisma.TokenSelect
) => {
  return (await prisma.token.findFirst({
    where,
    select,
  })) as Token;
};

export const deleteToken = async (refreshToken: string) => {
  await prisma.token.deleteMany({  
    where: {  
      refreshToken,  
    },
  });
  return;
};
