"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidImageUrl, uploadImage } from "@/lib/api/uploadImage";
import { signIn, signUp } from "@/lib/auth-client";
import { Camera, Check, Eye, EyeOff, ImageIcon, Link2, X, Shield, Globe, BellRing } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useState } from "react";
import { toast } from "sonner";
import { SlideUp } from "@/components/ui/motion-wrapper";

type PasswordRule = {
  key: string;
  label: string;
  test: (v: string) => boolean;
};

const PASSWORD_RULES: PasswordRule[] = [
  { key: "min", label: "At least 6 characters", test: (v) => v.length >= 6 },
  { key: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { key: "number", label: "One number", test: (v) => /\d/.test(v) },
  { key: "special", label: "One special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
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
    async (prevState: string | null, formData: FormData) => {
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
      router.push(callbackUrl);
      return null;
    },
    null
  );

  const handleGoogle = async () => {
    await signIn.social({ provider: "google" });
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-8 bg-muted/20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SlideUp delay={0.1} className="w-full bg-background rounded-[var(--radius)] md:rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-border/50">
          
          {/* Left Panel: Emotional Value Prop */}
          <div className="w-full md:w-3/5 bg-primary p-8 md:p-12 lg:p-14 text-primary-foreground flex flex-col justify-between relative overflow-hidden">
            {/* Subtle Background Elements */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <Link href="/" className="inline-block mb-12">
                <Image 
                  src="/areaalert-logo.png" 
                  alt="AreaAlert Logo" 
                  width={150} 
                  height={40} 
                  className="h-7 w-auto brightness-0 invert" 
                />
              </Link>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-5 tracking-tight">Join the movement.</h1>
              <p className="text-primary-foreground/90 leading-relaxed mb-10 text-lg">
                Become a crucial part of your community. Register now to share real-time updates and help keep others safe.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/15 p-2.5 rounded-xl shrink-0">
                    <Shield className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]">Help Protect Others</h3>
                    <p className="text-sm text-primary-foreground/80 mt-1 leading-relaxed">Your reports can prevent accidents and save time for thousands.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/15 p-2.5 rounded-xl shrink-0">
                    <Globe className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]">Connect Locally</h3>
                    <p className="text-sm text-primary-foreground/80 mt-1 leading-relaxed">Build a stronger, more informed neighborhood network.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary-foreground/15 p-2.5 rounded-xl shrink-0">
                    <BellRing className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[15px]">Stay Notified</h3>
                    <p className="text-sm text-primary-foreground/80 mt-1 leading-relaxed">Be the first to know when critical issues arise near you.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 mt-12 pt-8 border-t border-primary-foreground/20 hidden md:block">
              <p className="text-sm font-medium text-primary-foreground/80 italic">
                "I reported a fallen tree, and within minutes my neighbors adjusted their routes. It feels great to help!"
              </p>
            </div>
          </div>

          {/* Right Panel: Register Form */}
          <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-background">
            <div className="max-w-sm w-full mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h2>
                <p className="text-sm text-muted-foreground mt-2">
                  Enter your details to get started.
                </p>
              </div>

              <form action={submitAction} className="flex flex-col gap-5" noValidate>
                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="name" className="font-semibold text-foreground/80">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                    }}
                    aria-invalid={!!fieldErrors.name}
                    required
                    className="h-11"
                  />
                  {fieldErrors.name && (
                    <p className="text-xs font-medium text-destructive">{fieldErrors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="email" className="font-semibold text-foreground/80">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                    }}
                    aria-invalid={!!fieldErrors.email}
                    required
                    className="h-11"
                  />
                  {fieldErrors.email && (
                    <p className="text-xs font-medium text-destructive">{fieldErrors.email}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2.5">
                  <Label htmlFor="password" className="font-semibold text-foreground/80">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {password && (
                    <ul className="flex flex-col gap-1.5 mt-1.5">
                      {passwordRules.map((rule) => (
                        <li
                          key={rule.key}
                          className={`flex items-center gap-2 text-xs font-medium transition-colors ${
                            rule.met ? "text-emerald-600 dark:text-emerald-500" : "text-muted-foreground"
                          }`}
                        >
                          {rule.met ? <Check size={14} /> : <X size={14} />}
                          {rule.label}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Image Upload */}
                <div className="flex flex-col gap-2.5">
                  <Label className="font-semibold text-foreground/80">Profile Image (optional)</Label>
                  
                  <div className="flex items-center gap-2 rounded-lg border p-1 bg-muted/30">
                    <button
                      type="button"
                      onClick={() => { setImageMode("url"); clearImage(); }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                        imageMode === "url" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Link2 size={14} />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => { setImageMode("file"); clearImage(); }}
                      className={`flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                        imageMode === "file" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Camera size={14} />
                      Upload
                    </button>
                  </div>

                  {imageMode === "url" ? (
                    <div className="relative">
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
                        className="h-11"
                      />
                      {urlError && (
                        <p className="mt-1.5 text-xs font-medium text-destructive">{urlError}</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:bg-muted/10 hover:text-foreground">
                        <ImageIcon size={18} />
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
                          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          <X size={14} />
                          Remove
                        </button>
                      )}
                    </div>
                  )}

                  {preview && (
                    <div className="relative mt-2 aspect-square w-20 overflow-hidden rounded-full border shadow-sm mx-auto">
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
                  <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
                    {submitError}
                  </div>
                )}

                <Button type="submit" disabled={submitting || !passwordValid} className="h-11 w-full font-bold mt-2">
                  {submitting ? "Creating account..." : "Register"}
                </Button>

                <div className="relative flex items-center gap-4 my-2">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Or</span>
                  <span className="h-px flex-1 bg-border" />
                </div>

                <Button type="button" variant="outline" onClick={handleGoogle} className="h-11 w-full font-semibold">
                  <svg role="img" viewBox="0 0 24 24" className="mr-2 h-5 w-5"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{" "}
                  <Link 
                    href={`/login${callbackUrl !== "/" ? `?redirect=${encodeURIComponent(callbackUrl)}` : ""}`} 
                    className="font-bold text-primary hover:underline underline-offset-4"
                  >
                    Log in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </SlideUp>
      </div>
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
