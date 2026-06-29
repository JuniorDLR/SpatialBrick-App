export const BFA_IMAGES_BASE_PATH = "/assets/bfa-images";

export function resolveBfaImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl) {
    return null;
  }

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://") ||
    imageUrl.startsWith("data:") ||
    imageUrl.startsWith("/")
  ) {
    return imageUrl;
  }

  return `${BFA_IMAGES_BASE_PATH}/${imageUrl.replace(/^\/+/, "")}`;
}

export function buildMockUploadedImagePath(originalName: string): string {
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${BFA_IMAGES_BASE_PATH}/uploads/${Date.now()}-${sanitized}`;
}

export function isExternalImageUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

export function isDataUriImage(url: string): boolean {
  return url.startsWith("data:");
}
