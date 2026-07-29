import Image from "next/image";


export function PageLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
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
        <div className="flex items-center text-muted-foreground mt-2">
          <span className="text-sm font-medium">Loading<span className="animate-ellipsis">...</span></span>
        </div>
      </div>
    </div>
  );
}
