# Contributing to BrainClip

Thank you for your interest in contributing! This document explains how to contribute safely and effectively.

### The `vault/` folder is git-ignored

Your personal notes stay local. The `.gitignore` excludes `vault/` by default. This protects your privacy and prevents accidental copyright violations.

---

## ✅ What You CAN Contribute

| Type | Description |
|------|-------------|
| **Code** | Bug fixes, features, refactoring, performance improvements |
| **Documentation** | README, guides, API docs, comments |
| **Tests** | Unit tests, integration tests, edge cases |
| **Prompts/Templates** | Improvements to the GPT prompt in `openai_service.py` |
| **Bug Reports** | Reproducible issues with clear steps |
| **Feature Requests** | Ideas discussed in Issues before implementation |

---

## How to Contribute

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/BrainClip.git
cd BrainClip
```

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Add tests for new functionality
- Update documentation if needed

### 4. Run Tests Locally

```bash
cd backend
pip install -r requirements.txt
pip install pytest pytest-asyncio httpx

pytest tests/ -v
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: add your feature description"
git push origin feature/your-feature-name
```

### 6. Open a Pull Request

- Describe what you changed and why
- Reference any related issues
- Wait for review

---

## How to Create a Reproducible Bug Report

Good bug reports help us fix issues faster. Include:

1. **Environment**: OS, Python version, Docker version, Chrome version
2. **Steps to reproduce**: Numbered list, as specific as possible
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Error messages**: Full stack traces, console output
6. **Screenshots**: If relevant (UI issues)

### Bug Report Template

```markdown
**Environment**
- OS: Windows 11 / macOS 14 / Ubuntu 22.04
- Python: 3.11.x
- Docker: 24.x
- Chrome: 120.x

**Steps to Reproduce**
1. Go to [URL]
2. Click BrainClip icon
3. Click "Send to Brain"

**Expected**: Note saved successfully
**Actual**: Error message "Connection refused"

**Logs**:
```
[paste docker-compose logs output]
```
```

---

## Questions?

- Open a [Discussion](../../discussions) for general questions
- Open an [Issue](../../issues) for bugs or feature requests
- Check existing issues before creating new ones

Thank you for helping make BrainClip better! 🧠
