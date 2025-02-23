import TrendingSidebar from "@/components/trending-sidebar";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import UserProfile from "./user-profile";
import UserPosts from "./user-posts";

interface PageProps {
  params: {
    userId: string;
  };
}

const getUser = cache(async (userId: string, loggedInUserId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: getUserDataSelect(loggedInUserId),
  });

  if (!user) notFound();

  return user;
});

export async function generateMetadata({
  params: { userId },
}: PageProps): Promise<Metadata> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return {};

  const { user: loggedInUser } = session;

  const user = await getUser(userId, loggedInUser.id);

  return {
    title: user.name,
  };
}

export default async function ProfilePage({ params: { userId } }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return (
      <p className="text-lg text-destructive">
        You are not authorized to view this page.
      </p>
    );
  }

  const { user: loggedInUser } = session;

  const user = await getUser(userId, loggedInUser.id);

  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <UserProfile user={user} loggedInUserId={loggedInUser.id} />
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h2 className="text-center text-2xl font-bold">
            {user.name}&apos;s posts
          </h2>
        </div>
        <UserPosts userId={userId} />
      </div>
      <TrendingSidebar />
    </main>
  );
}
