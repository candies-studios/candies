export const dynamic = "force-static";
import { ImageResponse } from "next/og";

export const alt = "Candies Studio — We turn ideas into experiences that move brands forward.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0b0c14",
          color: "#f4f1ec",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: -80, top: 60, width: 520, height: 520, borderRadius: 9999, background: "linear-gradient(90deg, #e8577d 0%, #e8577d 16%, #f2a33a 16%, #f2a33a 33%, #f6d743 33%, #f6d743 50%, #34b98a 50%, #34b98a 66%, #5e79bb 66%, #5e79bb 83%, #6046aa 83%)", display: "flex" }} />
        <div style={{ position: "absolute", right: 360, top: 70, width: 90, height: 90, borderRadius: 9999, background: "#5e79bb", display: "flex" }} />
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 6, textTransform: "uppercase", opacity: 0.7 }}>Candies Studio</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 800, lineHeight: 1, letterSpacing: -2, textTransform: "uppercase", maxWidth: 820 }}>
          <span>We turn ideas into</span>
          <span>experiences that</span>
          <span style={{ color: "#a9b8e0" }}>move brands forward.</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, opacity: 0.6 }}>Design · Content · Digital Marketing · Events</div>
      </div>
    ),
    size,
  );
}
