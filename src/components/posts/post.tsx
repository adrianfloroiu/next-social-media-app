import { PostData } from "@/lib/types";
import Link from "next/link";
import UserAvatar from "../user-avatar";
import { formatRelativeDate } from "@/lib/utils";

interface PostProps {
  post: PostData;
}

export default function Post({ post }: PostProps) {
  return (
    <article className="space-y-3 rounded-2xl bg-card p-5 shadow-sm">
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
      <div className="whitespace-pre-line break-words">{post.content}</div>
    </article>
  );
}
