import {
  InfiniteData,
  Query,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitPost } from "./actions";
import { toast } from "@/hooks/use-toast";
import { PostsPage } from "@/lib/types";
import { authClient } from "@/lib/auth-client";

export function useSubmitPostMutation() {
  const queryClient = useQueryClient();

  const { data: session } = authClient.useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(session?.user.id))
          );
        },
      } satisfies QueryFilters<
        InfiniteData<PostsPage, string | null>,
        Error,
        InfiniteData<PostsPage, string | null>,
        readonly unknown[]
      >;

      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return (
            queryFilter.predicate(
              query as Query<
                InfiniteData<PostsPage, string | null>,
                Error,
                InfiniteData<PostsPage, string | null>,
                readonly unknown[]
              >,
            ) && !query.state.data
          );
        },
      });

      toast({
        title: "Post created",
        description: "Your post has been successfully created.",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Post creation failed",
        description:
          error.message ?? "An error occurred while creating the post.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
