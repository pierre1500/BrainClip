/**
 * BrainClip - Background Service Worker
 * Handles communication between popup, content scripts, and the backend API
 */

// Default backend URL
const DEFAULT_BACKEND_URL = 'http://localhost:8000';

/**
 * Get the backend URL
 */
async function getBackendUrl() {
  return DEFAULT_BACKEND_URL;
}

/**
 * Send clipped content to the backend API
 */
async function sendToBackend(clipData) {
  const backendUrl = await getBackendUrl();
  
  const response = await fetch(`${backendUrl}/api/clip`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(clipData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to save clip');
  }

  return await response.json();
}

/**
 * Listen for messages from popup or content scripts
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clip') {
    sendToBackend(message.data)
      .then((result) => sendResponse({ success: true, data: result }))
      .catch((error) => sendResponse({ success: false, error: error.message }));
    return true; // Keep channel open for async response
  }
  
  if (message.action === 'getBackendUrl') {
    getBackendUrl()
      .then((url) => sendResponse({ url }))
      .catch((error) => sendResponse({ error: error.message }));
    return true;
  }
});

// Log when service worker starts
console.log('BrainClip service worker started');
