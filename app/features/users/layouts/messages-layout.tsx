import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarProvider } from "~/common/components/ui/sidebar"
import { Outlet, useOutletContext } from "react-router"
import { MessageCard } from "~/features/users/components/message-card"
import type { Route } from "./+types/messages-layout";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId, getMessages } from "../queries";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const messages = await getMessages(client, { userId });
    return {
      messages,
    };
  };
  
  export default function MessagesLayout({ loaderData }: Route.ComponentProps) {
    const { userId, name, avatar } = useOutletContext<{
        userId: string;
        name: string;
        avatar: string;
      }>();
    return <SidebarProvider className="max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
       <Sidebar className="pt-15"variant="floating">
        <SidebarContent>
            <SidebarGroup>
                <SidebarMenu>
                	{loaderData.messages.map((message) => (
                        <MessageCard
                            key={message.message_room_id}
                            id={message.message_room_id.toString()}
                            name={message.name}
                            lastMessage={message.last_message}
                            avatarUrl={message.avatar}
                        />
                    ))}
                </SidebarMenu>
            </SidebarGroup>
        </SidebarContent>
        </Sidebar> 
        <div className="h-full w-full">
        	<Outlet context={{ userId, name, avatar }} />
        </div>
    </SidebarProvider>
}