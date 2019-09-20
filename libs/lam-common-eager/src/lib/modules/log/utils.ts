/**
 * Get an absolute URL from a relative one.
 * @param url A relative path to resolve to an absolute path.
 */
export function getAbsoluteUrl(url: string) {
  const a = document.createElement('a'); // Leverage the native a element's href to resolve paths
  a.href = url;
  return a.href;
}
