import { PageHeader } from "~/common/components/page-header";
import { CategoryCard } from "~/features/products/components/category-card";
import type { Route } from "./+types/categories-page";
import { getCategories } from "../queries";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => [
  { title: "Categories | ProductHunt Clone" },
  { name: "description", content: "Browse products by category" },
];

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client, headers } = makeSSRClient(request);
  const categories = await getCategories(client);
  return { categories };
};

export default function CategoriesPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className="space-y-10">
    <PageHeader title="Categories" description="Browse products by category" />
    <div className="grid grid-cols-4 gap-10">
      {loaderData.categories.map((category) => (
        <CategoryCard
          key={category.category_id}
          id={category.category_id}
          name={category.name}
          description={category.description}
        />
      ))}
    </div>
  </div>
);
}