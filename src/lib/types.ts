import { Prisma } from "@prisma/client";

export const postDataInclude = {
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.PostInclude;

export type PostData = Prisma.PostGetPayload<{
  include: typeof postDataInclude;
}>;
