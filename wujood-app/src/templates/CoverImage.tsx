"use client";

const GRADS = [
  "linear-gradient(135deg,#0e3b2e 0%,#1a6b50 100%)",
  "linear-gradient(135deg,#1a2c4e 0%,#2d4a7a 100%)",
  "linear-gradient(135deg,#3a2618 0%,#6b4a2c 100%)",
  "linear-gradient(135deg,#2a2a2a 0%,#4a4a4a 100%)",
  "linear-gradient(135deg,#0a0a0a 0%,#2a1a0a 100%)",
  "linear-gradient(135deg,#1a2c1a 0%,#2e4a2e 100%)",
  "linear-gradient(135deg,#2c1a3a 0%,#4a2c6b 100%)",
  "linear-gradient(135deg,#3a1a1a 0%,#6b2c2c 100%)",
];

function seedGrad(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return GRADS[Math.abs(h) % GRADS.length];
}

export function CoverImage({
  src,
  alt = "",
  seed = "x",
  height,
  radius = 0,
  style,
}: {
  src?: string | null;
  alt?: string;
  seed?: string;
  height?: number | string;
  radius?: number;
  style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    width: "100%",
    height: height ?? "100%",
    borderRadius: radius,
    display: "block",
    objectFit: "cover",
    ...style,
  };

  if (src) return <img src={src} alt={alt} style={base} />;

  return <div style={{ ...base, background: seedGrad(seed) }} />;
}
