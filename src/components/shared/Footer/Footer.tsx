import Link from "next/link";
import { Heart } from "lucide-react";
import { NewsletterForm } from "./NewsletterForm";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const footerGroups = [
  {
    title: "Company",
    links: [
      { label: "About IdeaDen", href: "/about" },
      { label: "Contact IdeaDen", href: "/contact" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "IdeaDen Blueprint Engine", href: "/generate/ideas" },
      { label: "IdeaDen Blog Writer", href: "/generate/blogs" },
      { label: "Explore Ideas", href: "/explore/ideas" },
      { label: "Explore Blogs", href: "/explore/blogs" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

const socialLinks = [
  { label: "GitHub", icon: GithubIcon, href: "#" },
  { label: "X", icon: TwitterIcon, href: "#" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "#" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground text-sm font-black shadow-sm">
                ID
              </div>
              <span className="font-bold text-lg">IdeaDen</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              AI-powered project blueprints and blog articles. From idea to
              architecture, and thought to post, in seconds.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="flex size-9 items-center justify-center rounded-xl border border-border/50 bg-background/50 text-muted-foreground transition-all hover:shadow-sm hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary"
                    aria-label={link.label}
                  >
                    <Icon className="size-4" />
                  </Link>
                );
              })}
            </div>
          </div>

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-foreground/60 uppercase tracking-wider mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 py-12">
          <div className="max-w-xl">
            <h4 className="font-heading text-lg font-bold tracking-tight mb-1">
              Stay Inspired with IdeaDen
            </h4>
            <p className="text-sm text-muted-foreground mb-5">
              Product updates, creative tips, and new feature announcements
              from IdeaDen. No spam, ever.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-border/50 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} IdeaDen. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built with
            <Heart className="size-3 text-primary fill-primary" />
            for creators everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
