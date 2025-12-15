/* global chrome */
let activeTabId = null;
let startTime = null;

function saveTime(tabId, duration) {
  chrome.tabs.get(tabId, (tab) => {
    if (!tab || !tab.url) return;

    const url = new URL(tab.url);
    const domain = url.hostname;
    const today = new Date().toISOString().split("T")[0];

    chrome.storage.local.get(["screenTime"], (res) => {
      const data = res.screenTime || {};
      data[today] = data[today] || {};
      data[today][domain] = (data[today][domain] || 0) + duration;

      chrome.storage.local.set({ screenTime: data });
    });
  });
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
  const now = Date.now();

  if (activeTabId && startTime) {
    saveTime(activeTabId, now - startTime);
  }

  activeTabId = tabId;
  startTime = now;
});

chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE && activeTabId) {
    saveTime(activeTabId, Date.now() - startTime);
    activeTabId = null;
    startTime = null;
  }
});
