const checkbox = document.getElementById("enabled");

chrome.storage.sync.get({ enabled: true }, (s) => {
  checkbox.checked = s.enabled;
});

checkbox.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: checkbox.checked });
});

// Light/dark lives on the site (cookie + account setting), not in the
// extension: ask the content script in the active tab to read/switch it.
// Any non-robocontest tab has no content script, so sendMessage fails there.
const dark = document.getElementById("dark");
const darkHint = document.getElementById("dark-hint");

chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  if (!tab) return (darkHint.hidden = false);
  chrome.tabs.sendMessage(tab.id, { type: "get-dark" }, (res) => {
    if (chrome.runtime.lastError || !res) return (darkHint.hidden = false);
    dark.checked = res.dark;
    dark.disabled = false;
  });

  dark.addEventListener("change", () => {
    dark.disabled = true;
    chrome.tabs.sendMessage(tab.id, { type: "set-dark", dark: dark.checked }, (res) => {
      if (chrome.runtime.lastError || !res) return (darkHint.hidden = false);
      dark.checked = res.dark;
      dark.disabled = false;
    });
  });
});
