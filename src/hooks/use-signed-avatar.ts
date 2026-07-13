import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Short-lived signed URL lifetime for displaying private avatars (1 hour).
const SIGNED_URL_TTL = 60 * 60;

/**
 * Resolves a stored avatar reference into a displayable image URL.
 *
 * New uploads store only the storage path (e.g. `<uid>/avatar-123.jpg`).
 * For those, a short-lived signed URL is generated on demand. Legacy values
 * that already contain a full http(s) URL are returned as-is for compatibility.
 */
export function useSignedAvatar(avatarRef: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    if (!avatarRef) {
      setUrl(null);
      return;
    }

    // Legacy full URLs (previously stored signed/public URLs).
    if (/^https?:\/\//i.test(avatarRef)) {
      setUrl(avatarRef);
      return;
    }

    supabase.storage
      .from("avatars")
      .createSignedUrl(avatarRef, SIGNED_URL_TTL)
      .then(({ data }) => {
        if (active) setUrl(data?.signedUrl ?? null);
      })
      .catch(() => {
        if (active) setUrl(null);
      });

    return () => {
      active = false;
    };
  }, [avatarRef]);

  return url;
}
