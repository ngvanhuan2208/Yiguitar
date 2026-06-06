const MOJIBAKE_PATTERN = /(?:Ã.|Ä.|Â.|â€|â€œ|â€”|áº|Æ°|Ä‘|Â©|ðŸ)/;

export const repairMojibake = (value) => {
  if (typeof value !== 'string') return value;
  if (!MOJIBAKE_PATTERN.test(value)) return value;

  try {
    return decodeURIComponent(escape(value));
  } catch {
    return value;
  }
};

export const normalizeUtf8 = (value) => {
  if (Array.isArray(value)) return value.map(normalizeUtf8);

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [key, normalizeUtf8(nestedValue)])
    );
  }

  return repairMojibake(value);
};

export const getApiErrorMessage = (error, fallback) =>
  normalizeUtf8(error?.response?.data?.message) ||
  normalizeUtf8(error?.message) ||
  fallback;
