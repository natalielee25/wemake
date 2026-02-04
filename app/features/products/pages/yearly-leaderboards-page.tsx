import { DateTime } from "luxon";
import type { Route } from "./+types/yearly-leaderboards-page";
import { data, isRouteErrorResponse, Link } from "react-router";
import { z } from "zod";
import { PageHeader } from "~/common/components/page-header";
import { ProductCard } from "../components/product-card";
import { Button } from "~/common/components/ui/button";
import ProductPagination from "~/common/components/product-pagination";
import { getProductPagesByDateRange, getProductsByDateRange } from "../queries";
import { makeSSRClient } from "~/supa-client";

const paramsSchema = z.object({
  year: z.coerce.number(),
});

export const meta: Route.MetaFunction = ({ params }) => {
  const date = DateTime.fromObject({
    year: Number(params.year),
  }).setZone("Asia/Seoul");
  
  const year = date.year.toString();
  
  return [
    {
      title: `The best of ${year} | wemake`,
    },
  ];
};

export const loader = async  ({ params, request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 1);
  const { success, data: parsedData } = paramsSchema.safeParse(params);
  if (!success) {
    throw data(
      {
        error_code: "invalid_params",
        message: "Invalid params",
      },
      { status: 400 }
    );
  }
  const date = DateTime.fromObject({
    year: parsedData.year,
  }).setZone("Asia/Seoul");
  if (!date.isValid) {
    throw data(
      {
        error_code: "invalid_date",
        message: "Invalid date",
      },
      {
        status: 400,
      }
    );
  }
  const today = DateTime.now().setZone("Asia/Seoul").startOf("year");
  if (date > today) {
    throw data(
      {
        error_code: "future_date",
        message: "Future date",
      },
      { status: 400 }
    );
  }
  
  const { client, headers } = makeSSRClient(request);
  const products = await getProductsByDateRange(client, {
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
    limit: 15,
    page,
  });

  const totalPages = await getProductPagesByDateRange(client, {
    startDate: date.startOf("year"),
    endDate: date.endOf("year"),
  });

  return {
    ...parsedData,
    products,
    totalPages,
  };
};

// Helper function to format date without using Intl API (avoids locale resolution issues)
function formatDateShort(date: DateTime): string {
  const year = date.year.toString();
  return `${year}`;
}

// Helper function to format month and year without using Intl API
function formatMonthYear(date: DateTime): string {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const month = monthNames[date.month - 1];
  const year = date.year.toString();
  return `${month} ${year}`;
}

export default function WeeklyLeaderboardsPage({
    loaderData,
  }: Route.ComponentProps) {
    const urlDate = DateTime.fromObject({
      year: loaderData.year,
    }).setZone("Asia/Seoul");
    const previousYear = urlDate.minus({years: 1});
    const nextYear = urlDate.plus({years: 1});
    const isToday = urlDate.equals(DateTime.now().setZone("Asia/Seoul").startOf("year"));

    return (
      <div className="container mx-auto px-4 py-8">
        <PageHeader title={`The best of ${urlDate.year}`} />
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" asChild>
            <Link
              to={`/products/leaderboards/yearly/${previousYear.year}`}
            >
              &larr; {formatDateShort(previousYear)}
            </Link>
          </Button>
          {!isToday ? <Button variant="outline" asChild>
            <Link
              to={`/products/leaderboards/yearly/${nextYear.year}`}
            >
              {formatDateShort(nextYear)} &rarr;
            </Link>
          </Button> : null}
        </div>
        <div className="space-y-5 w-full max-w-screen-md mx-auto">
          {loaderData.products.map((product) => (
            <ProductCard
                  key={product.product_id}
                  id={product.product_id.toString()}
                  name={product.name}
                  description={product.tagline}
                  reviewsCount={product.reviews}
                  viewsCount={product.views}
                  votesCount={product.upvotes}
            />
          ))}
        </div>
        <ProductPagination totalPages={loaderData.totalPages} />
      </div>
    );
}


export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        {error.data.message} / {error.data.error_code}
      </div>
    );
  }
  if (error instanceof Error) {
    return <div>{error.message}</div>;
  }
  return <div>Unknown error</div>;
}
