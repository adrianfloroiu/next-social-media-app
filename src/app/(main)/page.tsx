import PostEditor from "@/components/posts/editor/post-editor";
import TrendingSidebar from "@/components/trending-sidebar";
import ForYouFeed from "./for-you-feed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FollowingFeed from "./following-feed";

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList className="w-full gap-1 bg-card shadow-sm">
            <TabsTrigger
              value="for-you"
              className="h-full flex-1 hover:bg-background data-[state=active]:font-bold"
            >
              For you
            </TabsTrigger>
            <TabsTrigger
              value="following"
              className="h-full flex-1 hover:bg-background data-[state=active]:font-bold"
            >
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendingSidebar />
    </main>
  );
}
