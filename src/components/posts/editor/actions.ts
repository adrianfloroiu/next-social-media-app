"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";
import { headers } from "next/headers";

export async function submitPost(input: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: session.user.id,
    },
    include: postDataInclude,
  });

  return newPost;
}
