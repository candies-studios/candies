/**
 * Budget options in the visitor's local currency.
 * The currency comes from the Country field: India → rupees,
 * United States → dollars, United Arab Emirates → dirhams.
 */
import { budgetTiers, countries, type Country } from "@/content/countries";
import { inrBudgetOptions } from "@/content/landing";

export const NOT_SURE = "Not sure yet";

const byName = new Map(countries.map((c) => [c.name, c]));
export const findCountry = (name: string): Country | undefined => byName.get(name);

export function currencyName(code: string) {
  try {
    return new Intl.DisplayNames(["en"], { type: "currency" }).of(code) || code;
  } catch {
    return code;
  }
}

/** The six budget choices for a currency, e.g. ["Under $3K", "$3K–$7.5K", …, "Not sure yet"]. */
export function budgetOptionsFor(currency: string): string[] {
  if (currency === "INR") return [...inrBudgetOptions];
  const code = budgetTiers[currency] ? currency : "USD";
  const [a, b, c, d] = budgetTiers[code];
  let f: (n: number) => string;
  try {
    const nf = new Intl.NumberFormat("en", { style: "currency", currency: code, notation: "compact", maximumFractionDigits: 1 });
    f = (n) => nf.format(n).replace(/\u00a0/g, " ");
  } catch {
    f = (n) => `${code} ${n.toLocaleString("en")}`;
  }
  return [`Under ${f(a)}`, `${f(a)}–${f(b)}`, `${f(b)}–${f(c)}`, `${f(c)}–${f(d)}`, `${f(d)}+`, NOT_SURE];
}

/** What gets stored with the lead: the range plus its currency code, so the team never has to guess. */
export const budgetValue = (label: string, currency: string) => (!label || label === NOT_SURE ? label : `${label} (${currency})`);
