import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignupForm } from "@/components/auth/SignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Create Account" };

export default function SignupPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <div className="flex items-center justify-start mb-1">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </div>
        <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
        <CardDescription>Join the Fork&apos;d cooking community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground border-t pt-3">
          Signed up with Apple?{" "}
          <Link
            href="/forgot-password"
            className="text-primary font-medium hover:underline"
          >
            Use Forgot Password
          </Link>{" "}
          to set a web password.
        </p>
      </CardContent>
    </Card>
  );
}
