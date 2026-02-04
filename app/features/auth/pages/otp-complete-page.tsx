import type { Route } from "./+types/otp-complete-page";
import { Button } from "~/common/components/ui/button";
import { Link } from "react-router";
import { Form } from "react-router";
import InputPair from "~/common/components/ui/input-pair";

export const meta: Route.MetaFunction = () => {
  return [
    { title: "Verify OTP | Wemake" }
  ];
};

export default function OtpCompletePage() {
  return (
    <div className="flex flex-col relative items-center justify-center h-full">
    <div className="flex items-center justify-center gap-10 w-full max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Confirm OTP</h1>
        <p className="text-sm text-muted-foreground">
          Enter the 4-digit code sent to your email to confirm your login
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
        <InputPair
          label="OTP"
          description="Enter the 4-digit code sent to your email"
          name="otp"
          required
          type="number"
          placeholder="otp"
          id="otp"
        />
        <Button type="submit" className="w-full">Login</Button>
      </Form>
    </div>
  </div>
  );
}
