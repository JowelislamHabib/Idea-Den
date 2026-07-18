import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center justify-center animate-in fade-in duration-700">
        <div className="relative flex items-center justify-center mb-6">
          <Image
            src="/ideaden-favicon.png"
            alt="IdeaDen Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          <span className="text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
