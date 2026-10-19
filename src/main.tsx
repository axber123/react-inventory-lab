import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
import App from "./App";
import { createQueryClient } from "@/lib/queryClient";

const queryClient = createQueryClient();

async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCK === "false") return;

  const { worker } = await import("@/mocks/browser");
  await worker.start({
    serviceWorker: {
      url: "/mockServiceWorker.js",
    },
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
});
