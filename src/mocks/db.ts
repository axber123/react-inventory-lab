import { adjustInventoryItem } from "@/lib/inventory";
import type { AdjustInventoryInput, Inventory } from "@/types";

const STORAGE_KEY = "inventory-lab:mock-db";

export const seedInventories: Inventory[] = [
  {
    matnr: "100001",
    name: "不锈钢螺栓 M8×30",
    category: "紧固件",
    quantity: 120,
    unit: "件",
    minStock: 40,
    location: "A-01-03",
    updatedAt: "2026-10-01T08:00:00.000Z",
  },
  {
    matnr: "100002",
    name: "不锈钢螺母 M8",
    category: "紧固件",
    quantity: 300,
    unit: "件",
    minStock: 80,
    location: "A-01-04",
    updatedAt: "2026-10-01T08:05:00.000Z",
  },
  {
    matnr: "100003",
    name: "轴承 6204-2RS",
    category: "传动件",
    quantity: 45,
    unit: "套",
    minStock: 20,
    location: "B-02-01",
    updatedAt: "2026-10-02T03:20:00.000Z",
  },
  {
    matnr: "100004",
    name: "同步带 HTD-5M",
    category: "传动件",
    quantity: 8,
    unit: "条",
    minStock: 10,
    location: "B-02-02",
    updatedAt: "2026-10-05T06:30:00.000Z",
  },
  {
    matnr: "100005",
    name: "伺服电机 750W",
    category: "电气件",
    quantity: 12,
    unit: "台",
    minStock: 5,
    location: "C-01-01",
    updatedAt: "2026-10-06T09:10:00.000Z",
  },
  {
    matnr: "100006",
    name: "PLC 模块 CPU224",
    category: "电气件",
    quantity: 0,
    unit: "个",
    minStock: 3,
    location: "C-01-02",
    updatedAt: "2026-10-07T11:40:00.000Z",
  },
  {
    matnr: "100007",
    name: "亚克力板 3mm",
    category: "耗材",
    quantity: 66,
    unit: "张",
    minStock: 25,
    location: "D-03-01",
    updatedAt: "2026-10-08T02:15:00.000Z",
  },
  {
    matnr: "100008",
    name: "铝型材 2040",
    category: "型材",
    quantity: 24,
    unit: "根",
    minStock: 12,
    location: "D-03-05",
    updatedAt: "2026-10-08T02:45:00.000Z",
  },
];

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readDatabase(): Inventory[] {
  if (!canUseStorage()) return seedInventories;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedInventories;

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Inventory[]) : seedInventories;
  } catch {
    return seedInventories;
  }
}

function writeDatabase(inventories: Inventory[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inventories));
}

export function listInventories() {
  return readDatabase();
}

export function resetInventories() {
  writeDatabase(seedInventories);
  return seedInventories;
}

export function findInventory(matnr: string) {
  return readDatabase().find((item) => item.matnr === matnr);
}

export function applyInventoryAdjustment(input: AdjustInventoryInput) {
  const inventories = readDatabase();
  const nextInventories = inventories.map((item) =>
    item.matnr === input.matnr ? adjustInventoryItem(item, input.delta) : item,
  );

  writeDatabase(nextInventories);

  return nextInventories.find((item) => item.matnr === input.matnr);
}
