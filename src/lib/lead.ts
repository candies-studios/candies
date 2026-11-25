/**
 * Lead form schema & validation (client side) — single-step form.
 * The server (supabase/functions/lead-submit) re-validates everything —
 * keep the two in sync if you add fields.
 */
import { interestOptions } from "@/content/landing";

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  country: string;
  /** Budget range label in the visitor's currency (currency follows the country). */
  budget: string;
  interests: string[];
  message: string;
  consent: boolean;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export const emptyLead: LeadInput = {
  name: "",
  email: "",
  phone: "",
  country: "",
  budget: "",
  interests: [],
  message: "",
  consent: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid business email.";
  const digits = v.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15 || !/^[+()\-.\s\d]+$/.test(v.phone.trim()))
    e.phone = "Please enter a valid phone number with country code.";
  if (!v.country) e.country = "Please select your country.";
  if (!v.budget) e.budget = v.country ? "Please choose a budget range." : "Select your country first, then choose a budget range.";
  const ids = interestOptions.map((o) => o.id as string);
  if (!v.interests.length || v.interests.some((i) => !ids.includes(i))) e.interests = "Please choose at least one option.";
  if (v.message.trim().length < 15) e.message = "Please share a few details (at least 15 characters).";
  if (!v.consent) e.consent = "Please confirm so we can contact you about your enquiry.";
  return e;
}

/** Hand-off from the form to the thank-you page (same browser tab). */
export const THANKS_KEY = "candies-lead-thanks";
export type ThanksPayload = { eventId: string; campaign: string; interests: string[]; firstName: string; reference: string; country: string; currency: string };
