import { TRUSTED_DOMAINS } from "./config";
import { getHostname, isWithinWindow, normalizeUrl } from "./utils";

export interface RawNewsCandidate {
  title: string;
  summary: string;
  source: string;
  sourceCN: string;
  url: string;
  date: string;
}

export function isSafeExternalUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function isEventSpecificUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }
    const path = url.pathname.replace(/\/+$/, "");
    return path.length > 1 && path !== "/index.html";
  } catch {
    return false;
  }
}

export function isTrustedDomain(value: string): boolean {
  const hostname = getHostname(value);
  if (!hostname) {
    return false;
  }
  return TRUSTED_DOMAINS.some(
    (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
  );
}

export function validateNewsCandidate(
  item: RawNewsCandidate,
  windowDays: number,
  now = new Date()
): string | null {
  if (!item.title.trim()) {
    return "missing title";
  }
  if (!item.summary.trim()) {
    return "missing summary";
  }
  if (!item.source.trim()) {
    return "missing source";
  }
  if (!isSafeExternalUrl(item.url)) {
    return "unsafe url";
  }
  if (!isEventSpecificUrl(item.url)) {
    return "homepage or invalid url";
  }
  if (!isTrustedDomain(item.url)) {
    return "untrusted domain";
  }
  if (!isWithinWindow(item.date, windowDays, now)) {
    return "outside time window";
  }
  return null;
}

export function dedupeCandidates<T extends { url: string; title: string }>(
  items: T[]
): T[] {
  const seenUrls = new Set<string>();
  const seenTitles = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    const urlKey = normalizeUrl(item.url);
    const titleKey = item.title.trim().toLowerCase();
    if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) {
      continue;
    }
    seenUrls.add(urlKey);
    seenTitles.add(titleKey);
    result.push(item);
  }

  return result;
}
