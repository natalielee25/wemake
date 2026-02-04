import { Link } from "react-router";
import { Button } from "~/common/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";
import { Badge } from "~/common/components/ui/badge";
import { DateTime } from "luxon";

interface JobCardProps {
  id: number;
  company: string;
  companyLogoUrl: string;
  companyLocation: string;
  timeAgo: string;
  title: string;
  badges?: string[];
  jobType: string;
  salaryRange: string;
  positionLocation: string;
}

export function JobCard({
  id,
  company,
  companyLogoUrl,
  companyLocation,
  timeAgo,
  title,
  badges,
  jobType,
  salaryRange,
  positionLocation,
}: JobCardProps) {
  return (
    <Link to={`/jobs/${id}`}>
      <Card className="bg-transparent transition-colors hover:bg-card/50">
        <CardHeader>
          <div className="flex items-center gap-4 mb-4">
            <img
              src={companyLogoUrl}
              alt={`${company} Logo`}
              className="size-10 rounded-full"
            />
            <div className="space-x-2">
              <span className="text-accent-foreground">{company}</span>
              <span className="text-xs text-muted-foreground">
                {DateTime.fromISO(timeAgo).toRelative()}</span>
            </div>
          </div>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Badge variant="outline" className="capitalize">
            {jobType}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {positionLocation}
          </Badge>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-muted-foreground">
              {salaryRange}
            </span>
              <span className="text-sm font-medium text-muted-foreground">
                {companyLocation}
              </span>
          </div>
          <Button variant="secondary" size="sm">
            Apply Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}