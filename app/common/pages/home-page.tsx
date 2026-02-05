import type { MetaFunction } from "react-router";
import { Link, data } from "react-router";
import { ProductCard } from "~/features/products/components/product-card";
import { PostCard } from "~/features/community/components/post-card";
import { IdeaCard } from "~/features/ideas/components/idea-card";
import { JobCard } from "~/features/jobs/components/job-card";
import { TeamCard } from "~/features/teams/components/team-card";
import { Button } from "../components/ui/button";
import { getProductsByDateRange } from "~/features/products/queries";
import { DateTime } from "luxon";
import type { Route } from "./+types/home-page";
import { getPosts } from "~/features/community/queries";
import { getGptIdeas } from "~/features/ideas/queries";
import { getJobs } from "~/features/jobs/queries";
import { getTeams } from "~/features/teams/queries";
import { makeSSRClient } from "~/supa-client";

export const meta: MetaFunction = () => {
    return [
    { title: "Home | Wemake" },
    { name: "description", content: "The best place to find and share products" },
	];
};

export const loader =async ({request}: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
  	const products = await getProductsByDateRange(client,{
        startDate: DateTime.now().startOf("day"),
        endDate: DateTime.now().endOf("day"),
        limit: 7
    	});
    const posts = await getPosts(client, {
        limit:7,
        sorting: "newest"
    });
    const ideas = await getGptIdeas(client,{
        limit:7
    });
    const jobs = await getJobs(client,{ 
        limit: 11 
    });
    const teams = await getTeams(client,{ 
        limit: 7 
    });
    return data({ products, posts, ideas, jobs, teams }, { headers });
};

export default function HomePage({loaderData}: Route.ComponentProps) {
    return (
        <div className="px-18 space-y-40">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tighter">Today's Products</h2>
                    <p className="text-xl font-light text-foreground/80">The best products made by our community today.</p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/products/leaderboards">Explore All Products &rarr;</Link>
                    </Button>
                </div>
                    {loaderData.products.map((product, index) => (
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
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tighter">Latest Discussions</h2>
                    <p className="text-xl font-light text-foreground/80">The latest discussions from our community.</p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/community">Explore All Discussions &rarr;</Link>
                    </Button>
                </div>
                {loaderData.posts.map((post) => (
                    <PostCard
                    key={post.post_id}
                    id={post.post_id}
                    title={post.title}
                    author={post.author}
                    authorAvatarUrl={post.author_avatar}
                    category={post.topic}
                    timeAgo={post.created_at}
                    votesCount={post.upvotes}
                />
            ))}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tighter">IdeasGPT</h2>
                    <p className="text-xl font-light text-foreground/80">Find ideas for your next project.</p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/ideas">Explore all ideas &rarr;</Link>
                    </Button>
                </div>
                {loaderData.ideas.map((idea) => (
                    <IdeaCard
                        key={idea.gpt_idea_id}
                        id={idea.gpt_idea_id}
                        title={idea.idea}
                        viewsCount={idea.views}
                        likesCount={idea.likes}
                        claimed={idea.is_claimed}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tighter">Latest Jobs</h2>
                    <p className="text-xl font-light text-foreground/80">Find your dream job.</p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/jobs">Explore all jobs &rarr;</Link>
                    </Button>
                </div>
                {loaderData.jobs.map((job) => (
                    <JobCard
                        key={job.job_id}
                        id={job.job_id}
                        company={job.company_name}
                        companyLogoUrl={job.company_logo}
                        companyLocation={job.company_location}
                        title={job.position}
                        timeAgo={job.created_at}
                        jobType={job.job_type}
                        positionLocation={job.location}
                        salaryRange={job.salary_range}
                />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                <div>
                    <h2 className="text-5xl font-bold leading-tight tracking-tighter">Find a teammate.</h2>
                    <p className="text-xl font-light text-foreground/80">Join a team looking for a new member.</p>
                    <Button variant="link" asChild className="text-lg p-0">
                        <Link to="/teams">Explore all teams &rarr;</Link>
                    </Button>
                </div>
                {loaderData.teams.map((team) => (
                    <TeamCard
                    key={team.team_id}
                    id={team.team_id}
                    leaderUsername={team.team_leader.username}
                    leaderAvatarUrl={team.team_leader.avatar}
                    avatarFallback={team.team_leader.username.slice(0, 2).toUpperCase()}
                    roles={team.roles.split(",")}
                    description={team.product_description}
                />
            ))}
            </div>
        </div>
    );
}
