"use client";

import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import Post from "@/components/posts/post";
import PostsSkeleton from "@/components/posts/posts-skeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface UserPostsProps {
  userId: string;
}

export default function UserPosts({ userId }: UserPostsProps) {
  const {
    data,
    status,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "user-posts", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsSkeleton />;
  }

  if (status === "success" && posts.length === 0 && !hasNextPage) {
    return (
      <p className="text-center text-lg text-muted-foreground">
        This user hasn&apos;t posted anything yet.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-lg text-destructive">
        An error occurred while loading the posts.
      </p>
    );
  }

  return (
    <InfiniteScrollContainer
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
      className="space-y-5"
    >
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isFetchingNextPage && <Loader2 className="mx-auto my-4 animate-spin" />}
    </InfiniteScrollContainer>
  );
}
