import { QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Inventory from "@/pages/Inventory";
import { createQueryClient } from "@/lib/queryClient";

function renderInventory() {
  render(
    <QueryClientProvider client={createQueryClient()}>
      <MemoryRouter>
        <Inventory />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Inventory", () => {
  it("loads data and filters by keyword", async () => {
    const user = userEvent.setup();
    renderInventory();

    expect(await screen.findByText("不锈钢螺栓 M8×30")).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText(/搜索物料编号/), "伺服");
    await user.click(screen.getByRole("button", { name: "查询" }));

    expect(await screen.findByText("伺服电机 750W")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText("不锈钢螺栓 M8×30")).not.toBeInTheDocument();
    });
  });
});
