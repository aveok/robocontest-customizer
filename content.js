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
const tweaks = [markPath, hideLanguages, hideDuplicateBadges, hideEchoDescriptions, hideEmptyText];

const norm = (s) => s.replace(/\s+/g, " ").trim().toLowerCase();

function hide(el) {
  if (!el.hasAttribute("data-rc-hidden")) el.setAttribute("data-rc-hidden", "");
}

// Problem page shows "Oson" twice (difficulty + level tag with the same
// word). Hide a badge whose text repeats an earlier badge in the same row.
function hideDuplicateBadges() {
  for (const row of document.querySelectorAll('main :has(> [data-slot="badge"] + [data-slot="badge"])')) {
    const seen = new Set();
    for (const badge of row.querySelectorAll(':scope > [data-slot="badge"]')) {
      const text = norm(badge.textContent);
      if (seen.has(text)) hide(badge);
      else seen.add(text);
    }
  }
}

// Course/blog cards: a description that only repeats the title
// ("ACMP.RU sayti masalalari yechimi 1-qism" twice).
function hideEchoDescriptions() {
  for (const p of document.querySelectorAll("main :is(h2, h3) + p")) {
    const title = norm(p.previousElementSibling.textContent);
    const text = norm(p.textContent);
    const echo = text === title || (Math.min(text.length, title.length) >= 12 && (title.startsWith(text) || text.startsWith(title)));
    if (text && echo) hide(p);
  }
}

// Placeholder text like a "." bio under a profile name.
function hideEmptyText() {
  for (const p of document.querySelectorAll("main p")) {
    if (!p.children.length && /^[.\-–—\s]+$/.test(p.textContent) && p.textContent.trim()) hide(p);
  }
}

// Expose the current path to CSS for page-specific rules, e.g.
// html[data-rc-path="/tasks"] (no trailing slash, query string ignored).
function markPath() {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (root.dataset.rcPath !== path) root.dataset.rcPath = path;
}

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

// ---------- Light/dark switch (driven from the popup) ----------
// The site's only switch is in the "Maxsus imkoniyatlar" popover, which
// theme.css hides. Switching through that popover (not by toggling html.dark
// ourselves) keeps the site's own state in sync: cookie, localStorage, the
// logged-in user's saved preference, and Inertia/back-button navigation.
// The trigger is display:none but .click() still opens it; html.rc-switching
// hides the popover while it is open.

const PALETTE = "header button:has(> svg.lucide-palette)";

function waitFor(selector, timeout = 1500) {
  return new Promise((resolve) => {
    const start = performance.now();
    (function poll() {
      const el = document.querySelector(selector);
      if (el || performance.now() - start > timeout) return resolve(el);
      setTimeout(poll, 16); // not rAF: it stalls while the tab is hidden
    })();
  });
}

function waitForGone(selector, timeout = 1500) {
  return new Promise((resolve) => {
    const start = performance.now();
    (function poll() {
      if (!document.querySelector(selector) || performance.now() - start > timeout) return resolve();
      setTimeout(poll, 16);
    })();
  });
}

async function setDark(dark) {
  if (root.classList.contains("dark") === dark) return;
  const trigger = document.querySelector(PALETTE);
  if (!trigger) throw new Error("palette button not found");

  // Keep the site's palette family (Classic or default), only flip light/dark.
  const classic = (root.dataset.ui || "").startsWith("classic");
  const value = classic ? (dark ? "classic-dark" : "classic") : dark ? "dark" : "light";

  root.classList.add("rc-switching");
  try {
    trigger.click();
    const option = await waitFor(`[role="dialog"] button[role="radio"][value="${value}"]`);
    if (!option) throw new Error(`theme option "${value}" not found`);
    option.click();
    // The site may apply the class inside a View Transition callback (async).
    await waitFor(dark ? "html.dark" : "html:not(.dark)");
  } finally {
    if (trigger.getAttribute("aria-expanded") === "true") trigger.click();
    // Stay hidden until the popover is unmounted (no flash while it closes).
    await waitForGone("[data-reka-popper-content-wrapper] [role='dialog']");
    root.classList.remove("rc-switching");
  }
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "get-dark") {
    sendResponse({ dark: root.classList.contains("dark") });
  } else if (msg?.type === "set-dark") {
    setDark(msg.dark === true)
      .catch((err) => console.warn("[rc-theme] theme switch failed", err))
      .finally(() => sendResponse({ dark: root.classList.contains("dark") }));
    return true; // async response
  }
});

// Dev reload hook, see background.js (no-op for store installs).
document.addEventListener("rc-dev-reload", () => {
  chrome.runtime.sendMessage({ type: "rc-dev-reload" });
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
