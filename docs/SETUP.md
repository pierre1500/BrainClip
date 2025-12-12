# Setup Guide

This guide provides detailed instructions for setting up BrainClip on your system.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Chrome Extension Setup](#chrome-extension-setup)
4. [Obsidian Integration](#obsidian-integration)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Docker Desktop** (v20.10+)
  - [Download for Windows](https://docs.docker.com/desktop/install/windows-install/)
  - [Download for Mac](https://docs.docker.com/desktop/install/mac-install/)
  - [Download for Linux](https://docs.docker.com/desktop/install/linux-install/)

- **Google Chrome** (latest version)
  - [Download Chrome](https://www.google.com/chrome/)

- **OpenAI API Key**
  - Sign up at [OpenAI Platform](https://platform.openai.com/)
  - Create an API key at [API Keys page](https://platform.openai.com/api-keys)
  - Ensure you have credits or a payment method set up

### Optional

- **Git** — For cloning the repository
- **Obsidian** — For viewing and managing your notes

---

## Backend Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/BrainClip.git
cd BrainClip
```

Or download and extract the ZIP file from GitHub.

### Step 2: Configure Environment Variables

1. Copy the example environment file:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Linux/Mac
cp .env.example .env
```

2. Open `.env` in your text editor and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=2000
DEBUG=false
```

> ⚠️ **Security Warning**: Never commit your `.env` file to version control!

### Step 3: Start the Docker Container

```bash
docker-compose up --build
```

Wait for the build to complete. You should see:

```
brainclip-api  | INFO:     Uvicorn running on http://0.0.0.0:8000
brainclip-api  | INFO:     Application startup complete.
```

### Step 4: Verify the Backend

Open your browser and navigate to:
- **Health Check**: http://localhost:8000/health
- **API Documentation**: http://localhost:8000/docs

---

## Chrome Extension Setup

### Step 1: Open Chrome Extensions Page

1. Open Google Chrome
2. Type `chrome://extensions/` in the address bar
3. Press Enter

### Step 2: Enable Developer Mode

Toggle the **Developer mode** switch in the top-right corner.

### Step 3: Load the Extension

1. Click **Load unpacked** button
2. Navigate to the BrainClip project folder
3. Select the `extension` folder
4. Click **Select Folder**

### Step 4: Pin the Extension

1. Click the puzzle piece icon (Extensions) in Chrome toolbar
2. Find **BrainClip** in the list
3. Click the pin icon to keep it visible

---

## Obsidian Integration

### Option 1: Open Vault Folder Directly

1. Open Obsidian
2. Click **Open folder as vault**
3. Navigate to `BrainClip/vault`
4. Click **Open**

### Option 2: Symlink to Existing Vault

If you have an existing Obsidian vault and want to include BrainClip notes:

```bash
# Windows (PowerShell as Admin)
New-Item -ItemType SymbolicLink -Path "C:\path\to\your\vault\BrainClip" -Target "C:\path\to\BrainClip\vault"

# Linux/Mac
ln -s /path/to/BrainClip/vault /path/to/your/vault/BrainClip
```

---

## Troubleshooting

### Backend Issues

#### "Connection refused" error

- Ensure Docker is running
- Check if the container is up: `docker-compose ps`
- Verify port 8000 is not in use: `netstat -an | findstr 8000`

#### "Invalid API key" error

- Verify your OpenAI API key in `.env`
- Ensure you have credits in your OpenAI account
- Check for extra spaces in the API key

#### Container won't start

```bash
# View logs
docker-compose logs

# Rebuild from scratch
docker-compose down
docker-compose up --build
```

### Extension Issues

#### Extension not working

- Ensure the backend is running
- Check the browser console (F12 → Console) for errors
- Verify the backend URL in extension settings

#### "Cannot clip browser pages"

This is expected — Chrome extensions cannot access `chrome://` URLs or other extension pages.

#### Content not extracting properly

Some pages with heavy JavaScript may not extract well. Try:
- Waiting for the page to fully load
- Refreshing the page before clipping

### Obsidian Issues

#### Notes not appearing

- Check the `vault/` folder directly — notes are organized by domain
- Ensure the backend has write permissions to the vault folder
- Look for error messages in Docker logs

---

## Running Without Docker (Development)

For development without Docker:

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate

# Activate (Linux/Mac)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
# Edit .env with your API key

# Run the server
uvicorn app.main:app --reload --port 8000
```

---

## Next Steps

- Read the [API Reference](API.md) to understand the backend
- Check out [Contributing](../CONTRIBUTING.md) to help improve BrainClip
- Start clipping and building your knowledge base!
