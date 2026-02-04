import InputPair from "~/common/components/ui/input-pair";
import type { Route } from "./+types/join-page";
import { Form, Link, redirect, useNavigation } from "react-router";
import { Button } from "~/common/components/ui/button";
import AuthButtons from "../components/auth-buttons";
import { makeSSRClient } from "~/supa-client";
import { z } from "zod";
import { checkUsernameExists } from "../queries";
import { LoaderCircle } from "lucide-react";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Join | Wemake" },
    { name: "description", content: "Create a new account" },
  ];
};

const formSchema = z.object({
  name: z.string().min(3),
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, error, data } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      formErrors: error.flatten().fieldErrors,
    };
  }
  const usernameExists = await checkUsernameExists(request, {
    username: data.username,
  });
  if (usernameExists) {
    return {
      formErrors: { username: ["Username already exists"] },
    };
  }
  const { client, headers } = makeSSRClient(request);
  const { error: signUpError } = await client.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
        username: data.username,
      },
    },
  });
  if (signUpError) {
    return {
      signUpError: signUpError.message,
    };
  }
  return redirect("/", { headers });
};

export default function JoinPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant={"ghost"} asChild className="absolute top-4 right-4">
        <Link to="/auth/login">Login</Link>
      </Button>
      <div className="flex flex-col items-center justify-center gap-10 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Create an account</h1>
        <Form className="w-full space-y-4" method="post">
          <InputPair
            label="Name"
            description="Enter your name"
            name="name"
            required
            type="text"
            placeholder="name"
            id="name"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.name}</p>
          )}
          <InputPair
            label="Username"
            description="Enter your username"
            name="username"
            required
            type="text"
            placeholder="username"
            id="username"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.username}</p>
          )}
          <InputPair
            label="Email"
            description="Enter your email"
            name="email"
            required
            type="email"
            placeholder="email"
            id="email"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.email}</p>
          )}
          <InputPair
            label="Password"
            description="Enter your password"
            name="password"
            required
            type="password"
            placeholder="password"
            id="password"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-red-500">{actionData?.formErrors?.password}</p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Create account"
            )}
          </Button>
          {actionData && "signUpError" in actionData && (
            <p className="text-red-500">{actionData.signUpError}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div>
  );
}
