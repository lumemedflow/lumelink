import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirectImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();

  // Google Drive share links and direct previews
  const drivePatterns = [
    /drive\.google\.com\/file\/d\/([^/]+)(?:\/.*)?/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /drive\.google\.com\/uc\?id=([^&]+)/,
    /drive\.google\.com\/uc\?export=(?:view|download)&id=([^&]+)/,
    /docs\.google\.com\/uc\?id=([^&]+)/,
  ];
  for (const regex of drivePatterns) {
    const match = trimmed.match(regex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }

  // Dropbox share links
  const dropboxMatch = trimmed.match(/dropbox\.com\/s\/([^?]+)(?:\?dl=\d)?/);
  if (dropboxMatch && dropboxMatch[1]) {
    return `https://www.dropbox.com/s/${dropboxMatch[1]}?raw=1`;
  }

  // If the URL is already a direct image URL, return as-is
  return trimmed;
}
