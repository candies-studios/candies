/**
 * Countries offered on the landing-page form, each with its currency.
 * The budget dropdown shows ranges in the currency of the selected country.
 *
 * UAE and US brackets: under 3k / 3k–7.5k / 7.5k–20k / 20k–50k / 50k+ in USD,
 * converted to AED and rounded.
 * To add a country, add it here (and its brackets below if it uses a new currency).
 */

export type Country = { name: string; code: string; currency: string };

export const countries: Country[] = [
  { name: "United Arab Emirates", code: "ae", currency: "AED" },
  { name: "United States", code: "us", currency: "USD" },
];

/** Lower bounds of the four upper brackets, per currency. */
export const budgetTiers: Record<string, [number, number, number, number]> = {
  AED: [10000, 30000, 75000, 200000],
  USD: [3000, 7500, 20000, 50000],
};
