# 🧠 BrainClip

**AI-powered web clipper for Obsidian** — Capture any web page and transform it into a structured knowledge note.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o-green.svg)](https://openai.com/)

## ✨ Features

- 📎 **One-Click Clipping** — Chrome extension button to capture any page
- 🤖 **AI-Powered Summaries** — GPT-4o extracts key insights and generates structured notes
- 📁 **Smart Organization** — Notes auto-organized by domain (github.com/, medium.com/, etc.)
- 📝 **Obsidian-Ready** — YAML frontmatter, tags, and proper Markdown formatting
- 🐳 **Dockerized Backend** — Easy deployment with Docker Compose
- 🌐 **Open Source** — Your research journey becomes part of the project

## 🏗️ Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Chrome         │     │  FastAPI        │     │  OpenAI         │
│  Extension      │────▶│  Backend        │────▶│  GPT-4o         │
│  (Readability)  │     │  (Docker)       │     │  API            │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │  Obsidian       │
                        │  Vault          │
                        │  (./vault/)     │
                        └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- [Google Chrome](https://www.google.com/chrome/) browser
- [OpenAI API Key](https://platform.openai.com/api-keys)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/BrainClip.git
cd BrainClip
```

### 2. Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-api-key-here
```

### 3. Start the Backend

```bash
docker-compose up --build
```

The API will be available at `http://localhost:8000`

### 4. Install the Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder from this project
5. Pin the BrainClip extension to your toolbar

### 5. Start Clipping!

1. Navigate to any web page you want to save
2. Click the 🧠 BrainClip icon
3. Click **"Clip this page"**
4. Your note will be saved to `vault/{domain}/`

## 📂 Project Structure

```
BrainClip/
├── extension/               # Chrome Extension
│   ├── manifest.json        # Extension configuration
│   ├── background.js        # Service worker
│   ├── popup/               # Extension popup UI
│   ├── options/             # Settings page
│   ├── lib/                 # Readability.js library
│   └── icons/               # Extension icons
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── config.py        # Settings management
│   │   ├── routers/         # API endpoints
│   │   └── services/        # Business logic
│   ├── Dockerfile
│   └── requirements.txt
├── vault/                   # Obsidian Vault (your notes!)
│   ├── github.com/
│   ├── medium.com/
│   └── ...
├── docs/                    # Documentation
├── docker-compose.yml
├── .env.example
└── README.md
```

## 📝 Note Format

Each clipped note includes:

```markdown
---
title: "Article Title"
source: "https://example.com/article"
author: "John Doe"
domain: "example.com"
date_clipped: 2025-12-11
tags:
  - ai
  - research
  - brainclip
summary: "A brief summary of the article..."
---

# Article Title

## Summary

AI-generated summary of the key points...

## Key Points

- First important takeaway
- Second important insight
- Third key learning

## Notes

Detailed content with proper formatting...

---

*Clipped from [example.com](https://example.com/article) on 2025-12-11*
```

## 🛠️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key (required) | - |
| `OPENAI_MODEL` | GPT model to use | `gpt-4o` |
| `OPENAI_MAX_TOKENS` | Max tokens for response | `2000` |
| `DEBUG` | Enable debug mode | `false` |

### Extension Settings

Click the extension icon → ⚙️ Settings to configure:
- **Backend URL**: Default is `http://localhost:8000`

## 📖 Documentation

- [Setup Guide](docs/SETUP.md) — Detailed installation instructions
- [API Reference](docs/API.md) — Backend API documentation
- [Contributing](CONTRIBUTING.md) — How to contribute to the project

## 🤝 Contributing

We welcome contributions! This project grows through community collaboration.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Share Your Research

Your clipped notes in `vault/` can become part of the project! Consider contributing valuable notes that others might find useful.

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [FastAPI](https://fastapi.tiangolo.com/) — Modern Python web framework
- [OpenAI](https://openai.com/) — GPT-4o for intelligent summarization
- [Obsidian](https://obsidian.md/) — Knowledge management inspiration

---

*Transform your web browsing into a knowledge base.*
