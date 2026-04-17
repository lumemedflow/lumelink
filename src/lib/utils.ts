import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGoogleDriveFileId(url: string): string | undefined {
  const trimmed = url.trim();
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
      return match[1];
    }
  }
  return undefined;
}

export function getGoogleDriveViewUrl(url: string): string | undefined {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/uc?export=view&id=${fileId}` : undefined;
}

export function getGoogleDriveDownloadUrl(url: string): string | undefined {
  const fileId = getGoogleDriveFileId(url);
  return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : undefined;
}

export function getDirectImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();
  const driveUrl = getGoogleDriveViewUrl(trimmed);
  if (driveUrl) return driveUrl;

  const dropboxMatch = trimmed.match(/dropbox\.com\/s\/([^?]+)(?:\?dl=\d)?/);
  if (dropboxMatch && dropboxMatch[1]) {
    return `https://www.dropbox.com/s/${dropboxMatch[1]}?raw=1`;
  }

  return trimmed;
}

export function getAlternateImageUrl(url: string): string {
  const fileId = getGoogleDriveFileId(url);
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  return url;
}
