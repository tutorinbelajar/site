import Link from "next/link";
import type { Program } from "@/data/programs";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="card program-card">
      <span className="eyebrow">{program.category === "privat" ? "PRIVAT" : "KELAS"}</span>
      <h3>{program.name}</h3>
      <p>{program.shortDescription}</p>
      <div className="tags"><span>{program.level}</span>{program.subject && <span>{program.subject}</span>}</div>
      <Link className="text-link" href={`/program/${program.category}/${program.slug}`}>Lihat detail bimbel →</Link>
    </article>
  );
}
