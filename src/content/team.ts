/**
 * TEAM — names and roles exactly as published on the existing About page.
 * Photos are pulled from the old site by `npm run assets:pull`.
 *
 * To update: edit this list. Order here = order on the page.
 * Portraits: 4:5 ratio works best (they are cropped to 4:5 on the site).
 * If a photo is missing, an elegant monogram is shown instead.
 */
export type TeamMember = {
  name: string;
  role: string;
  photo?: string;
  /** Optional: short bio or LinkedIn — TODO(admin) if desired. */
  linkedin?: string;
};

export const team: TeamMember[] = [
  { name: "Sushil Chandanshive", role: "Founder & Creative Head", photo: "/media/team/sushil-chandanshive.jpg" },
  { name: "Hamza Hameed", role: "WordPress Developer", photo: "/media/team/hamza-hameed.jpg" },
  { name: "Aditiya", role: "3D Animator", photo: "/media/team/aditiya.png" },
  { name: "Amarlis Vega", role: "Consultant, USA", photo: "/media/team/amarlis-vega.webp" },
  { name: "Arwa Lacchawala", role: "UI/UX & Graphic Designer", photo: "/media/team/arwa-lacchawala.jpg" },
  { name: "Aswajit", role: "Project Manager", photo: "/media/team/aswajit.png" },
  { name: "Bharti Dand", role: "Senior Graphic Designer", photo: "/media/team/bharti-dand.png" },
  { name: "Shivam", role: "Editor", photo: "/media/team/shivam.jpg" },
  { name: "Gajanan", role: "Consultant", photo: "/media/team/gajanan.jpg" },
];
