import type { ControlTowerSnapshot } from "@/types";
import { FALLBACK_TOWER } from "@/lib/fallback";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";
const USE_API = process.env.NEXT_PUBLIC_USE_API === "true";

/** Live demo defaults to synthetic lab data. Opt into API with NEXT_PUBLIC_USE_API=true. */
export async function fetchTower(): Promise<ControlTowerSnapshot> {
  if (!USE_API) {
    return FALLBACK_TOWER;
  }

  const res = await fetch(`${API_URL}/api/tower`, { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`Failed to load control tower snapshot (${res.status})`);
  }
  return res.json();
}

export { API_URL, USE_API };
