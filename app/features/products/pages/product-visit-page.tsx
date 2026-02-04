import client from "~/supa-client";
import type { Route } from "./+types/product-visit-page";
import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
    const { error, data } = await client
        .from("products")
        .select("url")
        .eq("product_id", params.productId)
        .single();
    if (data) {
        await client.rpc("track_event", {
        event_type: "product_visit",
        event_data: {
            product_id: params.productId,
        },
        });
        return redirect(data.url);
    }
    };
