import { Card, CardHeader, CardTitle, CardContent } from "~/common/components/ui/card";
import type { Route } from "./+types/dashboard-product-page";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "~/common/components/ui/chart";  
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "../queries";
import { redirect } from "react-router";

export const meta: Route.MetaFunction = () => [{ title: "Dashboard Product | wemake" }];


export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client } = await makeSSRClient(request);
    const userId = await getLoggedInUserId(client);
    const { error } = await client
      .from("products")
      .select("product_id")
      .eq("profile_id", userId)
      .eq("product_id", Number(params.productId))
      .single();
    if (error) {
      throw redirect("/my/dashboard/products");
    }
    const { data, error: rcpError } = await client.rpc("get_product_stats", {
      product_id: params.productId,
    });
    if (rcpError) {
      throw error;
    }
    return {
      chartData: data,
    };
  };

    const chartConfig = {
        views: {
            label: "👀 Views",
            color: "hsl(221, 83%, 53%)",
        },
        visitors: {
            label: "👥 Visitors",
            color: "hsl(160, 84%, 39%)",
        }
    } satisfies ChartConfig;

    export default function DashboardProductPage({
        loaderData,
      }: Route.ComponentProps) {

        return (
            <div className="space-y-5 h-full">
                <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
                <Card className="w-1/2">
                    <CardHeader>
                        <CardTitle>
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={loaderData.chartData}
                            margin={{
                            left: 12,
                            right: 12,
                            }}
                        >
                            <CartesianGrid vertical={false} />
                            <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            padding={{ left: 15, right: 15 }}
                            />
                            <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                            />
                            <Area
                            dataKey="product_views"
                            type="natural"
                            fill="var(--color-views)"
                            fillOpacity={0.15}
                            stroke="var(--color-views)"
                            strokeWidth={2}
                            dot={false}
                            />
                            <Area
                            dataKey="product_visits"
                            type="natural"
                            fill="var(--color-visitors)"
                            fillOpacity={0.15}
                            stroke="var(--color-visitors)"
                            strokeWidth={2}
                            dot={false}
                            />
                        </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        )
    }
