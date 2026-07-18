"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { isValidImageUrl, uploadImage } from "@/lib/api/uploadImage";
import { signIn, signUp } from "@/lib/auth-client";
import { Camera, Check, Eye, EyeOff, ImageIcon, Link2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "@/components/ui/motion-wrapper";

type PasswordRule = {
  key: string;
  label: string;
  test: (v: string) => boolean;
};

const PASSWORD_RULES: PasswordRule[] = [
  { key: "min", label: "6+ characters", test: (v) => v.length >= 6 },
  { key: "upper", label: "1 uppercase", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "1 number", test: (v) => /\d/.test(v) },
  { key: "special", label: "1 special", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address";
  return null;
}

function validateName(name: string): string | null {
  if (!name.trim()) return "Name is required";
  if (name.trim().length < 2) return "Name must be at least 2 characters";
  return null;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("redirect") || "/";
  
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [urlError, setUrlError] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});

  const passwordRules = PASSWORD_RULES.map((rule) => ({
    ...rule,
    met: password ? rule.test(password) : false,
  }));
  const passwordValid = passwordRules.every((r) => r.met);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageUrl("");
    setImageFile(null);
    setPreview("");
    setUrlError("");
  };

  const [submitError, submitAction, submitting] = useActionState(
    async (_prevState: string | null, _formData: FormData) => {
      const nameErr = validateName(name.trim());
      const emailErr = validateEmail(email.trim());
      setFieldErrors({ name: nameErr ?? undefined, email: emailErr ?? undefined });

      if (nameErr || emailErr || !passwordValid) return null;

      const trimmedImageUrl = imageUrl.trim();

      if (imageMode === "url" && trimmedImageUrl && !isValidImageUrl(trimmedImageUrl)) {
        setUrlError("URL must end with an image extension (png, jpg, jpeg, gif, webp, svg)");
        return null;
      }

      let finalImageUrl = trimmedImageUrl;

      if (imageMode === "file" && imageFile) {
        try {
          finalImageUrl = await uploadImage(imageFile);
        } catch {
          return "Image upload failed. Please try again.";
        }
      }

      const { error } = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: finalImageUrl || undefined,
      });

      if (error) {
        return error.message || "Registration failed";
      }

      toast.success("Account created successfully");
      window.location.href = callbackUrl;
      return null;
    },
    null
  );

  const handleGoogle = async () => {
    await signIn.social({ provider: "google" });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-lg">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="space-y-1 text-center mb-2">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitAction} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.name}
                  required
                />
                {fieldErrors.name && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  aria-invalid={!!fieldErrors.email}
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.email}</p>
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
                    onChange={(e) => setPassword(e.target.value)}
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
                {password && (
                  <div className="flex flex-col gap-1 mt-1">
                    {passwordRules.map((rule) => (
                      <span
                        key={rule.key}
                        className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
                          rule.met 
                            ? "text-emerald-600 dark:text-emerald-500" 
                            : "text-muted-foreground"
                        }`}
                      >
                        {rule.met ? <Check size={12} /> : <X size={12} />}
                        {rule.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label>Profile Image <span className="text-muted-foreground font-normal">(optional)</span></Label>
                
                <div className="flex items-center gap-1 rounded-md border p-1 bg-muted/30">
                  <button
                    type="button"
                    onClick={() => { setImageMode("url"); clearImage(); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
                      imageMode === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Link2 size={12} />
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => { setImageMode("file"); clearImage(); }}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm px-3 py-1.5 text-xs font-medium transition-all ${
                      imageMode === "file" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Camera size={12} />
                    Upload
                  </button>
                </div>

                {imageMode === "url" ? (
                  <div className="relative mt-1">
                    <Input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={imageUrl}
                      onChange={(e) => {
                        setImageUrl(e.target.value);
                        setUrlError("");
                        if (e.target.value && isValidImageUrl(e.target.value)) {
                          setPreview(e.target.value);
                        } else {
                          setPreview("");
                        }
                      }}
                    />
                    {urlError && (
                      <p className="mt-1 text-xs font-medium text-destructive">{urlError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-1">
                    <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/10 hover:text-foreground">
                      <ImageIcon size={16} />
                      {imageFile ? imageFile.name : "Choose file"}
                      <input
                        type="file"
                        accept="image/png,image/jpg,image/jpeg,image/gif,image/webp,image/svg+xml"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={clearImage}
                        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={12} />
                        Remove
                      </button>
                    )}
                  </div>
                )}

                {preview && (
                  <div className="relative mt-2 size-16 overflow-hidden rounded-full border shadow-sm mx-auto">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {submitError && (
                <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                  {submitError}
                </div>
              )}

              <Button type="submit" disabled={submitting || !passwordValid} className="w-full mt-2">
                {submitting ? "Creating account..." : "Sign up"}
              </Button>

              <div className="relative flex items-center gap-3 my-2">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground uppercase">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button type="button" variant="outline" onClick={handleGoogle} className="w-full">
                <svg role="img" viewBox="0 0 24 24" className="size-4 mr-2">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-border/50 pt-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href={`/login${callbackUrl !== "/" ? `?redirect=${encodeURIComponent(callbackUrl)}` : ""}`}
                className="font-medium text-foreground hover:underline underline-offset-4"
              >
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </FadeIn>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
