// Enquiry form fields, validation and the WhatsApp message it opens.
// Nothing is sent to or stored by the website: the visitor sends the message from WhatsApp.

export const ENQUIRY_CATEGORIES = [
  { value: "membership", label: "Membership", about: "becoming a member" },
  { value: "volunteering", label: "Volunteering", about: "volunteering with the club" },
  { value: "meeting", label: "Visiting a meeting", about: "visiting a club meeting" },
  { value: "support", label: "Support or partnership", about: "supporting the club or a partnership" },
  { value: "community", label: "A community need", about: "a community need" },
  { value: "other", label: "Something else", about: "something else" },
] as const;

export type EnquiryCategory = (typeof ENQUIRY_CATEGORIES)[number]["value"];

// Keeps the WhatsApp link comfortably within URL length limits once encoded.
export const MESSAGE_MAX = 1000;

export type EnquiryValues = {
  category: EnquiryCategory;
  name: string;
  area: string;
  message: string;
};

export type EnquiryField = keyof EnquiryValues;
export type FieldErrors = Partial<Record<EnquiryField, string>>;

export const isCategory = (v: string): v is EnquiryCategory => ENQUIRY_CATEGORIES.some((c) => c.value === v);

/** Returns field errors in the order the fields appear on the form. */
export function validateEnquiry(v: EnquiryValues): FieldErrors {
  const errors: FieldErrors = {};
  if (v.name.length < 2) errors.name = "Enter your name.";
  else if (v.name.length > 100) errors.name = "Enter a name under 100 characters.";
  if (v.area.length > 100) errors.area = "Keep the area under 100 characters.";
  if ((v.category === "community" || v.category === "other") && v.message.length < 10) {
    errors.message = "Tell us a little about your enquiry.";
  } else if (v.message.length > MESSAGE_MAX) {
    errors.message = `Keep your message under ${MESSAGE_MAX.toLocaleString("en")} characters.`;
  }
  return errors;
}

export function enquiryMessage(v: EnquiryValues, clubName: string): string {
  const about = ENQUIRY_CATEGORIES.find((c) => c.value === v.category)?.about ?? "the club";
  return [
    `Hello ${clubName},`,
    `I'm ${v.name}${v.area ? ` from ${v.area}` : ""}. I'd like to ask about ${about}.`,
    v.message,
    "(Sent from the club website)",
  ]
    .filter(Boolean)
    .join("\n\n");
}

/** Click-to-chat link: opens WhatsApp (app or web) with the message ready to send. */
export function whatsappUrl(number: string, text: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
}
