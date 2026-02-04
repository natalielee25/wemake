import type { Route } from "./+types/otp-start-page";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";
import { Form } from "react-router";
import InputPair from "~/common/components/ui/input-pair";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "OTP Start | Wemake" },
    { name: "description", content: "Start OTP authentication" },
  ];
};

export default function OtpStartPage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
      <div className="flex items-center justify-center gap-10 w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">OTP Login</h1>
          <p className="text-sm text-muted-foreground">
            4-digit code will be sent to your email to login to your account
          </p>
        </div>
        <Form className="w-full space-y-4">
          <InputPair
            label="Email"
            description="Enter your email"
            name="email"
            required
            type="email"
            placeholder="email"
            id="email"
          />
          <Button type="submit" className="w-full">Send OTP</Button>
        </Form>
      </div>
    </div>
  );
}
