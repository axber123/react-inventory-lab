import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import InventoryItem from "@/components/InventoryItem";
import type { Inventory } from "@/types";

const item: Inventory = {
  matnr: "100006",
  name: "PLC 模块 CPU224",
  category: "电气件",
  quantity: 0,
  unit: "个",
  minStock: 3,
  location: "C-01-02",
  updatedAt: "2026-10-07T11:40:00.000Z",
};

function renderItem(overrides: Partial<Inventory> = {}) {
  const onAdjust = vi.fn();

  render(
    <MemoryRouter>
      <InventoryItem item={{ ...item, ...overrides }} onAdjust={onAdjust} />
    </MemoryRouter>,
  );

  return { onAdjust };
}

describe("InventoryItem", () => {
  it("disables subtract button when stock is zero", () => {
    renderItem();

    expect(
      screen.getByRole("button", { name: /减少 PLC 模块 CPU224 库存/ }),
    ).toBeDisabled();
  });

  it("calls onAdjust with the clicked delta", async () => {
    const user = userEvent.setup();
    const { onAdjust } = renderItem({ quantity: 8, minStock: 10 });

    await user.click(screen.getByRole("button", { name: /增加/ }));
    await user.click(screen.getByRole("button", { name: /减少/ }));

    expect(onAdjust).toHaveBeenNthCalledWith(1, 1);
    expect(onAdjust).toHaveBeenNthCalledWith(2, -1);
  });
});
