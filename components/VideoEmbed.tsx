/**
 * Responsive Facebook video (16:9, full column width). Pass the public video URL; the embed player URL is built
 * here so pages never carry Facebook's iframe configuration. `autoplay` asks Facebook's player to start on load;
 * Facebook autoplays muted (browsers block autoplay with sound), and its own controls pause, seek and unmute.
 */
export function facebookEmbedSrc(videoUrl: string, autoplay = false) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false${autoplay ? "&autoplay=true&mute=true" : ""}`;
}

export default function VideoEmbed({ url, title, autoplay = false }: { url: string; title: string; autoplay?: boolean }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-ink">
      <iframe src={facebookEmbedSrc(url, autoplay)} title={title} loading={autoplay ? "eager" : "lazy"} allowFullScreen
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        className="absolute inset-0 h-full w-full border-0" />
    </div>
  );
}
