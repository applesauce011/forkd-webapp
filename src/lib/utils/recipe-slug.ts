const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUUID(str: string): boolean {
  return UUID_RE.test(str);
}

/** Converts a recipe title + UUID into an SEO-friendly URL slug.
 *  Format: "classic-chicken-pot-pie-abc12345-def6-7890-abcd-ef1234567890"
 *  The UUID is always appended as the final 36 chars after a "-" separator.
 */
export function toRecipeSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50)
    .replace(/-$/, "");
  return slug ? `${slug}-${id}` : id;
}

/** Extracts the UUID from a slug URL param (last 36 characters).
 *  Returns null if the param does not end in a valid UUID.
 */
export function extractUUIDFromSlug(param: string): string | null {
  if (param.length < 36) return null;
  const potential = param.slice(-36);
  return UUID_RE.test(potential) ? potential : null;
}
