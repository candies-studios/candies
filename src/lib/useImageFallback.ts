"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Tracks whether an <img> failed to load — including failures that happen
 * before React hydrates (when React's onError would never fire).
 */
export function useImageFallback(initial = true) {
  const [ok, setOk] = useState(initial);
  const ref = useRef<HTMLImageElement | null>(null);
  const onError = useCallback(() => setOk(false), []);
  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) {
      setOk(false);
      return;
    }
    img.addEventListener("error", onError);
    return () => img.removeEventListener("error", onError);
  }, [onError]);
  return { ok, ref, onError };
}
