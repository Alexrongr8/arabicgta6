import { ImageResponse } from "next/og";

export const alt = "Arabic GTA 6 — GTA VI secrets, news & interactive map";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const stripes = Array.from({ length: 7 }, (_, i) => i);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "linear-gradient(180deg,#1a0d2e 0%,#0b0613 70%)", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ position: "absolute", top: 90, width: 420, height: 420, borderRadius: 9999, background: "linear-gradient(180deg,#ffd166,#ff9a3d 45%,#ff3d8b 80%,#8b3dff)", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden", opacity: 0.85 }}>
          {stripes.map((i) => (
            <div key={i} style={{ height: 6 + i * 2, marginTop: 12, background: "#0b0613", width: "100%" }} />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 900, color: "white", letterSpacing: 4, textShadow: "0 0 40px #ff3d8b" }}>GTA VI</div>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, color: "#ffd166", marginTop: 6 }}>ARABIC GTA6 · arabicgta6.com</div>
        <div style={{ display: "flex", fontSize: 30, color: "#e9dcff", marginTop: 18 }}>Secrets · Money · Weapons · Glitches · Interactive map</div>
      </div>
    ),
    size,
  );
}
