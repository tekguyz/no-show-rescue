import { PINEWHISTLE_MARK_SVG, PRODUCT_MARK_SVG } from "@/lib/brand";
import { business } from "@/lib/demo/business";
import { siteName } from "@/lib/site";

// The marks are one SVG source each (lib/brand.ts), drawn inline here.
function Mark({ svg, className }: { svg: string; className: string }) {
  return <span aria-hidden className={`inline-block shrink-0 [&>svg]:h-full [&>svg]:w-full ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />;
}

export function ProductLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-title ${className}`}>
      <Mark svg={PRODUCT_MARK_SVG} className="size-8" />
      {siteName}
    </span>
  );
}

export function PracticeLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 font-display text-title ${className}`}>
      <Mark svg={PINEWHISTLE_MARK_SVG} className="size-8" />
      {business.name}
    </span>
  );
}
