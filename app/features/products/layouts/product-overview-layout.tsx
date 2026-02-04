import { Link, Outlet } from "react-router";
import { Button } from "~/common/components/ui/button";
import { StarIcon } from "lucide-react";
import { ChevronUpIcon } from "lucide-react";
import { NavLink } from "react-router";
import { cn } from "~/lib/utils";
import { buttonVariants } from "~/common/components/ui/button";
import type { Route } from "./+types/product-overview-layout";
import { getProductById } from "../queries";
import { makeSSRClient } from "~/supa-client";

export function meta({ loaderData }: Route.MetaArgs) {
  return [
    { title: `${loaderData.product.name} Overview | wemake` },
    { name: "description", content: "View product details and information" },
  ];
}

export const loader = async ({
  request,
  params,
}: Route.LoaderArgs & { params: { productId: string } }) => {
  const { client, headers } = makeSSRClient(request);
  const product = await getProductById(client, {
    productId: params.productId,
  });
  return { product };
};

export default function ProductOverviewLayout({
  loaderData,
}: Route.ComponentProps) {
    return (
    <div space-y-10>
      <div className="flex justify-between">
        <div className="flex gap-5">
          <div className="size-40 rounded-xl overflow-hidden shadow-xl bg-primary/50">
            <img
              src={loaderData.product.icon}
              alt={loaderData.product.name}
              className="size-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-5xl font-bold">{loaderData.product.name}</h1>
            <p className=" text-2xl font-light">{loaderData.product.tagline}</p>
            <div className="mt-5 flex items-center gap-5">
              <div className="flex text-yellow-500">
                {Array.from({length: 5}).map((_, index) => (
                    <StarIcon 
                      key={index} 
                      className="size-4"
                      fill={
                        index < Math.floor(loaderData.product.average_rating)
                          ? "currentColor"
                          : "none"
                      } 
                    />
                ))}
              </div>
              <span className="text-muted-foreground ">
                {loaderData.product.reviews} reviews
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant={"secondary"} size="lg" asChild className="text-lg h-14 px-6">
            <Link to={`/products/${loaderData.product.product_id}/visit`}>
              Visit Website
            </Link>
          </Button>
          <Button size="lg" className="text-lg h-14 px-6">
            <ChevronUpIcon className="size-4"/>
            Upvote ({loaderData.product.upvotes})
          </Button>
        </div>
      </div>
      <div className="flex gap-2 mt-5 mb-5">
        <NavLink 
            className={({isActive})=> 
            cn(
                [buttonVariants({variant: "outline"}), 
                isActive && "bg-accent text-foreground font-bold"])} 
                to={`/products/${loaderData.product.product_id}/overview`}
        >
                Overview
        </NavLink>
        <NavLink 
            className={({isActive})=> 
            cn(
                [buttonVariants({variant: "outline"}), 
                isActive && "bg-accent text-foreground font-bold"])} 
                to={`/products/${loaderData.product.product_id}/reviews`}
        >
                Reviews
        </NavLink>
      </div>
      <div>
        <Outlet
            context={{
              product_id: loaderData.product.product_id,
              description: loaderData.product.description,
              how_it_works: loaderData.product.how_it_works,
              review_count: loaderData.product.reviews,
            }}
          />
      </div>
    </div>
    )
}