import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";

/**
 * Sanity webhook target: called when an editor publishes, so the homepage
 * refreshes immediately instead of waiting for the hourly revalidation.
 * Configure the webhook at sanity.io/manage with the same secret as
 * SANITY_REVALIDATE_SECRET.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ message: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json({ message: "Invalid signature" }, { status: 401 });
  }

  revalidatePath("/");
  return Response.json({ revalidated: true, now: Date.now() });
}
