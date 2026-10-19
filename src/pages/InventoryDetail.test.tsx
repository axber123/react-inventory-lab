import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import InventoryDetail from "@/pages/InventoryDetail";
import { createQueryClient } from "@/lib/queryClient";

function renderDetail() {
  render(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter initialEntries={["/inventory/100004"]}>
        <Routes>
          <Route path="/inventory/:id" element={<InventoryDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("InventoryDetail", () => {
  it("loads the routed inventory and adjusts stock optimistically", async () => {
    const user = userEvent.setup();
    renderDetail();

    expect(await screen.findByText("同步带 HTD-5M")).toBeInTheDocument();
    expect(screen.getByText("8 条")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /增加 同步带 HTD-5M 库存/ }));

    expect(await screen.findByText("9 条")).toBeInTheDocument();
  });
});
