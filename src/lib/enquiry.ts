/** Shared enquiry schema + validation (used by the form AND the API route). */

export const serviceOptions = ["Design", "Content", "Digital Marketing", "Websites & Applications", "Events", "Multiple / Not sure yet"] as const;

export const budgetOptions = [
  "Under ₹5 lakh (≈ US$6k)",
  "₹5–15 lakh (≈ US$6k–18k)",
  "₹15–40 lakh (≈ US$18k–48k)",
  "₹40 lakh+ (≈ US$48k+)",
  "Not sure yet",
] as const;

export type Enquiry = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  budget: string;
  message: string;
};

export type FieldErrors = Partial<Record<keyof Enquiry, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{7,20}$/;

const limits: Record<keyof Enquiry, number> = {
  name: 120,
  company: 160,
  email: 200,
  phone: 30,
  country: 80,
  service: 60,
  budget: 60,
  message: 5000,
};

export function normalise(input: Record<string, unknown>): Enquiry {
  const s = (k: keyof Enquiry) => String(input[k] ?? "").trim().slice(0, limits[k]);
  return {
    name: s("name"),
    company: s("company"),
    email: s("email").toLowerCase(),
    phone: s("phone"),
    country: s("country"),
    service: s("service"),
    budget: s("budget"),
    message: s("message"),
  };
}

export function validate(e: Enquiry): FieldErrors {
  const err: FieldErrors = {};
  if (e.name.length < 2) err.name = "Please enter your full name.";
  if (e.company.length < 2) err.company = "Please enter your company name.";
  if (!EMAIL.test(e.email)) err.email = "Please enter a valid work email.";
  if (e.phone && !PHONE.test(e.phone)) err.phone = "Please enter a valid phone number (digits, +, spaces).";
  if (e.country.length < 2) err.country = "Please tell us where you're based.";
  if (!serviceOptions.includes(e.service as (typeof serviceOptions)[number])) err.service = "Please choose a service.";
  if (!budgetOptions.includes(e.budget as (typeof budgetOptions)[number])) err.budget = "Please choose a budget range.";
  if (e.message.length < 20) err.message = "Tell us a little more about your project (at least 20 characters).";
  return err;
}
