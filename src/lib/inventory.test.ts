import { describe, expect, it } from "vitest";
import {
  adjustInventoryItem,
  filterInventories,
  getInventoryStats,
  getStockStatus,
} from "@/lib/inventory";
import type { Inventory } from "@/types";

const baseItem: Inventory = {
  matnr: "100001",
  name: "不锈钢螺栓 M8×30",
  category: "紧固件",
  quantity: 12,
  unit: "件",
  minStock: 10,
  location: "A-01-03",
  updatedAt: "2026-10-01T08:00:00.000Z",
};

describe("inventory helpers", () => {
  it("derives stock status from quantity and minStock", () => {
    expect(getStockStatus({ quantity: 0, minStock: 10 })).toBe("out-of-stock");
    expect(getStockStatus({ quantity: 8, minStock: 10 })).toBe("low");
    expect(getStockStatus({ quantity: 12, minStock: 10 })).toBe("normal");
  });

  it("filters by keyword, category and status", () => {
    const items: Inventory[] = [
      baseItem,
      {
        ...baseItem,
        matnr: "100002",
        name: "伺服电机 750W",
        category: "电气件",
        quantity: 0,
        location: "C-01-01",
      },
    ];

    expect(filterInventories(items, { keyword: "伺服" })).toHaveLength(1);
    expect(filterInventories(items, { category: "紧固件" })).toHaveLength(1);
    expect(filterInventories(items, { status: "out-of-stock" })).toHaveLength(1);
  });

  it("aggregates dashboard stats", () => {
    expect(
      getInventoryStats([
        baseItem,
        { ...baseItem, matnr: "100002", quantity: 0 },
      ]),
    ).toEqual({
      totalKinds: 2,
      totalQuantity: 12,
      lowStock: 0,
      outOfStock: 1,
    });
  });

  it("adjusts quantity without going below zero", () => {
    expect(adjustInventoryItem({ ...baseItem, quantity: 0 }, -1).quantity).toBe(0);
    expect(adjustInventoryItem(baseItem, 1).quantity).toBe(13);
  });
});
