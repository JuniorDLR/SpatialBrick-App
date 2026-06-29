import Image from "next/image";
import {
  isDataUriImage,
  isExternalImageUrl,
  resolveBfaImageUrl,
} from "@/lib/bfaImageUtils";
import { cn } from "@/lib/cn";

type BfaImageProps = {
  src: string | null | undefined;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
};

export function BfaImage({
  src,
  alt,
  width = 640,
  height = 400,
  className,
  priority = false,
  fill = false,
  sizes,
}: BfaImageProps) {
  const resolvedSrc = resolveBfaImageUrl(src);

  if (!resolvedSrc) {
    return null;
  }

  const unoptimized =
    isDataUriImage(resolvedSrc) || isExternalImageUrl(resolvedSrc);

  if (fill) {
    return (
      <Image
        src={resolvedSrc}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        unoptimized={unoptimized}
        className={cn("object-contain", className)}
      />
    );
  }

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
      className={cn("h-auto w-full object-contain", className)}
    />
  );
}
