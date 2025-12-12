/**
 * Readability.js - Simplified content extraction library
 * Based on Mozilla's Readability algorithm
 * https://github.com/mozilla/readability
 * 
 * This is a simplified version for BrainClip extension
 */

(function(global) {
  'use strict';

  // Elements that are unlikely to contain useful content
  const UNLIKELY_CANDIDATES = /banner|breadcrumb|combx|comment|community|cover-wrap|disqus|extra|footer|gdpr|header|legends|menu|related|remark|replies|rss|shoutbox|sidebar|skyscraper|social|sponsor|supplemental|ad-break|agegate|pagination|pager|popup|yom-hierarchical-nav|cookie|consent/i;

  // Elements that might be content despite matching unlikely patterns
  const MAYBE_CANDIDATES = /and|article|body|column|content|main|shadow/i;

  // Positive indicators of content
  const POSITIVE_PATTERNS = /article|body|content|entry|hentry|h-entry|main|page|pagination|post|text|blog|story/i;

  // Negative indicators
  const NEGATIVE_PATTERNS = /hidden|^hid$|hid$|hid |^hid |banner|combx|comment|com-|contact|foot|footer|footnote|gdpr|masthead|media|meta|outbrain|promo|related|scroll|share|shoutbox|sidebar|skyscraper|sponsor|shopping|tags|tool|widget|cookie/i;

  /**
   * Readability constructor
   */
  function Readability(doc, options) {
    this._doc = doc;
    this._options = options || {};
    this._articleTitle = null;
    this._articleByline = null;
    this._articleSiteName = null;
  }

  Readability.prototype = {
    /**
     * Parse the document and extract article content
     */
    parse: function() {
      // Get metadata
      const metadata = this._getArticleMetadata();
      this._articleTitle = metadata.title;
      this._articleByline = metadata.byline;
      this._articleSiteName = metadata.siteName;

      // Find the main content
      const articleContent = this._grabArticle();
      
      if (!articleContent) {
        return null;
      }

      const textContent = this._getTextContent(articleContent);
      const excerpt = this._getExcerpt(metadata, textContent);

      return {
        title: this._articleTitle,
        byline: this._articleByline,
        siteName: this._articleSiteName,
        content: articleContent.innerHTML,
        textContent: textContent,
        length: textContent.length,
        excerpt: excerpt
      };
    },

    /**
     * Extract metadata from document
     */
    _getArticleMetadata: function() {
      const metadata = {
        title: '',
        byline: '',
        excerpt: '',
        siteName: ''
      };

      // Get title
      const ogTitle = this._doc.querySelector('meta[property="og:title"]');
      const twitterTitle = this._doc.querySelector('meta[name="twitter:title"]');
      
      if (ogTitle) {
        metadata.title = ogTitle.getAttribute('content');
      } else if (twitterTitle) {
        metadata.title = twitterTitle.getAttribute('content');
      } else {
        metadata.title = this._doc.title || '';
        // Clean up title
        const titleParts = metadata.title.split(/[\|\-–—]/);
        if (titleParts.length > 1) {
          metadata.title = titleParts[0].trim();
        }
      }

      // Get author/byline
      const author = this._doc.querySelector('meta[name="author"]');
      const ogAuthor = this._doc.querySelector('meta[property="article:author"]');
      
      if (author) {
        metadata.byline = author.getAttribute('content');
      } else if (ogAuthor) {
        metadata.byline = ogAuthor.getAttribute('content');
      }

      // Get description/excerpt
      const description = this._doc.querySelector('meta[name="description"]');
      const ogDescription = this._doc.querySelector('meta[property="og:description"]');
      
      if (ogDescription) {
        metadata.excerpt = ogDescription.getAttribute('content');
      } else if (description) {
        metadata.excerpt = description.getAttribute('content');
      }

      // Get site name
      const ogSiteName = this._doc.querySelector('meta[property="og:site_name"]');
      if (ogSiteName) {
        metadata.siteName = ogSiteName.getAttribute('content');
      } else {
        metadata.siteName = this._doc.location ? this._doc.location.hostname : '';
      }

      return metadata;
    },

    /**
     * Find and extract the main article content
     */
    _grabArticle: function() {
      // Try to find article element first
      let article = this._doc.querySelector('article');
      if (article && this._getTextContent(article).length > 200) {
        return article.cloneNode(true);
      }

      // Try common content containers
      const contentSelectors = [
        '[role="main"]',
        'main',
        '.post-content',
        '.article-content',
        '.entry-content',
        '.content',
        '#content',
        '.post',
        '.article',
        '#article'
      ];

      for (const selector of contentSelectors) {
        const element = this._doc.querySelector(selector);
        if (element && this._getTextContent(element).length > 200) {
          return element.cloneNode(true);
        }
      }

      // Fallback: score all paragraphs and find best container
      const candidates = this._getCandidates();
      if (candidates.length > 0) {
        // Sort by score descending
        candidates.sort((a, b) => b.score - a.score);
        return candidates[0].element.cloneNode(true);
      }

      // Last resort: return body
      return this._doc.body ? this._doc.body.cloneNode(true) : null;
    },

    /**
     * Score elements to find best content candidates
     */
    _getCandidates: function() {
      const candidates = [];
      const paragraphs = this._doc.querySelectorAll('p');

      paragraphs.forEach(p => {
        const parent = p.parentElement;
        if (!parent) return;

        const text = this._getTextContent(p);
        if (text.length < 25) return;

        // Find or create candidate for parent
        let candidate = candidates.find(c => c.element === parent);
        if (!candidate) {
          candidate = { element: parent, score: this._getInitialScore(parent) };
          candidates.push(candidate);
        }

        // Score based on paragraph content
        candidate.score += 1;
        candidate.score += Math.min(Math.floor(text.length / 100), 3);

        // Bonus for commas (indicates complex content)
        candidate.score += (text.match(/,/g) || []).length;
      });

      return candidates;
    },

    /**
     * Get initial score for an element based on tag and attributes
     */
    _getInitialScore: function(element) {
      let score = 0;
      const tagName = element.tagName.toLowerCase();
      const className = element.className || '';
      const id = element.id || '';

      // Tag-based scoring
      switch (tagName) {
        case 'article':
          score += 10;
          break;
        case 'section':
          score += 5;
          break;
        case 'div':
          score += 5;
          break;
      }

      // Class/ID based scoring
      if (POSITIVE_PATTERNS.test(className) || POSITIVE_PATTERNS.test(id)) {
        score += 25;
      }
      if (NEGATIVE_PATTERNS.test(className) || NEGATIVE_PATTERNS.test(id)) {
        score -= 25;
      }

      return score;
    },

    /**
     * Get text content of an element
     */
    _getTextContent: function(element) {
      if (!element) return '';
      
      // Clone and remove unwanted elements
      const clone = element.cloneNode(true);
      const unwanted = clone.querySelectorAll('script, style, nav, header, footer, aside, .ad, .advertisement, .social-share');
      unwanted.forEach(el => el.remove());
      
      return (clone.textContent || '').replace(/\s+/g, ' ').trim();
    },

    /**
     * Get excerpt from metadata or content
     */
    _getExcerpt: function(metadata, textContent) {
      if (metadata.excerpt) {
        return metadata.excerpt;
      }
      // Return first 200 characters of content
      return textContent.substring(0, 200).trim() + (textContent.length > 200 ? '...' : '');
    }
  };

  // Export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Readability;
  } else {
    global.Readability = Readability;
  }

})(typeof window !== 'undefined' ? window : this);
