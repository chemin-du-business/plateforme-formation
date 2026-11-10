"use client";

import { useRef, useSyncExternalStore } from "react";
import { saveProgress } from "@/app/niveau/actions";

type Props = {
  moduleKey: string;
  desktopUrl: string | null;
  mobileUrl: string | null;
  subtitlesUrl: string | null;
  startAt: number;
};

export default function VideoPlayer({ moduleKey, desktopUrl, mobileUrl, subtitlesUrl, startAt }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const lastBucket = useRef(-1);
  const resume = useRef(startAt);

  // Téléphone : vidéo verticale ; tablette et ordinateur : vidéo horizontale. Le choix suit la taille de l’écran, sans bouton.
  const isSmall = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(max-width: 767px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(max-width: 767px)").matches,
    () => false,
  );
  const mobile = isSmall && Boolean(mobileUrl);
  const src = mobile ? mobileUrl : desktopUrl ?? mobileUrl;

  function onLoaded() {
    if (ref.current && resume.current > 3) ref.current.currentTime = resume.current;
  }

  function onTimeUpdate() {
    const v = ref.current;
    if (!v) return;
    resume.current = v.currentTime;
    const bucket = Math.floor(v.currentTime / 10); // une sauvegarde toutes les 10 secondes de lecture
    if (bucket === lastBucket.current) return;
    lastBucket.current = bucket;
    void saveProgress(moduleKey, v.currentTime, v.duration > 0 && v.currentTime / v.duration >= 0.9);
  }

  function onEnded() {
    void saveProgress(moduleKey, 0, true);
  }

  if (!src) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center">
        <p className="font-semibold">Cette vidéo n’est pas encore disponible.</p>
        <p className="mt-2 text-sm text-muted">Les fichiers vidéo doivent être envoyés dans le stockage Supabase (bucket « videos »). Voir le README.</p>
      </div>
    );
  }

  return (
    <div>
      <video
        ref={ref}
        key={src}
        src={src}
        controls
        playsInline
        preload="metadata"
        onLoadedMetadata={onLoaded}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
        className={`mx-auto w-full rounded-2xl bg-black ${mobile ? "max-h-[75vh] max-w-sm" : ""}`}
      >
        {subtitlesUrl && <track kind="subtitles" srcLang="fr" label="Français" src={subtitlesUrl} default />}
      </video>
    </div>
  );
}
