import PersonCard from "./PersonCard";
import { boardRows } from "@/lib/officers";
import type { Term } from "@/content/officers";

/** Row 1: resident pastor & deac · Row 2: chairman & vice chairman · then the rest, as many per row as fit. */
export default function OfficerBoard({ term }: { term: Term }) {
  const { row1, row2, rest } = boardRows(term);
  return (
    <div className="board">
      {row1.length > 0 && <ul className="people row-top" aria-label="Pastor and Deac">{row1.map((p) => <PersonCard key={p.name} person={p} />)}</ul>}
      {row2.length > 0 && <ul className="people row-top" aria-label="Chairman and Vice Chairman">{row2.map((p) => <PersonCard key={p.name} person={p} />)}</ul>}
      {rest.length > 0 && <ul className="people row-rest" aria-label="Other officers and leaders">{rest.map((p) => <PersonCard key={p.name} person={p} />)}</ul>}
    </div>
  );
}
