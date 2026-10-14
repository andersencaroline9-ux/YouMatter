"use client";
import { type FormEvent, useEffect, useState } from "react";

export default function AdminTreeAccounting() {
  const [funded, setFunded] = useState("");
  const [planted, setPlanted] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("Loading confirmed tree totals…");
  useEffect(() => {
    fetch("/api/admin/impact", { cache: "no-store" }).then(async (response) => {
      if (!response.ok) throw new Error("Unable to load confirmed tree totals.");
      return await response.json() as { treesFunded: number; treesPlanted: number };
    }).then((data) => {
      setFunded(String(data.treesFunded)); setPlanted(String(data.treesPlanted)); setReady(true); setNote("");
    }).catch(() => setNote("Unable to load confirmed tree totals."));
  }, []);
  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setNote("");
    try {
      const response = await fetch("/api/admin/impact", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treesFunded: Number(funded), treesPlanted: Number(planted) }),
      });
      const data = await response.json() as { error?: string; treesFunded: number; treesPlanted: number };
      if (!response.ok) throw new Error(data.error ?? "Unable to save tree totals.");
      setFunded(String(data.treesFunded)); setPlanted(String(data.treesPlanted));
      setNote("Confirmed tree totals saved. The public tally will use these totals on its next load.");
    } catch (error) { setNote(error instanceof Error ? error.message : "Unable to save tree totals."); }
    finally { setBusy(false); }
  }
  return <section className="admin-section" aria-labelledby="tree-accounting-title">
    <h2 id="tree-accounting-title">Confirmed tree funding and planting</h2>
    <p>Record cumulative totals confirmed with the planting partner. Funding and planting are separate; do not copy the earned-tree count here.</p>
    <form className="gratitude-form" onSubmit={save} style={{ maxWidth: 520 }}>
      <label>Confirmed trees funded (total)
        <input type="number" min="0" step="1" max={Number.MAX_SAFE_INTEGER} required value={funded} disabled={!ready || busy} onChange={(event) => setFunded(event.target.value)} />
      </label>
      <label>Confirmed trees planted (total)
        <input type="number" min="0" step="1" max={Number(funded)} required value={planted} disabled={!ready || busy} onChange={(event) => setPlanted(event.target.value)} />
      </label>
      <button className="button" disabled={!ready || busy}>{busy ? "Saving…" : "Save confirmed totals"}</button>
      <p role="status">{note}</p>
    </form>
  </section>;
}
