/**
 * Utility: converts a page name to its URL path.
 * Replaces the Base44 createPageUrl helper.
 */
export function createPageUrl(pageName) {
  if (!pageName || pageName === "Home") return "/";
  return `/${pageName}`;
}
