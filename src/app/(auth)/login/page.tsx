"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { Eye, EyeOff, Zap } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/motion-wrapper";

function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address";
  return null;
}

function validatePassword(password: string): string | null {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  return null;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const emailErr = validateEmail(email.trim());
    const passwordErr = validatePassword(password);
    setFieldErrors({
      email: emailErr ?? undefined,
      password: passwordErr ?? undefined,
    });
    return !emailErr && !passwordErr;
  };

  const [error, submitAction, isPending] = useActionState(
    async (_prevState: string | null, _formData: FormData) => {
      if (!validate()) return null;

      const { error: signInError } = await signIn.email({
        email: email.trim(),
        password,
      });

      if (signInError) {
        return signInError.message || "Invalid credentials";
      }

      toast.success("Logged in successfully");
      window.location.href = callbackUrl;
      return null;
    },
    null,
  );

  const handleGoogle = async () => {
    await signIn.social({ provider: "google" });
  };

  const handleDemo = async () => {
    setEmail("demo@user.com");
    setPassword("Demow0rd!");
    const { error: signInError } = await signIn.email({
      email: "demo@user.com",
      password: "Demow0rd!",
    });

    if (signInError) {
      toast.error("Demo login failed. Try registering first.");
      return;
    }

    toast.success("Logged in with demo account");
    window.location.href = callbackUrl;
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="space-y-1 text-center mb-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Log in to IdeaDen
            </CardTitle>
            <CardDescription>
              Enter your email below to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              action={submitAction}
              className="flex flex-col gap-4"
              noValidate
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email)
                      setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.email}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password)
                        setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    aria-invalid={!!fieldErrors.password}
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-destructive">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-2"
              >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={handleDemo}
                disabled={isPending}
                className="w-full"
              >
                <Zap className="size-4 mr-2" />
                Try Demo Account
              </Button>

              <div className="relative flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground uppercase">
                  or
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleGoogle}
                className="w-full"
              >
                <svg role="img" viewBox="0 0 24 24" className="size-4 mr-2">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href={`/register${callbackUrl !== "/" ? `?redirect=${encodeURIComponent(callbackUrl)}` : ""}`}
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </FadeIn>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
