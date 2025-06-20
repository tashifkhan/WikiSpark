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

  function shouldRedirectToWikipedia(pageId) {
    if (!pageId) return true;
    
    // Check if this is non-article content that should stay on Wikipedia
    const nonArticleNamespaces = [
      'File:', 'Image:', 'Media:', 'Category:', 'Template:', 'Help:', 
      'Portal:', 'User:', 'Wikipedia:', 'Special:', 'Talk:', 'User_talk:', 
      'Wikipedia_talk:', 'File_talk:', 'MediaWiki:', 'MediaWiki_talk:',
      'Template_talk:', 'Help_talk:', 'Category_talk:', 'Portal_talk:',
      'Module:', 'Module_talk:', 'TimedText:', 'TimedText_talk:'
    ];
    
    return nonArticleNamespaces.some(namespace => 
      pageId.startsWith(namespace) || pageId.includes(':' + namespace.replace(':', ''))
    );
  }

  function handleClick(event) {
    const target = event.target.closest('a');
    if (!target || !target.href) return;

    if (isWikipediaUrl(target.href)) {
      const pageId = extractPageId(target.href);
      
      // If it's non-article content or we can't extract page ID, let it go to Wikipedia
      if (!pageId || shouldRedirectToWikipedia(pageId)) {
        return; // Let the normal Wikipedia link work
      }
      
      // Only redirect article content to WikiSpark
      event.preventDefault();
      event.stopPropagation();
      
      const wikiSparkUrl = `https://wikispark.tashif.codes/wiki/${encodeURIComponent(pageId)}`;
      window.location.href = wikiSparkUrl;
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
