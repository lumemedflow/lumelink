import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirectImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined;
  
  // Handle Google Drive links
  const driveRegex = /drive\.google\.com\/file\/d\/([^/]+)/;
  const match = url.match(driveRegex);
  
  if (match && match[1]) {
    // Note: Google Drive direct linking for images is:
    // https://drive.google.com/uc?export=view&id={FILE_ID}
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  
  return url;
}
