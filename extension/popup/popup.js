/**
 * BrainClip - Minimalist Popup Script
 */

const clipBtn = document.getElementById('clip-btn');
const btnText = document.getElementById('btn-text');
const icon = document.querySelector('.icon');

async function extractPageContent() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) throw new Error('No tab');

  if (tab.url.startsWith('chrome://')) throw new Error('System page');

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['lib/Readability.js']
  });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      try {
        const documentClone = document.cloneNode(true);
        const reader = new Readability(documentClone);
        const article = reader.parse();
        return article ? {
          url: window.location.href,
          title: article.title || document.title,
          content: article.textContent || '',
          excerpt: article.excerpt || '',
          siteName: article.siteName || window.location.hostname,
          length: article.length || 0
        } : null;
      } catch { return null; }
    }
  });

  if (results && results[0] && results[0].result) {
    return results[0].result;
  }
  throw new Error('Extraction failed');
}

async function handleClip() {
  if (clipBtn.classList.contains('loading') || clipBtn.classList.contains('success')) return;

  // Set Loading State
  clipBtn.classList.add('loading');
  btnText.textContent = 'PROCESSING...';
  icon.textContent = '⏳';

  try {
    // 1. Extract
    const content = await extractPageContent();
    
    // 2. Send
    const response = await chrome.runtime.sendMessage({
      action: 'clip',
      data: content
    });

    if (response.success) {
      // Success State
      clipBtn.classList.remove('loading');
      clipBtn.classList.add('success');
      btnText.textContent = 'SAVED';
      icon.textContent = '✓';
      
      // Close after delay
      setTimeout(() => window.close(), 1500);
    } else {
      throw new Error(response.error);
    }
  } catch (err) {
    // Error State
    clipBtn.classList.remove('loading');
    clipBtn.classList.add('error');
    btnText.textContent = 'ERROR';
    icon.textContent = '✕';
    console.error(err);
    
    // Reset after delay
    setTimeout(() => {
      clipBtn.classList.remove('error');
      btnText.textContent = 'SEND TO BRAIN';
      icon.textContent = '⚡';
    }, 2000);
  }
}

clipBtn.addEventListener('click', handleClip);
