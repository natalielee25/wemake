import { Form } from "react-router";
import { PageHeader } from "~/common/components/page-header";
import { Avatar, AvatarImage, AvatarFallback } from "~/common/components/ui/avatar";
import { Badge } from "~/common/components/ui/badge";
import { Button } from "~/common/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "~/common/components/ui/card";
import InputPair from "~/common/components/ui/input-pair";
import { getTeamById } from "../queries";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => [{ title: "Team | wemake" }];

export const loader = async ({ request, params }: Route.LoaderArgs) => {
    const { client, headers } = makeSSRClient(request);
    const team = await getTeamById(client, { teamId: params.teamId });
    return { team };
  };
  
  export default function TeamPage({ loaderData }: Route.ComponentProps) {
    return (
        <div className="space-y-20">
           <PageHeader
           title={`Join ${loaderData.team.team_leader.name}'s team`}
           />
           <div className="grid grid-cols-6 gap-40 items-start">
            <div className="col-span-4 grid grid-cols-4 gap-5">
                {[
                    {
                        title: "Product Name",
                        value: loaderData.team.product_name,
                    },
                    {
                        title: "Stage",
                        value: loaderData.team.product_stage,
                    },
                    {
                        title: "Team Size",
                        value: loaderData.team.team_size,
                    },
                    {
                        title: "AvailableEquity",
                        value: loaderData.team.available_equity,
                    },

                ].map(item => <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">{item.title}</CardTitle>
                        <CardContent className="p-0 font-bold capitalize text-2xl">
                            <p>
                                {item.value}
                            </p>
                        </CardContent>
                    </CardHeader>
                </Card>
            )}
            	<Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Looking for
                        </CardTitle>
                        <CardContent className="p-0 font-bold text-2xl">
                        <ul className="text-lg list-disc list-inside">
                            {loaderData.team.looking_for.split(",").map((item) => <li key={item} >
                                {item}
                                </li>)}
                        </ul>
                        </CardContent>
                    </CardHeader>
                </Card>
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                        Idea description
                        </CardTitle>
                        <CardContent className="p-0 font-medium text-xl">
                        	<p>{loaderData.team.product_description}</p>
                        </CardContent>
                    </CardHeader>
                </Card>
            </div>
            <aside className="col-span-2 border rounded-lg shadow-sm p-6 space-y-5">
                <div className="flex gap-5">
                    <Avatar className="size-14 shrink-0">
                        <AvatarFallback>
                            {loaderData.team.team_leader.name[0]}
                        </AvatarFallback>
                        {loaderData.team.team_leader.avatar ? (
                            <AvatarImage src={loaderData.team.team_leader.avatar} />
                        ) : null}
                    </Avatar>
                    <div className="flex flex-col items-start">
                    <h4 className="text-lg font-medium">
                        {loaderData.team.team_leader.name}
                    </h4>
                    <Badge variant="secondary" className="capitalize">
                        {loaderData.team.team_leader.role}
                    </Badge>
                    </div>
                </div>
                <Form
                    className="space-y-5"
                    method="post"
                    action={`/users/${loaderData.team.team_leader.username}/messages`}
                >
                    <InputPair
                    label="Introduce yourself"
                    description="Introduce yourself to the team"
                    name="introduction"
                    type="text"
                    id="content"
                    required
                    textArea
                    placeholder="I am a cutie sexy pie!"
                    />
                    <InputPair
                    label="Why do you want to join the team?"
                    description="(500 characters max)"
                    name="why"
                    type="text"
                    id="why"
                    required
                    placeholder="I will save your ass"
                    />     
                </Form>
                <Button variant="outline" className="w-full">Get in touch</Button>
            </aside>
           </div>
        </div>
    );
}