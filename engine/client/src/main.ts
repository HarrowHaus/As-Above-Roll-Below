import * as PhaserRuntime from "phaser";
import "./style.css";
import StartGame from "./game/main.js";

// Some scene code still references the Phaser namespace at runtime for geometry helpers.
// TypeScript understands that namespace through Phaser's declarations, but an ES-module
// bundle does not guarantee a global `Phaser` binding. Expose the imported runtime until
// those remaining namespace references are migrated to direct imports.
(globalThis as typeof globalThis & { Phaser?: typeof PhaserRuntime }).Phaser = PhaserRuntime;

function showRuntimeCrash(error: unknown): void {
  const existing = document.getElementById("aarb-runtime-crash");
  if (existing) return;
  const panel = document.createElement("div");
  panel.id = "aarb-runtime-crash";
  panel.style.cssText = [
    "position:fixed",
    "inset:0",
    "z-index:99999",
    "background:#0b0e12",
    "color:#eee6d5",
    "padding:24px",
    "font:14px/1.45 ui-monospace,monospace",
    "overflow:auto",
    "white-space:pre-wrap",
  ].join(";");
  const message = error instanceof Error ? `${error.name}: ${error.message}\n\n${error.stack ?? ""}` : String(error);
  panel.textContent = `AARB RUNTIME ERROR\n\n${message}`;
  document.body.appendChild(panel);
}

window.addEventListener("error", (event) => showRuntimeCrash(event.error ?? event.message));
window.addEventListener("unhandledrejection", (event) => showRuntimeCrash(event.reason));

try {
  StartGame("game-container");
} catch (error) {
  showRuntimeCrash(error);
  throw error;
}
