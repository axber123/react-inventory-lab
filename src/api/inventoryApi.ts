import { requestJson } from "@/api/http";
import type {
  AdjustInventoryInput,
  Inventory,
  InventoryQuery,
} from "@/types";

function toSearchParams(query: InventoryQuery) {
  const params = new URLSearchParams();

  if (query.keyword?.trim()) params.set("keyword", query.keyword.trim());
  if (query.category) params.set("category", query.category);
  if (query.status) params.set("status", query.status);

  const value = params.toString();
  return value ? `?${value}` : "";
}

export function getInventories(query: InventoryQuery = {}) {
  return requestJson<Inventory[]>(`/inventory${toSearchParams(query)}`);
}

export function getInventory(matnr: string) {
  return requestJson<Inventory>(`/inventory/${matnr}`);
}

export function adjustInventory({ matnr, delta }: AdjustInventoryInput) {
  return requestJson<Inventory>(`/inventory/${matnr}/adjust`, {
    method: "POST",
    body: JSON.stringify({ delta }),
  });
}
