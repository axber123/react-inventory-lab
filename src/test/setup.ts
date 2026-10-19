import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "@/mocks/server";
import { resetInventories } from "@/mocks/db";

beforeAll(() => server.listen());

afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.localStorage.clear();
  resetInventories();
});

afterAll(() => server.close());
