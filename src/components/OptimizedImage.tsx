import { useState, useRef, useEffect, useMemo, memo } from "react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/optimizeImageUrl";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}

const OptimizedImage = memo(({ src, alt, className, width, height, priority = false, sizes }: OptimizedImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(priority);
  const [useOriginalSrc, setUseOriginalSrc] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  const imageSrc = useMemo(() => {
    if (useOriginalSrc) return src;
    return getOptimizedImageUrl(src, { width, height, quality: 52, format: "webp" });
  }, [src, width, height, useOriginalSrc]);

  useEffect(() => {
    setUseOriginalSrc(false);
  }, [src]);

  useEffect(() => {
    setLoaded(false);
  }, [imageSrc]);

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
      { rootMargin: "120px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [priority]);

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
      {inView && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          // @ts-ignore - fetchpriority is valid HTML but not yet in React types
          fetchpriority={priority ? "high" : "low"}
          onLoad={() => setLoaded(true)}
          onError={() => {
            if (!useOriginalSrc) {
              setUseOriginalSrc(true);
              return;
            }
            setLoaded(true);
          }}
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
