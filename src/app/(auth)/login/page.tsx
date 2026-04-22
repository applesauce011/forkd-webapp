import { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>Sign in to your Fork&apos;d account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Sign up
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground border-t pt-3">
          Signed up with Apple?{" "}
          <Link href="/forgot-password" className="text-primary hover:underline">
            Set a password here
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
