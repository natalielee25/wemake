import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/common/components/ui/avatar";

interface TeamCardProps {
  id: number;
  leaderUsername: string;
  leaderAvatarUrl: string | null;
  avatarFallback: string;
  roles: string[];
  description: string;
}

export function TeamCard({
  id,
  leaderUsername,
  leaderAvatarUrl,
  avatarFallback, 
  roles,
  description,
}: TeamCardProps) {
  return (
    <Link to={`/teams/${id}`} className="block">
      <Card className="bg-transparent hover:bg-card/50 flex flex-col justify-between transition-colors h-full">
        <CardHeader className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="inline-flex shadow-sm items-center text-base gap-2">
              <span>@{leaderUsername}</span>
              <Avatar className="size-5">
                <AvatarFallback>{avatarFallback}</AvatarFallback>
                {leaderAvatarUrl ? <AvatarImage src={leaderAvatarUrl} /> : null}
              </Avatar>
            </Badge>
            <span className="text-sm text-muted-foreground">is looking for</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge key={role} className="text-base">
                {role}
              </Badge>
            ))}
          </div>
          <CardTitle className="text-base font-normal text-muted-foreground line-clamp-2">
            {description}
          </CardTitle>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="link">Join Team &rarr;</Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
