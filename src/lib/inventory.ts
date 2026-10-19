import type {
  Inventory,
  InventoryCategory,
  InventoryQuery,
  StockStatus,
} from "@/types";

export const INVENTORY_CATEGORIES: InventoryCategory[] = [
  "紧固件",
  "传动件",
  "电气件",
  "型材",
  "耗材",
];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  "out-of-stock": "缺货",
  low: "低库存",
  normal: "充足",
};

export function getStockStatus(item: Pick<Inventory, "quantity" | "minStock">) {
  if (item.quantity === 0) return "out-of-stock";
  if (item.quantity <= item.minStock) return "low";
  return "normal";
}

export function getStockStatusLabel(
  item: Pick<Inventory, "quantity" | "minStock">,
) {
  return STOCK_STATUS_LABELS[getStockStatus(item)];
}

export function filterInventories(
  inventories: Inventory[],
  query: InventoryQuery,
) {
  const keyword = query.keyword?.trim().toLowerCase() ?? "";

  return inventories.filter((item) => {
    const matchesKeyword =
      !keyword ||
      item.matnr.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword) ||
      item.location.toLowerCase().includes(keyword);

    const matchesCategory =
      !query.category || item.category === query.category;

    const matchesStatus =
      !query.status || getStockStatus(item) === query.status;

    return matchesKeyword && matchesCategory && matchesStatus;
  });
}

export function getInventoryStats(inventories: Inventory[]) {
  return inventories.reduce(
    (stats, item) => {
      stats.totalKinds += 1;
      stats.totalQuantity += item.quantity;

      const status = getStockStatus(item);
      if (status === "low") stats.lowStock += 1;
      if (status === "out-of-stock") stats.outOfStock += 1;

      return stats;
    },
    {
      totalKinds: 0,
      totalQuantity: 0,
      lowStock: 0,
      outOfStock: 0,
    },
  );
}

export function adjustInventoryItem(
  item: Inventory,
  delta: AdjustDelta,
): Inventory {
  const nextQuantity = Math.max(0, item.quantity + delta);

  return {
    ...item,
    quantity: nextQuantity,
    updatedAt: new Date().toISOString(),
  };
}

type AdjustDelta = 1 | -1;
