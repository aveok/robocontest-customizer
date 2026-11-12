// RC Theme background service worker.
//
// Dev-only reload hook: lets a script on the page reload the unpacked
// extension (chrome://extensions can't be automated). The page dispatches
//   document.dispatchEvent(new CustomEvent("rc-dev-reload"))
// content.js forwards it here, and we reload. Then reload the page to get
// the new content scripts and CSS.
//
// Store installs have update_url in the manifest; unpacked ones don't.
// The hook is ignored for store installs.
const isUnpacked = !("update_url" in chrome.runtime.getManifest());

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "rc-dev-reload" && isUnpacked) chrome.runtime.reload();
});
