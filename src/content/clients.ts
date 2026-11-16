/**
 * CLIENTS — logos displayed on the existing candies.studio homepage & About page.
 * Files are pulled by `npm run assets:pull` into /public/media/clients.
 * `sector` is only used for grouping on the Work page; leave it empty if unsure.
 */
export type Client = {
  name: string;
  logo: string;
  sector?: "Banking & Financial Services" | "FMCG & Consumer" | "Media & Publishing" | "Payments & Technology";
};

export const clients: Client[] = [
  { name: "Axis Bank", logo: "/media/clients/axis-bank.png", sector: "Banking & Financial Services" },
  { name: "Kotak", logo: "/media/clients/kotak.png", sector: "Banking & Financial Services" },
  { name: "SIDBI", logo: "/media/clients/sidbi.png", sector: "Banking & Financial Services" },
  { name: "L&T Finance", logo: "/media/clients/lt-finance.png", sector: "Banking & Financial Services" },
  { name: "Worldline", logo: "/media/clients/worldline.png", sector: "Payments & Technology" },
  { name: "Godrej Agrovet", logo: "/media/clients/godrej-agrovet.png", sector: "FMCG & Consumer" },
  { name: "Parachute", logo: "/media/clients/parachute.png", sector: "FMCG & Consumer" },
  { name: "Borosil", logo: "/media/clients/borosil.png", sector: "FMCG & Consumer" },
  { name: "Forbes India", logo: "/media/clients/forbes-india.png", sector: "Media & Publishing" },
  { name: "Viacom18", logo: "/media/clients/viacom18.png", sector: "Media & Publishing" },
  // TODO(admin): confirm ADMA's full name and sector.
  { name: "ADMA", logo: "/media/clients/adma.png" },
];
