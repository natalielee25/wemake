import type { Route } from "./+types/product-visit-page";
import { redirect } from "react-router";
import { makeSSRClient } from "~/supa-client";
import { getProductById } from "../queries";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client } = makeSSRClient(request);
    const product = await getProductById(client, { productId: params.productId });
    if (product) {
        await client.rpc("track_event", {
        event_type: "product_visit",
        event_data: {
            product_id: params.productId,
        },
        });
        return redirect(product.url);
    }
    throw new Response("Product not found", { status: 404 });
};
