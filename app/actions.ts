"use server";

import { revalidatePath } from "next/cache";

/**
 * Called by <SanityLiveRefresh /> when Sanity reports published changes.
 * This only marks the cached homepage as stale so the next render fetches fresh
 * content; it cannot change content. Bursts of events are debounced in the browser.
 */
export async function refreshFromSanity() {
  revalidatePath("/");
}
