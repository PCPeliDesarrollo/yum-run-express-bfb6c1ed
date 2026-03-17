interface OptimizeImageUrlOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: "webp" | "origin";
}

const STORAGE_OBJECT_SEGMENT = "/storage/v1/object/public/";
const STORAGE_RENDER_SEGMENT = "/storage/v1/render/image/public/";

/**
 * Converts public storage URLs to transformed image URLs for faster loading.
 * Falls back to original URL for non-storage images.
 */
export const getOptimizedImageUrl = (
  src: string,
  { width, height, quality = 70, format = "webp" }: OptimizeImageUrlOptions = {}
): string => {
  if (!src || !src.includes(STORAGE_OBJECT_SEGMENT)) return src;

  const transformedBaseUrl = src.replace(STORAGE_OBJECT_SEGMENT, STORAGE_RENDER_SEGMENT);
  const [baseWithoutQuery] = transformedBaseUrl.split("?");

  const params = new URLSearchParams();
  if (width) params.set("width", String(Math.round(width)));
  if (height) params.set("height", String(Math.round(height)));
  params.set("quality", String(quality));
  if (format !== "origin") params.set("format", format);

  return `${baseWithoutQuery}?${params.toString()}`;
};
