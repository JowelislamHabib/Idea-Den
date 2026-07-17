"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MotionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function FadeIn({ children, className, delay = 0 }: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SlideUp({ children, className, delay = 0 }: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  );
}

export function StaggerContainer({
  children,
  className,
}: Omit<MotionProps, "delay">) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

export function StaggerItem({
  children,
  className,
  delay = 0,
}: MotionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Float({ children, className }: Omit<MotionProps, "delay">) {
  return (
    <div
      className={cn(
        "animate-[float_6s_ease-in-out_infinite]",
        className
      )}
    >
      {children}
    </div>
  );
}
