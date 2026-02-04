import type { Route } from "./+types/submit-post-page";
import { PageHeader } from "~/common/components/page-header";
import { Form, redirect } from "react-router";
import InputPair from "~/common/components/ui/input-pair";
import SelectPair from "~/common/components/select-pair";
import { Button } from "~/common/components/ui/button";
import { makeSSRClient } from "~/supa-client";
import { getLoggedInUserId } from "~/features/users/queries";
import { getTopics } from "../queries";
import { z } from "zod";
import { createPost } from "../mutations";

export const meta: Route.MetaFunction = () => {
  return [{ title: "Submit Post | wemake" }];
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const { client } = makeSSRClient(request);
  await getLoggedInUserId(client);
  const topics = await getTopics(client);
  return { topics };
};

const formSchema = z.object({
  title: z.string().min(1).max(40),
  category: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const { client } = makeSSRClient(request);
  const userId = await getLoggedInUserId(client);
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      fieldErrors: error.flatten().fieldErrors,
    };
  }
  const { title, category, content } = data;
  const { post_id } = await createPost(client, {
    title,
    category,
    content,
    userId,
  });
  return redirect(`/community/${post_id}`);
};

export default function SubmitPostPage({
  loaderData,
  actionData,
}: Route.ComponentProps) {
  return <div className="space-y-10">
    <PageHeader
    title="Create Discussion"
    description="Ask questions, share ideas, and connect with other developers"
    />
    <Form
        className="flex flex-col gap-10 max-w-screen-md mx-auto"
        method="post"
      >
      <InputPair 
      label="Title" 
      name="title" 
      id="title" 
      description="(max 40 characters)" 
      required
      placeholder="e.g. What is the best productivity tool?"/>
      {actionData && "fieldErrors" in actionData && (
        <div className="text-red-500">
          {actionData.fieldErrors.title?.join(", ")}
        </div>
      )}
      <SelectPair
      required
      name="category"
      label="Category"
      description="Select a category for your discussion"
      options={loaderData.topics.map((topic) => ({
        label: topic.name,
        value: topic.slug,
      }))}
      />
      {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.category?.join(", ")}
          </div>
      )}
      <InputPair 
      label="Content" 
      name="content" 
      id="content" 
      description="(max 1000 characters)" 
      required
      placeholder="e.g. I'm looking for a tool that can help me manage my time and improve my productivity."
      textArea
      />
      {actionData && "fieldErrors" in actionData && (
          <div className="text-red-500">
            {actionData.fieldErrors.content?.join(", ")}
          </div>
      )}
      <Button type="submit">Create Discussion</Button>
    </Form>
  </div>;
}

