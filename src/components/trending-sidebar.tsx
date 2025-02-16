import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { userDataSelect } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./user-avatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";

export default function TrendingSidebar() {
  return (
    <div className="sticky top-[5.5rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return null;
  }

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: session.user.id,
      },
    },
    select: userDataSelect,
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-xl font-bold">Who to follow</h3>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <Link href={`/users/${user.id}`} className="flex items-center gap-3">
            <UserAvatar
              avatarUrl={user.image}
              size={36}
              className="flex-none"
            />
            <p className="line-clamp-1 break-all font-medium hover:underline">
              {user.name}
            </p>
          </Link>
          <Button size={"sm"}>Follow</Button>
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
  FROM post
  GROUP BY (hashtag)
  ORDER BY count DESC, hashtag ASC
  LIMIT 5`;

    return result.map((topic) => ({
      hashtag: topic.hashtag,
      count: Number(topic.count),
    }));
  },
  ["trending-topics"],
  {
    revalidate: 3 * 60 * 60,
  },
);

async function TrendingTopics() {
  const trendingTopics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="text-xl font-bold">Trending topics</h3>
      {trendingTopics.map(({ hashtag, count }) => {
        const title = hashtag.split("#")[1];

        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-medium hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
