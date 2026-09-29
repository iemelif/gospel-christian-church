import Image from "next/image";

// Circle with a white border and a gold ring. `large` is used on the officer board's first two rows.
const base = "mx-auto mb-3 block overflow-hidden rounded-full border-[3px] border-white object-cover ring-2 ring-gold";

/** Picture of a person: their image (avatar SVG or real photo), or a built-in gray silhouette if none is set. */
export default function Avatar({ name, photo, large = false }: { name: string; photo?: string; large?: boolean }) {
  const className = `${base} ${large ? "size-[124px]" : "size-24"}`;
  if (photo) {
    return <Image className={className} src={photo} alt={`Photo of ${name}`} width={200} height={200} unoptimized />;
  }
  return (
    <svg className={className} viewBox="0 0 100 100" role="img" aria-label={`No photo available for ${name}`}>
      <rect width="100" height="100" fill="#e6ebf1" />
      <circle cx="50" cy="38" r="18" fill="#a9b3c1" />
      <path d="M14 100c0-22 16-38 36-38s36 16 36 38z" fill="#a9b3c1" />
    </svg>
  );
}
