import { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageProps {
  src?: string;
  alt?: string;
  className?: string;
  /** shown over the placeholder so the user knows to add a real photo */
  hint?: string;
}

/**
 * Loads a product photo; if missing (e.g. before the user drops files into
 * public/demo/), renders a neutral on-brand placeholder so screens still work.
 */
export function ProductImage({ src, alt, className, hint }: ProductImageProps) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate/60 bg-ink/40 text-muted/50",
          className,
        )}
      >
        <ImageOff className="h-7 w-7" />
        <span className="px-4 text-center text-[11px]">
          {hint ?? "Drop product photo in public/demo/"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
