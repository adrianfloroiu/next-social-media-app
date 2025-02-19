import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import PostMoreButton from "./post-more-button";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  const { data: session } = authClient.useSession();

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <Link href={`/users/${post.user.id}`}>
            <UserAvatar avatarUrl={post.user.image} />
          </Link>
          <div>
            <Link
              href={`/users/${post.user.id}`}
              className="block font-semibold hover:underline"
            >
              {post.user.name}
            </Link>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === session?.user?.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity focus-visible:ring-transparent group-hover/post:opacity-100"
          />
        )}
      </div>
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
