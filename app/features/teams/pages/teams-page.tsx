import type { Route } from "./+types/teams-page";
import { PageHeader } from "~/common/components/page-header";
import { TeamCard } from "../components/team-card";
import { getTeams } from "../queries";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => [{ title: "Teams | wemake" }];

export const loader = async ({ request }: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
    const teams = await getTeams(client, { limit: 8 });
    return { teams };
  };
  
  export default function TeamsPage({ loaderData }: Route.ComponentProps) {
    return (<div className="space-y-20">
        <PageHeader 
        title="Teams" 
        description="Find your next team or project collaborators" />
        <div className="grid grid-cols-4 gap-4">
            {loaderData.teams.map((team) => (
                <TeamCard
                key={team.team_id}
                id={team.team_id}
                leaderUsername={team.team_leader.username}
                leaderAvatarUrl={team.team_leader.avatar}
                roles={team.roles.split(",")}
                description={team.product_description}
              />
            ))}
          </div>
        </div>
      );
    }
