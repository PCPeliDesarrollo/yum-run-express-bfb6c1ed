/**
 * Image URL utility.
 * Note: Supabase image transforms (/render/image/) are not available on this project,
 * so we return the original URL as-is. Optimization happens at upload time via imageCompressor.
 */
export const getOptimizedImageUrl = (src: string): string => src;
