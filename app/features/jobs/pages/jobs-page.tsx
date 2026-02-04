import { PageHeader } from "~/common/components/page-header";
import { JobCard } from "~/features/jobs/components/job-card";
import type { Route } from "./+types/jobs-page";
import { Button } from "~/common/components/ui/button";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE} from "~/features/jobs/constants";
import { data, Link } from "react-router";
import { useSearchParams } from "react-router";
import { cn } from "~/lib/utils";
import { getJobs } from "~/features/jobs/queries";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";
import type { Database } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
    return [
  { title: "Jobs | Wemake" },
  { name: "description", content: "Find your next job opportunity" },
]};


const searchParamsSchema = z.object({
  type: z
    .enum(JOB_TYPES.map((type) => type.value) as [string, ...string[]])
    .optional(),
  location: z
    .enum(LOCATION_TYPES.map((type) => type.value) as [string, ...string[]])
    .optional(),
  salary: z.enum(SALARY_RANGE).optional(),
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
  const jobs = await getJobs(client, {
    limit: 40,
    location: parsedData.location as Database["public"]["Enums"]["location"] | undefined,
    type: parsedData.type as Database["public"]["Enums"]["job_type"] | undefined,
    salary: parsedData.salary as Database["public"]["Enums"]["salary_range"] | undefined,
  });
  return { jobs };
};

export default function JobsPage({ loaderData }: Route.ComponentProps) {
  const [serachParams, setSerachParams] = useSearchParams();
  const onFilterClick = (key: string, value: string) => {
    serachParams.set(key, value);
    setSerachParams(serachParams);
  };
  return (
    <div className="space-y-10">
      <PageHeader title="Jobs" description="Browse job opportunities" />
      <div className="grid grid-cols-1 xl:grid-cols-6  md:grid-cols-2 gap-20 items-start">
        <div className="grid grid-cols-1 xl:col-span-4 md:col-span-2 gap-5">
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
        <div className="col-span-2 flex flex-col gap-5 sticky top-20">
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Type</h4>
            <div className="flex flex-wrap gap-2"> {JOB_TYPES.map ((type) => (
              <Button variant={"outline"} onClick = {() => onFilterClick("type", type.value)}
              className={cn(type.value === serachParams.get("type") && "bg-accent text-foreground border-accent")}>
                {type.label}
              </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Location</h4>
            <div className="flex flex-wrap gap-2"> {LOCATION_TYPES.map ((type) => (
              <Button variant={"outline"} onClick = {() => onFilterClick("location", type.value)}
              className={cn(type.value === serachParams.get("location") && "bg-accent text-foreground border-accent")}>
                {type.label}
              </Button>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2.5">
            <h4 className="text-sm text-muted-foreground font-bold">Salary Range</h4>
            <div className="flex flex-wrap gap-2"> {SALARY_RANGE.map ((range) => (
              <Button variant={"outline"} onClick = {() => onFilterClick("salary", range)}
              className={cn(range === serachParams.get("salary") && "bg-accent text-foreground border-accent")}>
                {range}
              </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
