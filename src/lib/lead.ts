/**
 * Lead form schema & validation (client side).
 * The server (supabase/functions/lead-submit) re-validates everything —
 * keep the two in sync if you add fields.
 */
import { interestOptions, timelineOptions, budgetOptions } from "@/content/landing";

export type LeadInput = {
  name: string;
  email: string;
  phone: string;
  country: string;
  company: string;
  designation: string;
  interests: string[];
  message: string;
  budget: string;
  timeline: string;
  consent: boolean;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

export const emptyLead: LeadInput = {
  name: "",
  email: "",
  phone: "",
  country: "",
  company: "",
  designation: "",
  interests: [],
  message: "",
  budget: "",
  timeline: "",
  consent: false,
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const currencyFor = (country: string) => (country === "India" ? "INR" : "USD");

export function validateStep(step: number, v: LeadInput): LeadErrors {
  const e: LeadErrors = {};
  if (step === 0) {
    if (v.name.trim().length < 2) e.name = "Please enter your full name.";
    if (!EMAIL.test(v.email.trim())) e.email = "Please enter a valid business email.";
    const digits = v.phone.replace(/\D/g, "");
    if (digits.length < 7 || digits.length > 15 || !/^[+()\-.\s\d]+$/.test(v.phone.trim()))
      e.phone = "Please enter a valid phone number with country code.";
    if (!v.country) e.country = "Please select your country.";
    if (v.company.trim().length < 2) e.company = "Please enter your company name.";
  }
  if (step === 1) {
    const ids = interestOptions.map((o) => o.id as string);
    if (!v.interests.length || v.interests.some((i) => !ids.includes(i))) e.interests = "Please choose at least one option.";
  }
  if (step === 2) {
    if (v.message.trim().length < 15) e.message = "Please share a few details (at least 15 characters).";
    const budgets = [...budgetOptions.INR, ...budgetOptions.USD] as string[];
    if (!budgets.includes(v.budget)) e.budget = "Please choose an approximate budget.";
    if (!(timelineOptions as readonly string[]).includes(v.timeline)) e.timeline = "Please choose a timeline.";
    if (!v.consent) e.consent = "Please confirm so we can contact you about your enquiry.";
  }
  return e;
}
