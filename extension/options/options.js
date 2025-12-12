/**
 * BrainClip - Options Script
 * Handles saving and loading extension settings
 */

const backendUrlInput = document.getElementById('backend-url');
const saveBtn = document.getElementById('save-btn');
const testBtn = document.getElementById('test-btn');
const status = document.getElementById('status');

const connectionPill = document.getElementById('connection-pill');
const connectionPillText = document.getElementById('connection-pill-text');

const DEFAULT_BACKEND_URL = 'http://localhost:8000';

/**
 * Load saved settings
 */
async function loadSettings() {
  const result = await chrome.storage.sync.get(['backendUrl']);
  backendUrlInput.value = result.backendUrl || DEFAULT_BACKEND_URL;
  setPill('neutral', 'Not tested');
}

/**
 * Save settings
 */
async function saveSettings() {
  const backendUrl = backendUrlInput.value.trim() || DEFAULT_BACKEND_URL;
  
  try {
    // Validate URL format
    new URL(backendUrl);
    
    await chrome.storage.sync.set({ backendUrl });
    
    showStatus('Saved. You can test the connection now.', 'success');
    setPill('neutral', 'Not tested');
  } catch (err) {
    showStatus('Invalid URL format', 'error');
    setPill('bad', 'Invalid URL');
  }
}

/**
 * Show status message
 */
function showStatus(message, type) {
  status.textContent = message;
  status.className = `status ${type}`;
  status.classList.remove('hidden');
  
  setTimeout(() => {
    status.className = 'status hidden';
  }, 3000);
}

function setPill(state, text) {
  if (!connectionPill || !connectionPillText) return;
  connectionPill.classList.remove('ok', 'bad');
  if (state === 'ok') connectionPill.classList.add('ok');
  if (state === 'bad') connectionPill.classList.add('bad');
  connectionPillText.textContent = text;
}

async function testConnection() {
  const backendUrl = backendUrlInput.value.trim() || DEFAULT_BACKEND_URL;

  try {
    new URL(backendUrl);
  } catch {
    showStatus('Invalid URL format', 'error');
    setPill('bad', 'Invalid URL');
    return;
  }

  testBtn.disabled = true;
  setPill('neutral', 'Testing…');

  try {
    const res = await fetch(`${backendUrl}/health`, { method: 'GET' });
    if (!res.ok) throw new Error('Health check failed');
    setPill('ok', 'Connected');
    showStatus('Backend is reachable.', 'success');
  } catch (err) {
    setPill('bad', 'Offline');
    showStatus('Could not reach backend. Is Docker running and port 8000 open?', 'error');
  } finally {
    testBtn.disabled = false;
  }
}

// Event listeners
saveBtn.addEventListener('click', saveSettings);
testBtn.addEventListener('click', testConnection);

// Load settings on page load
document.addEventListener('DOMContentLoaded', loadSettings);
