export type InventoryCategory =
  | "紧固件"
  | "传动件"
  | "电气件"
  | "型材"
  | "耗材";

export type Inventory = {
  matnr: string;
  name: string;
  category: InventoryCategory;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  updatedAt: string;
};

export type StockStatus = "out-of-stock" | "low" | "normal";

export type InventoryQuery = {
  keyword?: string;
  category?: InventoryCategory | "";
  status?: StockStatus | "";
};

export type AdjustInventoryInput = {
  matnr: string;
  delta: 1 | -1;
};

export type AuthUser = {
  name: string;
  role: "admin" | "viewer";
};

export type LoginInput = {
  username: string;
  password: string;
};
