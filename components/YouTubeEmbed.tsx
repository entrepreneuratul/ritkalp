/**
 * Extracts an 11-character YouTube video ID from any common URL shape:
 * https://www.youtube.com/watch?v=XXXXXXXXXXX
 * https://youtu.be/XXXXXXXXXXX
 * https://www.youtube.com/embed/XXXXXXXXXXX
 */
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

interface YouTubeEmbedProps {
  /** Full YouTube URL from a festival's dayGuide.days[].youtubeUrl. Leave "" for a placeholder. */
  url: string;
  title: string;
  /**
   * Autoplay on load. Browsers only allow autoplay when the video is
   * muted, so this also mutes and loops the video — the player's own
   * controls let a visitor unmute or pause any time.
   */
  autoplay?: boolean;
  className?: string;
}

/**
 * Reusable responsive (16:9) YouTube embed. Pass any standard YouTube
 * URL and it renders a proper <iframe> embed; passing "" renders a
 * tasteful "video coming soon" placeholder instead, so the layout
 * never breaks while you're still collecting video links.
 */
export default function YouTubeEmbed({ url, title, autoplay = false, className = "" }: YouTubeEmbedProps) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <div className={`relative w-full aspect-video rounded-xl border-2 border-dashed border-accent-300 bg-primary-50 flex flex-col items-center justify-center gap-2 text-primary-400 px-4 text-center ${className}`}>
        <PlayIcon className="h-10 w-10 opacity-50" />
        <p className="text-sm font-medium">Video coming soon</p>
        {/* TODO: paste this day's YouTube link into its festival file in lib/festivals/ (youtubeUrl field) */}
      </div>
    );
  }

  // Autoplay requires mute=1 (browser policy) — loop=1 + playlist=<id>
  // makes a single video loop, which is the standard YouTube trick for it.
  const params = autoplay
    ? `?autoplay=1&mute=1&loop=1&playlist=${videoId}&rel=0`
    : "";

  return (
    <div className={`relative w-full aspect-video rounded-xl overflow-hidden shadow-lg ring-1 ring-primary-900/10 ${className}`}>
      <iframe
        src={`https://www.youtube.com/embed/${videoId}${params}`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading={autoplay ? "eager" : "lazy"}
      />
    </div>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
