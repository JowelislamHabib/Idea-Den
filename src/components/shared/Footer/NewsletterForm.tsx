"use client";

export function NewsletterForm() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="flex gap-3"
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 h-11 rounded-xl border border-border/50 bg-background/50 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-bold transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Subscribe
      </button>
    </form>
  );
}
