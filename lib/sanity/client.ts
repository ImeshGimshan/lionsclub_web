import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "zhxlfgcp";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-02-19";

// Public, read-only access to published content. No token: drafts never reach the site.
// `useCdn: false` reads the live API, so a rebuild triggered by a publish event never
// picks up a stale cached response. The page itself is cached, so request volume stays low.
export const sanity = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
