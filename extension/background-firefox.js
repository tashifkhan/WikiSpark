// Background script for Wiki Spark Redirector (Firefox compatible)
// Handles navigation events and redirects Wikipedia URLs

// Use browser API for Firefox compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

browserAPI.webNavigation.onBeforeNavigate.addListener((details) => {
  // Only process main frame navigation (not iframes)
  if (details.frameId !== 0) return;

  const url = new URL(details.url);
  
  // Check if it's a Wikipedia URL
  if (isWikipediaUrl(url)) {
    // Don't redirect if the request is already coming from wikispark.tashif.codes
    browserAPI.tabs.get(details.tabId).then((tab) => {
      const referrer = tab.url ? new URL(tab.url) : null;
      
      // Skip redirect if coming from wikispark.tashif.codes
      if (referrer && referrer.hostname === 'wikispark.tashif.codes') {
        return;
      }
      
      const pageId = extractPageId(url);
      if (pageId) {
        const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${pageId}`;
        browserAPI.tabs.update(details.tabId, { url: wikiSparkUrl });
      }
    }).catch((error) => {
      console.error('Error getting tab info:', error);
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
browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'redirectWikipediaLink') {
    const pageId = extractPageId(new URL(request.url));
    if (pageId) {
      const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${pageId}`;
      browserAPI.tabs.update(sender.tab.id, { url: wikiSparkUrl });
    }
  }
});
