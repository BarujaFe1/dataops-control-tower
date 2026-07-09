import type { ControlTowerSnapshot } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export async function fetchTower(): Promise<ControlTowerSnapshot> {
  const res = await fetch(`${API_URL}/api/tower`, { next: { revalidate: 30 } });
  if (!res.ok) {
    throw new Error(`Failed to load control tower snapshot (${res.status})`);
  }
  return res.json();
}

export { API_URL };
