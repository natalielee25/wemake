
import { Link } from "react-router";
import type { Route } from "./+types/leaderboards-page";
import { PageHeader } from "~/common/components/page-header";
import { ProductCard } from "~/features/products/components/product-card";
import { Button } from "~/common/components/ui/button";
import { getProductsByDateRange } from "../queries";
import { DateTime } from "luxon";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Leaderboards | Wemake" },
    { name: "description", content: "Top Product leaderboards" },
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  try {
    const [dailyProducts, weeklyProducts, monthlyProducts, yearlyProducts] = await Promise.all([
      getProductsByDateRange(client, {
        startDate: DateTime.now().startOf("day"),
        endDate: DateTime.now().endOf("day"),
        limit: 7,
      }),
      getProductsByDateRange(client, {
        startDate: DateTime.now().startOf("week"),
        endDate: DateTime.now().endOf("week"),
        limit: 7,
      }),
      getProductsByDateRange(client, {
        startDate: DateTime.now().startOf("month"),
        endDate: DateTime.now().endOf("month"),
        limit: 7, 
      }),
      getProductsByDateRange(client, {
        startDate: DateTime.now().startOf("year"),
        endDate: DateTime.now().endOf("year"),
        limit: 7,
      }),
    ]);
    return { dailyProducts, weeklyProducts, monthlyProducts, yearlyProducts };
  } catch (error) {
    console.error("Failed to load leaderboards data:", error);
    return { dailyProducts: [], weeklyProducts: [], monthlyProducts: [], yearlyProducts: [] };
  }
};

export default function LeaderboardsPage({loaderData}: Route.ComponentProps) {
  return (
    <div>
      <PageHeader 
        title="Leaderboards"
        description="The most popular products on Wemake."
      />
          <div className="grid grid-cols-3 gap-4">
          <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter">Daily Leaderboard</h2>
              <p className="text-xl font-light text-foreground/80">The most popular products made by our community today.</p>
          </div>
              {loaderData.dailyProducts.map((product) => (
                  <ProductCard
                    key={product.product_id.toString()}
                    id={product.product_id.toString()}
                    name={product.name}
                    description={product.tagline}
                    reviewsCount={product.reviews}
                    viewsCount={product.views}
                    votesCount={product.upvotes}
              />
              ))}
              <Button variant="link" asChild className="text-lg self-center">
                <Link to="/products/leaderboards/daily">
                  Explore all products &rarr;
                </Link>
              </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter">Weekly Leaderboard</h2>
              <p className="text-xl font-light text-foreground/80">The most popular products made by our community this week.</p>
            </div>
            {loaderData.weeklyProducts.map((product) => (
              <ProductCard 
                key={product.product_id.toString()}
                id={product.product_id.toString()}
                name={product.name}
                description={product.tagline}
                reviewsCount={product.reviews}
                viewsCount={product.views}
                votesCount={product.upvotes}  
              />
            ))}
            <Button variant="link" asChild className="text-lg self-center">
              <Link to="/products/leaderboards/weekly">
                Explore all products &rarr;
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter">Monthly Leaderboard</h2>
              <p className="text-xl font-light text-foreground/80">The most popular products made by our community this month.</p>
            </div>
            {loaderData.monthlyProducts.map((product) => (
              <ProductCard
                key={product.product_id.toString()}
                id={product.product_id.toString()}
                name={product.name}
                description={product.tagline}
                reviewsCount={product.reviews}
                viewsCount={product.views}
                votesCount={product.upvotes} 
              />
            ))}
            <Button variant="link" asChild className="text-lg self-center">
              <Link to="/products/leaderboards/monthly">
                Explore all products &rarr;
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <h2 className="text-3xl font-bold leading-tight tracking-tighter">Yearly Leaderboard</h2>
              <p className="text-xl font-light text-foreground/80">The most popular products made by our community this year.</p>
            </div>
            {loaderData.yearlyProducts.map((product) => (
              <ProductCard
                key={product.product_id.toString()}
                id={product.product_id.toString()}
                name={product.name}
                description={product.tagline}
                reviewsCount={product.reviews}
                viewsCount={product.views}
                votesCount={product.upvotes}  
              />
            ))}
            <Button variant="link" asChild className="text-lg self-center">
              <Link to="/products/leaderboards/yearly">
                Explore all products &rarr;
              </Link>
            </Button>
          </div>
    </div>
  );
};