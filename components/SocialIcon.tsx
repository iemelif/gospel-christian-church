/** Add more networks here (instagram, youtube…) and reference them from SOCIAL in content/site.ts. */
export default function SocialIcon({ icon }: { icon: "facebook" }) {
  if (icon === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="currentColor">
        <path d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.3-1.6 1.7-1.6h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.3H10V22z" />
      </svg>
    );
  }
  return null;
}
