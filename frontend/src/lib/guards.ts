import type { Locale } from "@/i18n/ui";

function langRedir(lang: Locale, path: string) {
  return lang === "en" ? `/en${path}` : path;
}

export function isAuthed(cookieValue: string | undefined): boolean {
  return typeof cookieValue === "string" && cookieValue.length > 0;
}

export function adminLoginPath(lang: Locale): string {
  return langRedir(lang, "/admin/login");
}

export function adminDashboardPath(lang: Locale): string {
  return langRedir(lang, "/admin/dashboard");
}

export function clientLoginPath(lang: Locale): string {
  return langRedir(lang, "/client/login");
}

export function clientDashboardPath(lang: Locale): string {
  return langRedir(lang, "/client/dashboard");
}