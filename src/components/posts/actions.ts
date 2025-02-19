"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";
import { headers } from "next/headers";

export async function deletePost(id: string) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  if (post.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const deletedPost = await prisma.post.delete({
    where: { id },
    include: postDataInclude,
  });

  return deletedPost;
}
