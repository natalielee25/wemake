import type { Route } from "./+types/messages-page";
import { PageHeader } from "~/common/components/page-header";
import { Card, CardContent } from "~/common/components/ui/card";
import { UserAvatar } from "../components/user-avatar";
import { Link } from "react-router";
import { MessageCircleIcon } from "lucide-react";

export const meta: Route.MetaFunction = () => [{ title: "Messages | wemake" }];

export default function MessagesPage() {
    return <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
        <MessageCircleIcon className="size-12 text-muted-foreground" />
        <h1 className="text-xl text-muted-foreground font-semibold">
            Click on a message in the sidebar to view.
        </h1>
    </div>
}