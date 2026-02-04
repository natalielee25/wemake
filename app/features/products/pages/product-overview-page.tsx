import { useOutletContext } from "react-router";
import type { Route } from "./+types/product-overview-page"
import { makeSSRClient } from "~/supa-client";

export const loader = async ({ request, params }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  await client.rpc("track_event", {
    event_type: "product_view",
    event_data: {
      product_id: params.productId,
    },
  });
  return null;
};

export default function ProductOverviewPage() {
  const { description, how_it_works } = useOutletContext<{
    description: string;
    how_it_works: string;
  }>();
  return (
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold">Overview of the product</h2>
          <p className="text-muted-foreground">{description}</p>        
        </div>
        <div>
          <h2 className="text-lg font-bold">How does it work?</h2>
          <p className="text-muted-foreground">{how_it_works}</p>
        </div>
      </div>

  )
} 