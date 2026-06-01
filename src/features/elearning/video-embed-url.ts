export type ParsedVideoEmbed = {
  embedUrl: string;
  /** true = YouTube Shorts / pionowe – ramka 9:16 */
  portrait: boolean;
};

function youtubeEmbedId(id: string, portrait: boolean): ParsedVideoEmbed {
  return {
    embedUrl: `https://www.youtube.com/embed/${id}`,
    portrait,
  };
}

/**
 * Obsługuje m.in. YouTube (watch, youtu.be, /shorts/ID) i Vimeo.
 * Shorts używają tego samego playera co zwykłe YT – wystarczy wyciągnąć ID z /shorts/.
 */
export function parseVideoEmbedUrl(url: string): ParsedVideoEmbed | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?#]+)/);
      if (shortsMatch?.[1]) {
        return youtubeEmbedId(shortsMatch[1], true);
      }

      const id = parsed.searchParams.get("v");
      if (id) {
        return youtubeEmbedId(id, false);
      }
      return null;
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return youtubeEmbedId(id, false);
      }
      return null;
    }

    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      if (id) {
        return {
          embedUrl: `https://player.vimeo.com/video/${id}`,
          portrait: false,
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}
