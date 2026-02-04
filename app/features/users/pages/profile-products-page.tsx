import { ProductCard } from "~/features/products/components/product-card";
import type { Route } from "./+types/profile-products-page";
import { getUserProducts } from "../queries";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = ({ params }) => {
    return [
        { title: `${params.username} - Products | Wemake` },
    ];
};

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
    const products = await getUserProducts(client, {
      username: params.username,
    });
    return { products };
  };
  
  export default function ProfileProductsPage({
    loaderData,
  }: Route.ComponentProps) {
    return (
        <div className="felx flex-col space-y-10">
        	{loaderData.products.map((product) => (
                <ProductCard
                key={product.product_id}
                id={product.product_id}
                name={product.name}
                description={product.tagline}
                reviewsCount={product.reviews}
                viewsCount={product.views}
                votesCount={product.upvotes}
                />
            ))}
        </div>
    );
}