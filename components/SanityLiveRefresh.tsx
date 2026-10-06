"use client";

import { createClient } from "@sanity/client";
import { useEffect } from "react";
import { refreshFromSanity } from "@/app/actions";
import { ScrollTrigger } from "@/lib/gsap";
import { apiVersion, dataset, projectId } from "@/lib/sanity/client";

/**
 * Listens to Sanity's Live Content API. When an editor publishes, it calls a
 * server action that revalidates the cached homepage. Revalidating inside a
 * server action also re-renders this open page with the fresh content, so open
 * tabs and the next visitors see the change within a few seconds.
 */
export function SanityLiveRefresh() {
  useEffect(() => {
    const client = createClient({ projectId, dataset, apiVersion, useCdn: true });
    let timer: ReturnType<typeof setTimeout> | undefined;

    const refresh = () => {
      // Publishing several documents at once arrives as a burst of events.
      clearTimeout(timer);
      timer = setTimeout(async () => {
        // No router.refresh() here: it would race the action's fresh render with a stale copy.
        await refreshFromSanity();
        // Content height may have changed; re-measure scroll animations.
        setTimeout(() => ScrollTrigger.refresh(), 800);
      }, 400);
    };

    const subscription = client.live.events().subscribe({
      next: (event) => {
        if (event.type === "message" || event.type === "restart") refresh();
      },
      error: (error) => console.warn("Sanity live updates unavailable:", error),
    });

    return () => {
      clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, []);

  return null;
}
