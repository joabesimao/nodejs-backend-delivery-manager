export const MAX_CHAT_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const estimateBase64Bytes = (base64Value: string): number => {
  const padding = base64Value.match(/=+$/)?.[0].length ?? 0;
  return Math.floor((base64Value.length * 3) / 4) - padding;
};

export const normalizeBase64 = (imageBase64: string): string => {
  if (!imageBase64) {
    return "";
  }

  const marker = ",";
  const markerIndex = imageBase64.indexOf(marker);

  if (markerIndex >= 0 && imageBase64.startsWith("data:")) {
    return imageBase64.slice(markerIndex + 1);
  }

  return imageBase64;
};
