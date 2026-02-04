import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarProvider, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/common/components/ui/sidebar"
import { Link, Outlet, useLocation } from "react-router"
import { useEffect } from "react"
import { HomeIcon, RocketIcon, SparklesIcon } from "lucide-react"
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId, getProductsByUserId } from "../queries";
import type { Route } from "./+types/dashboard-layout";

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const products = await getProductsByUserId(client, { userId });
    return {
      userId,
      products,
    };
  };
  
  export default function DashboardLayout({ loaderData }: Route.ComponentProps) {    
    const location = useLocation();
    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2f2d3a96-226c-4506-8dc7-db52af0449a6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard-layout.tsx:8',message:'DashboardLayout mounted',data:{initialPath:location.pathname},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
    }, []);
    useEffect(() => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/2f2d3a96-226c-4506-8dc7-db52af0449a6',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard-layout.tsx:12',message:'DashboardLayout location change',data:{pathname:location.pathname,search:location.search,hash:location.hash},timestamp:Date.now(),sessionId:'debug-session',runId:'pre-fix',hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
    }, [location.pathname, location.search, location.hash]);
    return <SidebarProvider className="max-h-[calc(100vh-14rem)] overflow-hidden h-[calc(100vh-14rem)] min-h-full">
       <Sidebar className="pt-15" variant="floating">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={location.pathname === "/my/dashboard"}>
                                <Link to="/my/dashboard">
                                    <HomeIcon className="size-4" />
                                    <span>Home</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={location.pathname === "/my/dashboard/ideas"}>
                                <Link to="/my/dashboard/ideas">
                                    <SparklesIcon className="size-4" />
                                    <span>Ideas</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Product Analytics
                    </SidebarGroupLabel>
                    <SidebarMenu>
                        {loaderData.products.map((product) => (
                            <SidebarMenuItem key={product.product_id}>
                            <SidebarMenuButton
                                asChild
                                isActive={
                                location.pathname ===
                                `/my/dashboard/products/${product.product_id}`
                                }
                            >
                                <Link to={`/my/dashboard/products/${product.product_id}`}>
                                <RocketIcon className="size-4" />
                                <span>{product.name}</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar> 
        <div className="h-full overflow-y-scroll w-full">
            <Outlet />
        </div>
    </SidebarProvider>
}