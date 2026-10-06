import "server-only";

import { createClient } from "@sanity/client";
import { apiVersion, projectId } from "./client";

/**
 * Write access to the private "enquiries" dataset. The token never leaves the
 * server; the public site has no way to read this dataset.
 */
export function enquiriesClient() {
  const token = process.env.SANITY_ENQUIRIES_WRITE_TOKEN;
  if (!token) throw new Error("SANITY_ENQUIRIES_WRITE_TOKEN is not set");
  return createClient({
    projectId,
    dataset: process.env.SANITY_ENQUIRIES_DATASET ?? "enquiries",
    apiVersion,
    token,
    useCdn: false,
  });
}
