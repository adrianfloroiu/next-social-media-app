"use client";

import useFollowerInfo from "@/hooks/use-follower-info";
import { FollowerInfo } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "./ui/button";
import kyInstance from "@/lib/ky";
import { toast } from "@/hooks/use-toast";

interface FollowButtonProps {
  userId: string;
  initialState: FollowerInfo;
}

export default function FollowButton({
  userId,
  initialState,
}: FollowButtonProps) {
  const { data } = useFollowerInfo(userId, initialState);
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["follower-info", userId];

  const { mutate } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const prevState = queryClient.getQueryData<FollowerInfo>(queryKey);
      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (prevState?.followers || 0) + (prevState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !prevState?.isFollowedByUser,
      }));

      return { prevState };
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(queryKey, context?.prevState);
      console.error(error);
      toast({
        title: "Failed to follow the user",
        description:
          error.message ?? "An error occurred while trying to follow the user.",
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      variant={data.isFollowedByUser ? "secondary" : "default"}
      size={"sm"}
    >
      {data.isFollowedByUser ? "Unfollow" : "Follow"}
    </Button>
  );
}
