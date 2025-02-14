"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPostSchema } from "@/lib/validation";
import { headers } from "next/headers";

export async function submitPost(input: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw Error("Unauthorized");
  }

  const { content } = createPostSchema.parse({ content: input });

  await prisma.post.create({
    data: {
      content,
      userId: session.user.id,
    },
  });
}
