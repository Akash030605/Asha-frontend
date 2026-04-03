import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const MIN_DISPLAY_MS = 1200;
const startTime = performance.now();

createRoot(document.getElementById("root")!).render(<App />);

requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader) preloader.classList.add("hidden");
    }, remaining);
  });
});
