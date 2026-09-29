import Link from "next/link";
import Avatar from "./Avatar";
import { displayName, type Person } from "@/lib/officers";

/**
 * One person as a card. Renders an `<li>`, so place it inside a list. `large` enlarges the avatar.
 * `href` makes the whole card a link (keyboard-focusable, crimson border on hover/focus).
 */
export default function PersonCard({ person, large = false, href }: { person: Person; large?: boolean; href?: string }) {
  const [main, ...others] = person.roles;
  const body = (
    <>
      <Avatar name={displayName(person.name)} photo={person.photo} large={large} />
      <h3 className="text-[18px] leading-[1.25]">{displayName(person.name)}</h3>
      <p className="mt-1.5 mb-0 text-[14px] font-semibold text-crimson">{main}</p>
      {others.length > 0 && <p className="mt-1 mb-0 text-[13px] text-mute">{others.join(" · ")}</p>}
    </>
  );
  if (!href) return <li className="rounded-xl border border-line bg-card px-4 py-5 text-center">{body}</li>;
  return (
    <li className="flex">
      <Link href={href} className="block w-full rounded-xl border border-line bg-card px-4 py-5 text-center no-underline transition-colors hover:border-crimson focus-visible:border-crimson motion-reduce:transition-none">{body}</Link>
    </li>
  );
}
