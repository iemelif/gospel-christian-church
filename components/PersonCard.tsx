import Avatar from "./Avatar";
import { displayName, type Person } from "@/lib/officers";

export default function PersonCard({ person }: { person: Person }) {
  const [main, ...others] = person.roles;
  return (
    <li className="person">
      <Avatar name={displayName(person.name)} photo={person.photo} />
      <h3>{displayName(person.name)}</h3>
      <p className="role">{main}</p>
      {others.length > 0 && <p className="also">{others.join(" · ")}</p>}
    </li>
  );
}
