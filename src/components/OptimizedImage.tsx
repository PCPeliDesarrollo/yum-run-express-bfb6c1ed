import { useState, useRef, useEffect, useMemo, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const STORAGE_OBJECT_PATH = "/storage/v1/object/public/";
const STORAGE_RENDER_PATH = "/storage/v1/render/image/public/";

const buildTransformedStorageImageUrl = (
  src: string,
  width?: number,
  height?: number,
  quality = 62,
) => {
  if (!src.includes(STORAGE_OBJECT_PATH)) return src;

  try {
    const url = new URL(src);
    const objectPathIndex = url.pathname.indexOf(STORAGE_OBJECT_PATH);

    if (objectPathIndex === -1) return src;

    const objectPath = url.pathname.slice(objectPathIndex + STORAGE_OBJECT_PATH.length);
    url.pathname = `${STORAGE_RENDER_PATH}${objectPath}`;

    if (width) url.searchParams.set("width", `${Math.max(1, Math.round(width))}`);
    if (height) url.searchParams.set("height", `${Math.max(1, Math.round(height))}`);

    url.searchParams.set("quality", `${quality}`);
    url.searchParams.set("format", "webp");

    return url.toString();
  } catch {
    return src;
  }
};

const OptimizedImage = memo(({ src, alt, className, width, height, priority = false, sizes }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLDivElement>(null);

  const optimizedSource = useMemo(() => {
    const baseWidth = width ?? 400;
    const baseHeight = height;
    const quality = priority ? 72 : 62;

    const src1x = buildTransformedStorageImageUrl(src, baseWidth, baseHeight, quality);
    const src2x = buildTransformedStorageImageUrl(
      src,
      baseWidth * 2,
      baseHeight ? baseHeight * 2 : undefined,
      quality,
    );

    const hasTransforms = src1x !== src || src2x !== src;

    return {
      src: src1x,
      srcSet: hasTransforms ? `${src1x} 1x, ${src2x} 2x` : undefined,
    };
  }, [src, width, height, priority]);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (priority) return;
    const el = imgRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "900px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
      {inView && (
        <img
          src={optimizedSource.src}
          srcSet={optimizedSource.srcSet}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setLoaded(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-200",
            loaded ? "opacity-100" : "opacity-0"
          )}
        />
      )}
    </div>
  );
});

OptimizedImage.displayName = "OptimizedImage";

export default OptimizedImage;
