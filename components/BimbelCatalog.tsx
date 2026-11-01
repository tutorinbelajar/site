"use client";

import { useMemo, useState } from "react";
import { ProgramCard } from "@/components/ProgramCard";
import type { Program } from "@/data/programs";

type Filter = "semua" | "privat" | "kelas";

export function BimbelCatalog({ programs }: { programs: Program[] }) {
  const [filter, setFilter] = useState<Filter>("semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesCategory = filter === "semua" || program.category === filter;
      const haystack = [
        program.name,
        program.shortDescription,
        program.level,
        program.subject ?? "",
        ...program.features,
      ].join(" ").toLowerCase();

      return matchesCategory && (!q || haystack.includes(q));
    });
  }, [filter, query, programs]);

  return (
    <div className="bimbel-catalog">
      <div className="catalog-toolbar">
        <div className="catalog-search">
          <label htmlFor="bimbel-search">Cari bimbel</label>
          <div className="search-input-wrap">
            <span aria-hidden="true">⌕</span>
            <input
              id="bimbel-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari TKA, SNBT, Matematika, Privat..."
              type="search"
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="catalog-filter" role="group" aria-label="Filter kategori bimbel">
          <span>Filter</span>
          <div className="filter-pills">
            {([
              ["semua", "Semua"],
              ["privat", "Privat"],
              ["kelas", "Kelas"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`filter-pill ${filter === value ? "active" : ""}`}
                onClick={() => setFilter(value)}
                aria-pressed={filter === value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="catalog-summary">
        <strong>{filtered.length}</strong>{" "}
        {filtered.length === 1 ? "bimbel ditemukan" : "bimbel ditemukan"}
        {(query || filter !== "semua") && (
          <button
            type="button"
            className="reset-filter"
            onClick={() => {
              setQuery("");
              setFilter("semua");
            }}
          >
            Reset filter
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid-3">
          {filtered.map((program) => (
            <ProgramCard key={program.slug} program={program} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">⌕</div>
          <h3>Bimbel belum ditemukan</h3>
          <p>Coba gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => {
              setQuery("");
              setFilter("semua");
            }}
          >
            Tampilkan semua bimbel
          </button>
        </div>
      )}
    </div>
  );
}