// Enquiry form fields and validation, shared by the form and the server action.

export const ENQUIRY_CATEGORIES = [
  { value: "membership", label: "Membership" },
  { value: "volunteering", label: "Volunteering" },
  { value: "meeting", label: "Visiting a meeting" },
  { value: "support", label: "Support or partnership" },
  { value: "community", label: "A community need" },
  { value: "other", label: "Something else" },
] as const;

export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number]["value"];
export type ReplyMethod = "email" | "phone";

export const RETENTION_MONTHS = 12;
export const MESSAGE_MAX = 2000;

export type EnquiryValues = {
  category: string;
  name: string;
  replyMethod: string;
  email: string;
  phone: string;
  area: string;
  message: string;
  consent: boolean;
};

export type EnquiryField = keyof EnquiryValues;
export type FieldErrors = Partial<Record<EnquiryField, string>>;

export type EnquiryState =
  | { status: "idle" }
  | { status: "error"; fieldErrors: FieldErrors; formError?: string; values: EnquiryValues }
  | { status: "success"; name: string; replyMethod: ReplyMethod };

const isCategory = (v: string): v is EnquiryCategory => ENQUIRY_CATEGORIES.some((c) => c.value === v);

export function readEnquiry(form: FormData): EnquiryValues {
  const text = (key: string) => String(form.get(key) ?? "").trim();
  return {
    category: text("category"),
    name: text("name"),
    replyMethod: text("replyMethod"),
    email: text("email"),
    phone: text("phone"),
    area: text("area"),
    message: text("message"),
    consent: form.get("consent") === "on",
  };
}

/** Returns field errors in the order the fields appear on the form. */
export function validateEnquiry(v: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!isCategory(v.category)) errors.category = "Choose what your enquiry is about.";
  if (v.name.length < 2) errors.name = "Enter your name.";
  else if (v.name.length > 100) errors.name = "Enter a name under 100 characters.";
  if (v.replyMethod !== "email" && v.replyMethod !== "phone") {
    errors.replyMethod = "Choose how you would like us to reply.";
  } else if (v.replyMethod === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) {
    errors.email = "Enter an email address, like name@example.com.";
  } else if (v.replyMethod === "phone") {
    const digits = v.phone.replace(/[\s()+-]/g, "");
    if (!/^\d{9,15}$/.test(digits)) errors.phone = "Enter a phone number, like 077 123 4567.";
  }
  if (v.area.length > 100) errors.area = "Keep the area under 100 characters.";
  if ((v.category === "community" || v.category === "other") && v.message.length < 10) {
    errors.message = "Tell us a little about your enquiry.";
  } else if (v.message.length > MESSAGE_MAX) {
    errors.message = `Keep your message under ${MESSAGE_MAX.toLocaleString("en")} characters.`;
  }
  if (!v.consent) errors.consent = "Confirm that you have read how your details will be used.";
  return errors;
}
