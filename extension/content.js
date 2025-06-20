// Content script for Wiki Spark Redirector
// Intercepts clicks on Wikipedia links and redirects them

(function() {
  'use strict';

  // Don't run on wikispark.tashif.codes
  if (window.location.hostname === 'wikispark.tashif.codes') {
    return;
  }

  function isWikipediaUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.endsWith('.wikipedia.org');
    } catch (e) {
      return false;
    }
  }

  function extractPageId(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      const wikiIndex = pathParts.findIndex(part => part === 'wiki');
      
      if (wikiIndex !== -1 && pathParts[wikiIndex + 1]) {
        return decodeURIComponent(pathParts[wikiIndex + 1]);
      }
    } catch (e) {
      console.error('Error extracting page ID:', e);
    }
    
    return null;
  }

  function handleClick(event) {
    const target = event.target.closest('a');
    if (!target || !target.href) return;

    if (isWikipediaUrl(target.href)) {
      event.preventDefault();
      event.stopPropagation();
      
      const pageId = extractPageId(target.href);
      if (pageId) {
        const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${pageId}`;
        window.location.href = wikiSparkUrl;
      }
    }
  }

  // Add click listener to intercept Wikipedia links
  document.addEventListener('click', handleClick, true);

  // Also handle dynamically added links
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const links = node.querySelectorAll ? node.querySelectorAll('a[href*="wikipedia.org"]') : [];
          if (node.tagName === 'A' && node.href && isWikipediaUrl(node.href)) {
            // The added node itself is a Wikipedia link
            return; // Event listener will handle it
          }
        }
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

})();
