import { SidebarMenuItem, SidebarMenuButton } from "~/common/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "~/common/components/ui/avatar";
import { Link, useLocation } from "react-router";

interface MessageCardProps {
    avatarUrl: string;
    avatarFallback: string;
    name: string;
    lastMessage: string;
    id: string;
}

export function MessageCard({
    avatarUrl,
    avatarFallback,
    name,
    lastMessage,
    id,
}: MessageCardProps) {
    const location = useLocation();
    return (
        <SidebarMenuItem>
            <SidebarMenuButton 
            className="h-18" 
            asChild
            isActive={location.pathname === `/my/messages/${id}`}
            >
                <Link to={`/my/messages/${id}`}>
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {lastMessage}
                        </span>
                    </div>
                </div>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
