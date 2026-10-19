import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import Login from "@/pages/Login";
import { AuthProvider } from "@/context/AuthContext";

function renderLogin() {
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<h1>dashboard page</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

describe("Login", () => {
  it("validates short password before submitting", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.clear(screen.getByLabelText("密码"));
    await user.type(screen.getByLabelText("密码"), "123");
    await user.click(screen.getByRole("button", { name: "登录" }));

    expect(await screen.findByText("密码至少 6 位")).toBeInTheDocument();
  });

  it("logs in and redirects to dashboard", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.click(screen.getByRole("button", { name: "登录" }));

    expect(await screen.findByText("dashboard page")).toBeInTheDocument();
  });
});
