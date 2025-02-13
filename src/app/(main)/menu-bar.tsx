import { Button } from "@/components/ui/button";
import { BookmarkIcon, HomeIcon, BellIcon } from "lucide-react";
import Link from "next/link";

interface MenuBarProps {
  className?: string;
}

export default function MenuBar({ className }: MenuBarProps) {
  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-4"
        title="Home"
        asChild
      >
        <Link href="/">
          <HomeIcon className="!size-5" />
          <span className="hidden text-base lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-4"
        title="Notifications"
        asChild
      >
        <Link href="/notifications">
          <BellIcon className="!size-5" />
          <span className="hidden text-base lg:inline">Notifications</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-4"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <BookmarkIcon className="!size-5" />
          <span className="hidden text-base lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
