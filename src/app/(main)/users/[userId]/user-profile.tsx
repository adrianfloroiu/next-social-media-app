import FollowButton from "@/components/follow-button";
import FollowerCount from "@/components/follower-count";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import { FollowerInfo, UserData } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import { formatDate } from "date-fns";

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default async function UserProfile({
  user,
  loggedInUserId,
}: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      ({ followerId }) => followerId === loggedInUserId,
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <UserAvatar
        avatarUrl={user.image}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <section className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
          </div>
          <p className="italic text-muted-foreground">
            Member since {formatDate(user.createdAt, "MMM d, yyyy")}
          </p>
          <div className="flex items-center gap-3">
            <span>
              Posts:{" "}
              <span className="font-semibold">
                {formatNumber(user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={user.id} initialState={followerInfo} />
          </div>
        </div>
        {user.id === loggedInUserId ? (
          <Button>Edit profile</Button>
        ) : (
          <FollowButton userId={user.id} initialState={followerInfo} />
        )}
      </section>
      {user.bio && (
        <>
          <hr />
          <div className="overflow-hidden whitespace-pre-line break-words">
            {user.bio}
          </div>
        </>
      )}
    </div>
  );
}
