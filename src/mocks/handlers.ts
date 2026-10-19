import { delay, http, HttpResponse } from "msw";
import { filterInventories } from "@/lib/inventory";
import type { AdjustInventoryInput, InventoryCategory, StockStatus } from "@/types";
import {
  applyInventoryAdjustment,
  findInventory,
  listInventories,
} from "@/mocks/db";

const api = (path: string) => `/api${path}`;

export const handlers = [
  http.post(api("/auth/login"), async ({ request }) => {
    await delay(450);

    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };
    const username = body.username?.trim();
    const password = body.password?.trim();

    if (!username || !password) {
      return HttpResponse.json(
        { message: "用户名和密码不能为空" },
        { status: 400 },
      );
    }

    return HttpResponse.json({
      user: {
        name: username,
        role: username.toLowerCase() === "admin" ? "admin" : "viewer",
      },
    });
  }),

  http.get(api("/inventory"), async ({ request }) => {
    await delay(550);

    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") ?? "";
    const category = url.searchParams.get("category") as InventoryCategory | "";
    const status = url.searchParams.get("status") as StockStatus | "";

    return HttpResponse.json(
      filterInventories(listInventories(), { keyword, category, status }),
    );
  }),

  http.get(api("/inventory/:matnr"), async ({ params }) => {
    await delay(350);

    const matnr = String(params.matnr);
    const item = findInventory(matnr);

    if (!item) {
      return HttpResponse.json(
        { message: `物料 ${matnr} 不存在` },
        { status: 404 },
      );
    }

    return HttpResponse.json(item);
  }),

  http.post(api("/inventory/:matnr/adjust"), async ({ params, request }) => {
    await delay(250);

    const body = (await request.json()) as Partial<AdjustInventoryInput>;
    const matnr = String(params.matnr);
    const delta = body.delta;

    if (delta !== 1 && delta !== -1) {
      return HttpResponse.json(
        { message: "库存调整数量只能为 +1 或 -1" },
        { status: 400 },
      );
    }

    const currentItem = findInventory(matnr);
    if (!currentItem) {
      return HttpResponse.json(
        { message: `物料 ${matnr} 不存在` },
        { status: 404 },
      );
    }

    if (delta === -1 && currentItem.quantity === 0) {
      return HttpResponse.json(
        { message: "库存为 0 时不能继续减少" },
        { status: 409 },
      );
    }

    const item = applyInventoryAdjustment({ matnr, delta });

    return HttpResponse.json(item);
  }),
];
