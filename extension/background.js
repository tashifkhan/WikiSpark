// Background script for Wiki Spark Redirector
// Handles navigation events and redirects Wikipedia URLs

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  // Only process main frame navigation (not iframes)
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  
  // Check if it's a Wikipedia URL
  if (isWikipediaUrl(url)) {
    // Don't redirect if the request is already coming from wikispark.tashif.codes
    chrome.tabs.get(details.tabId, (tab) => {
      if (chrome.runtime.lastError) return;
      
      const referrer = tab.url ? new URL(tab.url) : null;
      
      // Skip redirect if coming from wikispark.tashif.codes
      if (referrer && referrer.hostname === 'wikispark.tashif.codes') {
        return;
      }
      
      const pageId = extractPageId(url);
      if (pageId) {
        const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${pageId}`;
        chrome.tabs.update(details.tabId, { url: wikiSparkUrl });
      }
    });
  }
}, {
  url: [
    { hostSuffix: '.wikipedia.org' }
  ]
});

function isWikipediaUrl(url) {
  return url.hostname.endsWith('.wikipedia.org');
}

function extractPageId(url) {
  // Extract page ID from Wikipedia URL
  // Handles various Wikipedia URL formats:
  // - https://en.wikipedia.org/wiki/Article_Name
  // - https://en.wikipedia.org/wiki/Article_Name?query=params
  // - https://en.wikipedia.org/wiki/Article_Name#section
  
  const pathParts = url.pathname.split('/');
  const wikiIndex = pathParts.findIndex(part => part === 'wiki');
  
  if (wikiIndex !== -1 && pathParts[wikiIndex + 1]) {
    return decodeURIComponent(pathParts[wikiIndex + 1]);
  }
  
  return null;
}

// Handle clicks on Wikipedia links in web pages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'redirectWikipediaLink') {
    const pageId = extractPageId(new URL(request.url));
    if (pageId) {
      const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${pageId}`;
      chrome.tabs.update(sender.tab.id, { url: wikiSparkUrl });
    }
  }
});
