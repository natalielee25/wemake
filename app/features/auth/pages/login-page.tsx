import type { Route } from "./+types/login-page";
import { Button } from "~/common/components/ui/button";
import { Form, Link, redirect, useNavigation } from "react-router";
import InputPair from "~/common/components/ui/input-pair";
import AuthButtons from "../components/auth-buttons";
import { LoaderCircle } from "lucide-react";
import { z } from "zod";
import { makeSSRClient } from "~/supa-client";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Login | Wemake" },
    { name: "description", content: "Login to your account" },
  ];
};

const formSchema = z.object({
  email: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return "Email is required";
        return "Email should be a string";
      },
    })
    .email("Invalid email address"),
  password: z
    .string({
      error: (issue) => {
        if (issue.input === undefined) return "Password is required";
        return "Password should be a string";
      },
    })
    .min(8, {
      message: "Password must be at least 8 characters",
    }),
});

export const action = async ({ request }: Route.ActionArgs) => {
  const formData = await request.formData();
  const { success, data, error } = formSchema.safeParse(
    Object.fromEntries(formData)
  );
  if (!success) {
    return {
      loginError: null,
      formErrors: error.flatten().fieldErrors,
    };
  }
  const { email, password } = data;
  const { client, headers } = makeSSRClient(request);
  const { error: loginError } = await client.auth.signInWithPassword({
    email,
    password,
  });
  if (loginError) {
    return {
      formErrors: null,
      loginError: loginError.message,
    };
  }
  return redirect("/", { headers });
};

export default function LoginPage({ actionData }: Route.ComponentProps) {
  const navigation = useNavigation();
  const isSubmitting =
    navigation.state === "submitting" || navigation.state === "loading";
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <Button variant={"ghost"} asChild className="absolute top-4 right-4">
        <Link to="/auth/join">Join</Link>
      </Button>
      <div className="flex flex-col items-center justify-center gap-10 w-full max-w-md">
        <h1 className="text-2xl font-semibold">Login to your account</h1>
        <Form className="w-full space-y-4" method="post">
          <InputPair
            label="Email"
            description="Enter your email address"
            name="email"
            required
            type="email"
            placeholder="email"
            id="email"
          />
          {actionData && "formErrors" in actionData && (
            <p className="text-sm text-red-500">
              {actionData?.formErrors?.email?.join(", ")}
            </p>
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
            <p className="text-sm text-red-500">
              {actionData?.formErrors?.password?.join(", ")}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Log in"
            )}
          </Button>
          {actionData && "loginError" in actionData && (
            <p className="text-sm text-red-500">{actionData.loginError}</p>
          )}
        </Form>
        <AuthButtons />
      </div>
    </div> 

  );
}
