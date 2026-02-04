import { Card, CardFooter, CardHeader, CardTitle } from "~/common/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";
import { Button } from "~/common/components/ui/button";
import { EyeIcon } from "lucide-react";
import { cn } from "~/lib/utils";
import { Link, useFetcher } from "react-router";

interface NotificationCardProps {
    avatarUrl: string;
    avatarFallback: string;
    userName: string;
    type: "follow" | "review" | "reply";
    timeAgo: string;
    seen: boolean;
    productName?: string;
    payloadId?: number;
    postTitle?: string;
    id: number;
}

export function NotificationCard({
    type,
    avatarUrl,
    avatarFallback,
    userName,
    timeAgo,
    seen,
    productName,
    postTitle,
    payloadId,
    id,
}: NotificationCardProps) {
    const getMessage = (type: "follow" | "review" | "reply") => {
        switch (type) {
          case "follow":
            return " followed you.";
          case "review":
            return " reviewed your product: ";
          case "reply":
            return " replied to your post: ";
        }
      };
      const fetcher = useFetcher();
      const optimisitcSeen = fetcher.state === "idle" ? seen : true;
    return (
        <Card
            className={cn("min-w-[450px]", optimisitcSeen ? "" : "bg-yellow-500/60")}
        >
            <CardHeader className="!flex flex-row gap-5 items-start">
                <Avatar>
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-lg font-bold">
                        <span>{userName}</span>
                        <span>{getMessage(type)}</span>
                        {productName && (
                        <Button variant={"ghost"} asChild className="text-lg">
                            <Link to={`/products/${payloadId}`}>{productName}</Link>
                        </Button>
                        )}
                        {postTitle && (
                        <Button variant={"ghost"} asChild className="text-lg">
                            <Link to={`/community/${payloadId}`}>{postTitle}</Link>
                        </Button>
                        )}
                    </CardTitle>
                    <small className="text-muted-foreground text-sm">
                        {timeAgo}
                    </small>
                </div>
            </CardHeader>
            <CardFooter className="flex justify-end">
                {optimisitcSeen ? null : (
                    <fetcher.Form method="post" action={`/my/notifications/${id}/see`}>
                        <Button variant="outline" size="icon">
                        <EyeIcon className="w-4 h-4" />
                        </Button>
                    </fetcher.Form>
                )}  
            </CardFooter>
        </Card>
    );
}
