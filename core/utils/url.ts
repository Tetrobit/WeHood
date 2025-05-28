export function parseQueryParams(url: string): Record<string, string> {
  const urlObj = new URL(url.replaceAll('&amp;', '&'));
  const queryParams = urlObj.searchParams;
  const params: Record<string, string> = {};
  for (const [key, value] of queryParams.entries()) {
    params[key] = value;
  }
  return params;
}
