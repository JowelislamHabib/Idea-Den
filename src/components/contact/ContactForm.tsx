"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Send, Loader2 } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    else if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";

    if (!subject.trim()) newErrors.subject = "Subject is required";

    if (!message.trim()) newErrors.message = "Message is required";
    else if (message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast.success("Message sent! We'll get back to you soon.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="font-semibold">
                Name
              </Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: "" }));
                }}
                aria-invalid={!!errors.name}
                className="h-11"
              />
              {errors.name && (
                <p className="text-xs font-medium text-destructive">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-semibold">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((p) => ({ ...p, email: "" }));
                }}
                aria-invalid={!!errors.email}
                className="h-11"
              />
              {errors.email && (
                <p className="text-xs font-medium text-destructive">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="subject" className="font-semibold">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="What's this about?"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors((p) => ({ ...p, subject: "" }));
              }}
              aria-invalid={!!errors.subject}
              className="h-11"
            />
            {errors.subject && (
              <p className="text-xs font-medium text-destructive">
                {errors.subject}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="message" className="font-semibold">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us what's on your mind..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((p) => ({ ...p, message: "" }));
              }}
              aria-invalid={!!errors.message}
              rows={5}
              className="resize-none"
            />
            {errors.message && (
              <p className="text-xs font-medium text-destructive">
                {errors.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-12 font-bold"
            size="lg"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-5 animate-spin" />
            ) : (
              <Send className="mr-2 size-5" />
            )}
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
