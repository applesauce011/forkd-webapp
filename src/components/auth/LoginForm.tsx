"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logIn, initiateAppleSignIn } from "@/actions/auth";

const REMEMBER_EMAIL_KEY = "forkd_remember_email";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  async function handleAppleSignIn() {
    setAppleLoading(true);
    const result = await initiateAppleSignIn();
    if ("error" in result || !result.url) {
      toast.error("Could not sign in with Apple. Please try again.");
      setAppleLoading(false);
      return;
    }
    window.location.href = result.url;
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const savedEmail = localStorage.getItem(REMEMBER_EMAIL_KEY);
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  async function onSubmit(data: FormValues) {
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
    }

    const result = await logIn(data);
    if (result?.error) {
      toast.error(result.error === "Invalid login credentials"
        ? "Incorrect email or password. Try again."
        : result.error
      );
      setLoading(false);
      return;
    }
    // Refresh server components so the new session cookie is picked up, then navigate
    router.refresh();
    router.push("/feed");
  }

  return (
    <div className="space-y-4">
      <Button
        type="button"
        onClick={handleAppleSignIn}
        disabled={appleLoading || loading}
        className="w-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
      >
        {appleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <span className="mr-2 text-base leading-none"></span>
        )}
        Sign in with Apple
      </Button>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or continue with email</span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked === true)}
          />
          <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
            Remember me
          </Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading || appleLoading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
}
