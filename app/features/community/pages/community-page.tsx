import { PageHeader } from "~/common/components/page-header";
import type { Route } from "./+types/community-page";
import { data, Form, Link, useSearchParams } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/common/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { PERIOD_OPTIONS, SORT_OPTIONS } from "../constants";
import { Input } from "~/common/components/ui/input";
import { PostCard } from "../components/post-card";
import { getPosts, getTopics } from "../queries";
import {z} from "zod";
//import { parseDomainOfCategoryAxis } from "recharts/types/util/ChartUtils";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Community | wemake" }];
};

const searchParamsSchema = z.object({
  sorting: z.enum(["newest", "popular"]).optional().default("newest"),
  period: z
    .enum(["all", "today", "week", "month", "year"])
    .optional()
    .default("all"),
  keyword: z.string().optional(),
  topic: z.string().optional(),
});

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  const { success, data: parsedData } = searchParamsSchema.safeParse(
    Object.fromEntries(url.searchParams)
  );
  if (!success) {
    throw data(
      {
        error_code: "invalid_search_params",
        message: "Invalid search params",
      },
      { status: 400 }
    );
  }

  const { client, headers } = makeSSRClient(request);
  const [topics, posts] = await Promise.all([
    getTopics(client),
    getPosts(client, {
      limit: 20,
      sorting: parsedData.sorting,
      period: parsedData.period,
      keyword: parsedData.keyword,
      topic: parsedData.topic,
    }),
  ]);
  return { topics, posts };
};

export default function CommunityPage({loaderData}: Route.ComponentProps ) {
  const { topics, posts } = loaderData;
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get("sort") || "newest";
  const period = searchParams.get("period") || "all";
  return (
    <div>
      <PageHeader 
        title="Community"
        description="Ask questions, share ideas, and connect with other developers"
      />
      <div className="grid grid-cols-6 items-start gap-40">
        <div className="col-span-4 space-y-10">
          <div className="flex justify-between">
            <div className="space-y-5 w-full">
              <div className="flex items-center gap-5">
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <span className="text-sm capitalize">{sort}</span>
                    <ChevronDownIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuCheckboxItem
                        className="capitalize cursor-pointer"
                        key={option}
                        onCheckedChange={(checked: boolean) => {
                          if (checked) {
                            searchParams.set("sort", option);
                            setSearchParams(searchParams);
                          }
                        }}
                      >
                        {option}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                {sort === "popular" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-1">
                      <span className="text-sm capitalize">{period}</span>
                      <ChevronDownIcon className="size-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {PERIOD_OPTIONS.map((option) => (
                        <DropdownMenuCheckboxItem
                          className="capitalize cursor-pointer"
                          key={option}
                          onCheckedChange={(checked: boolean) => {
                            if (checked) {
                              searchParams.set("period", option);
                              setSearchParams(searchParams);
                            }
                          }}
                        >
                          {option}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              <Form className="w-2/3">
                <Input
                  type="text"
                  name="keyword"
                  placeholder="Search for discussions"
                />
              </Form>
            </div>
            <Button asChild className="ml-8 shrink-0">
              <Link to={`/community/submit`}>Create Discussion</Link>
            </Button>
          </div>
          <div className="space-y-5">
            {posts.map((post) => (
                  <PostCard
                    key={post.post_id}
                    id={post.post_id.toString()}
                    title={post.title}
                    author={post.author}
                    authorAvatarUrl={post.author_avatar}
                    category={post.topic}
                    timeAgo={post.created_at}
                    votesCount={post.upvotes}
                    isUpvoted={post.is_upvoted}
                    expanded
                  />
            ))}
          </div>
        </div>
        <aside className="col-span-2 space-y-5 pl-8">
          <span className="text-sm font-bold text-muted-foreground uppercase">
            Topics
          </span>
          <div className="flex flex-col gap-2 items-start">
            {topics.map((topic) => (
              <Button asChild variant={"link"} key={topic.slug} className="pl-0">
                <Link to={`/community?topic=${topic.slug}`}>{topic.name}</Link>
              </Button>
                ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export function HydrateFallback() {
  return <div>Loading...</div>
}