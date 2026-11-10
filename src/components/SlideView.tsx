"use client";

import { useEffect, useRef, useState } from "react";

// Affiche une diapositive 1920×1080 mise à l'échelle de la largeur disponible (toujours en 16/9).
export default function SlideView({ html, className = "", style }: { html: string; className?: string; style?: React.CSSProperties }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.4);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / 1920));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative w-full overflow-hidden bg-white ${className}`} style={{ aspectRatio: "16 / 9", ...style }}>
      <div style={{ width: 1920, height: 1080, transform: `scale(${scale})`, transformOrigin: "top left" }} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
