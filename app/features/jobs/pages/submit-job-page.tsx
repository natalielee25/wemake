import { PageHeader } from "~/common/components/page-header";
import type { Route } from "./+types/submit-job-page";
import { Form, redirect } from "react-router";
import InputPair from "~/common/components/ui/input-pair";
import { JOB_TYPES, LOCATION_TYPES, SALARY_RANGE } from "../constants";
import SelectPair from "~/common/components/select-pair";
import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { z } from "zod";
import { jobTypes } from "../schema";
import { createJob } from "../mutations";

export const meta: Route.MetaFunction = () => {
  return [
    {title: "Submit Job | Wemake"},
    {name: "description", content: "Reach out to the best developers in the world,"},
  ];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client);
};

export const formSchema = z.object({
  position: z.string().max(40),
  overview: z.string().max(400),
  responsibilities: z.string().max(400),
  qualifications: z.string().max(400),
  benefits: z.string().max(400),
  skills: z.string().max(400),
  companyName: z.string().max(40),
  companyLogoUrl: z.string().max(40),
  companyLocation: z.string().max(40),
  applyUrl: z.string().max(40),
  jobType: z.enum(JOB_TYPES.map((type) => type.value) as [string, ...string[]]),
  jobLocation: z.enum(
    LOCATION_TYPES.map((location) => location.value) as [string, ...string[]]
  ),
  salaryRange: z.enum(SALARY_RANGE),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { job_id } = await createJob(client, data);
  return redirect(`/jobs/${job_id}`);
};

export default function SubmitJobPage({ actionData }: Route.ComponentProps) {
  return (
    <div>
      <PageHeader title="Submit Job" 
      description="Reach out to the best developers in the world" />
      <Form
        className="max-w-screen-2xl flex flex-col items-center gap-10 mx-auto"
        method="post"
      >
        <div className="space-y-10">
          <InputPair
          	label="Position"
            description="(40 characters max)"
            name="position"
            maxLength={40}
            type="text"
            required
            defaultValue="Senior React Developer"
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.position}</p>
            )}
            <InputPair
            id="overview"
          	label="Overview"
            description="(400 characters max)"
            name="overview"
            maxLength={400}
            type="text"
            required
            defaultValue="We are looking for a Senior React Developer"
            textArea={true}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.overview}</p>
            )}
            <InputPair
            id="responsibilities"
          	label="Responsibilities"
            description="(400 characters max, comma separated)"
            name="responsibilities"
            maxLength={400}
            type="text"
            required
            defaultValue="Implement new features, Maintain code quality, etc."            
            textArea={true}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.responsibilities}</p>
            )}
            <InputPair
            id="qualifications"
          	label="Qualifications"
            description="(400 characters max, comma separated)"
            name="qualifications"
            maxLength={400}
            type="text"
            required
            defaultValue="3+ years of experience, Strong TypeScript skills, etc."            
            textArea={true}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.qualifications}</p>
            )}
            <InputPair
            id="benefits"
          	label="Benefits"
            description="(400 characters max, comma separated)"
            name="benefits"
            maxLength={400}
            type="text"
            required
            defaultValue="Flexible working hours, Health insurance, etc."            
            textArea={true}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.benefits}</p>
            )}
            <InputPair
            id="skills"
          	label="Skills"
            description="(400 characters max, comma separated)"
            name="skills"
            maxLength={400}
            type="text"
            required
            defaultValue="React, TypeScript, Next.js, etc."            
            textArea={true}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.skills}</p>
            )}
            <InputPair
            id="companyName"
          	label="Company Name"
            description="(40 characters max)"
            name="companyName"
            maxLength={40}
            type="text"
            required
            defaultValue="Meta"
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.companyName}</p>
            )}
            <InputPair
            id="companyLogoUrl"
          	label="Company Logo URL"
            description="(URL)"
            name="companyLogoUrl"
            type="url"
            required
            defaultValue="https://wemake.services/logo.png"
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">
              {actionData.fieldErrors.companyLogoUrl}
            </p>
            )}
            <InputPair
            id="companyLocation"
          	label="Company Location"
            description="(40 characters max)"
            name="companyLocation"
            maxLength={40}
            type="text"
            required
            defaultValue="Remote, New York, etc."
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.companyLocation}</p>
            )}
            <InputPair
            id="applyUrl"
          	label="Apply URL"
            description="(40 characters max)"
            name="applyUrl"
            type="url"
            required
            defaultValue="https://wemake.services/apply"
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.applyUrl}</p>
            )}
            <SelectPair
          	label="Job Type"
            description="Select the job type"
            name="jobType"
            required
            placeholder="Select a job type"
            options={JOB_TYPES.map((type) => ({
              label: type.label,
              value: type.value,
            }))}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.jobType}</p>
            )}
            <SelectPair
          	label="Job Location"
            description="Select the job location"
            name="jobLocation"
            required
            placeholder="Select a job location"
            options={LOCATION_TYPES.map((location) => ({
              label: location.label,
              value: location.value,
            }))}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.jobLocation}</p>
            )}
            <SelectPair
          	label="Salary Range"
            description="Select the job salary range"
            name="SalaryRange"
            required
            placeholder="Select a salary range"
            options={SALARY_RANGE.map((salaryRange) => ({
              label: salaryRange,
              value: salaryRange,
            }))}
            />
            {actionData && "fieldErrors" in actionData && (
            <p className="text-red-500">{actionData.fieldErrors.salaryRange}</p>
            )}
        </div>
        <Button type="submit" className="w-full max-w-sm mx-auto block mt-10" size="lg">Post job for $100</Button>
      </Form>
    </div>
  );
}

