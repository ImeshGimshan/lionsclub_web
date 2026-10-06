"use server";

import { headers } from "next/headers";
import { enquiriesClient } from "@/lib/sanity/enquiries";
import {
  readEnquiry,
  RETENTION_MONTHS,
  validateEnquiry,
  type EnquiryState,
  type ReplyMethod,
} from "@/lib/enquiry";

const MIN_FILL_MS = 3000; // humans take longer than this to fill the form
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

/** Small per-instance rate limit; enough to stop someone hammering the form. */
function rateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  const values = readEnquiry(form);

  // Spam traps: a hidden field people never see, and a form filled in implausibly fast.
  // Bots get a normal-looking success so they learn nothing; nothing is stored.
  const honeypot = String(form.get("website") ?? "");
  const startedAt = Number(form.get("startedAt") ?? 0);
  if (honeypot || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return { status: "success", name: values.name, replyMethod: values.replyMethod === "phone" ? "phone" : "email" };
  }

  const fieldErrors = validateEnquiry(values);
  if (Object.keys(fieldErrors).length) return { status: "error", fieldErrors, values };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "You have sent several enquiries in a short time. Please wait a few minutes, or call the secretary.",
      values,
    };
  }

  const replyMethod = values.replyMethod as ReplyMethod;
  const now = new Date();
  const deleteAfter = new Date(now);
  deleteAfter.setMonth(deleteAfter.getMonth() + RETENTION_MONTHS);

  const doc: { _type: "enquiry" } & Record<string, string> = {
    _type: "enquiry",
    status: "new",
    source: "website",
    category: values.category,
    name: values.name,
    replyMethod,
    // Store only the contact detail the person chose to share.
    ...(replyMethod === "email" ? { email: values.email } : { phone: values.phone }),
    ...(values.area ? { area: values.area } : {}),
    ...(values.message ? { message: values.message } : {}),
    submittedAt: now.toISOString(),
    deleteAfter: deleteAfter.toISOString(),
  };

  try {
    await enquiriesClient().create(doc);
  } catch (error) {
    // Log the failure, not the person's details.
    console.error("Enquiry could not be saved:", error instanceof Error ? error.message : "unknown error");
    return {
      status: "error",
      fieldErrors: {},
      formError: "Sorry, we couldn’t send your enquiry just now. Please try again, or call or email the secretary.",
      values,
    };
  }

  return { status: "success", name: values.name, replyMethod };
}
