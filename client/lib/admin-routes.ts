export const ADMIN_LOGIN = "/admin/login";
export const ADMIN_DASHBOARD = "/admin/dashboard";

export function adminDestination(value?: unknown): string {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  )
    return ADMIN_DASHBOARD;
  try {
    const url = new URL(value, "https://admin.invalid");
    if (
      url.origin !== "https://admin.invalid" ||
      !(
        url.pathname === ADMIN_DASHBOARD ||
        url.pathname.startsWith(`${ADMIN_DASHBOARD}/`)
      )
    )
      return ADMIN_DASHBOARD;
    return url.pathname + url.search + url.hash;
  } catch {
    return ADMIN_DASHBOARD;
  }
}
export function adminLoginHref(destination: string) {
  return `${ADMIN_LOGIN}?next=${encodeURIComponent(adminDestination(destination))}`;
}
