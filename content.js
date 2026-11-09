// RC Theme content script.
//
// All CSS in styles/ is scoped under `html.rc-theme`, so toggling that one
// class turns the whole theme on or off without reloading the page.
//
// The site is an Inertia.js SPA: pages swap without a full reload. CSS keeps
// working by itself; DOM tweaks (tweaks[] below) are re-run on every
// `inertia:navigate` event and, as a fallback, on DOM mutations.

const CLASS = "rc-theme";
const root = document.documentElement;

// Add the class synchronously (document_start) so the page never flashes the
// original design; remove it right after if the user switched the theme off.
root.classList.add(CLASS);

let enabled = true;

/**
 * DOM tweaks: each one runs on load and after every page change.
 * Must be idempotent (safe to run many times on the same DOM).
 * Example:
 *   () => document.querySelector("footer")?.setAttribute("hidden", "")
 */
const tweaks = [hideLanguages];

// Language codes to hide from the language menu ("Özbekça" = uz).
// "O'zbekcha" (uzl) stays.
const HIDDEN_LANGUAGES = ["uz"];

// Menu item: <div role="menuitemcheckbox">…Özbekça<span>uz</span></div>
// The code is the item's last child element; CSS shows it uppercased.
function hideLanguages() {
  for (const item of document.querySelectorAll('[role="menuitemcheckbox"]')) {
    const code = item.lastElementChild?.textContent.trim().toLowerCase();
    if (HIDDEN_LANGUAGES.includes(code)) item.setAttribute("data-rc-hidden", "");
  }
}

function runTweaks() {
  if (!enabled || !document.body) return;
  for (const tweak of tweaks) {
    try {
      tweak();
    } catch (err) {
      console.warn("[rc-theme] tweak failed", err);
    }
  }
}

function setEnabled(value) {
  enabled = value !== false;
  root.classList.toggle(CLASS, enabled);
  runTweaks();
}

chrome.storage.sync.get({ enabled: true }, (s) => setEnabled(s.enabled));

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && "enabled" in changes) setEnabled(changes.enabled.newValue);
});

// Inertia fires this on document after each client-side page visit.
document.addEventListener("inertia:navigate", runTweaks);

// Fallback for content rendered later (dialogs, lazy chunks, judge SPA).
let pending = false;
const observer = new MutationObserver(() => {
  if (pending || tweaks.length === 0) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    runTweaks();
  });
});

document.addEventListener("DOMContentLoaded", () => {
  runTweaks();
  observer.observe(document.body, { childList: true, subtree: true });
});
