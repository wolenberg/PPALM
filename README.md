# PPALM

Power Platform Application Lifecycle Management

Open Source framework for Power Platform ALM using GitHub Actions, Power Platform CLI and governance-first practices.

---

## Why PPALM?

Organizations adopting Power Platform often face challenges with:

- Manual solution deployments
- Environment inconsistencies
- Connection Reference management
- Environment Variable management
- Missing governance controls
- Limited ALM maturity
- Difficult rollback strategies

PPALM aims to provide a lightweight, open-source and community-driven ALM framework built specifically for Power Platform.

---

## Vision

Our vision is to make Power Platform ALM accessible to every team, regardless of size or DevOps maturity level.

We believe Power Platform solutions should be:

- Version controlled
- Deployable
- Testable
- Governed
- Observable

---

## Architecture

Developer
    ↓

Power Platform
    ↓

PAC CLI
    ↓

GitHub
    ↓

Validation Engine
    ↓

TEST
    ↓

Approval
    ↓

PROD

---

## Current Status

Current Version:

v0.1.0-alpha

Project Stage:

✅ Solution Export
✅ Solution Unpack
✅ Git Versioning

🚧 Validation Engine

🚧 Test Deployment

🚧 Production Deployment

---

## Roadmap

### v0.1

- Export Solution
- Unpack Solution
- Git Integration

### v0.2

- GitHub Actions
- Automated Deployment
- Environment Variables Support

### v0.3

- Connection Reference Validation
- Governance Rules
- Security Validation

### v0.4

- AI-Powered Analysis
- Solution Quality Scoring
- Recommendations Engine

---

## Local Development

Requirements:

- Power Platform CLI
- Git
- Node.js

---

## Export Solution

```bash
pac solution export \
  --name PPALMCore \
  --path ./exports/PPALMCore.zip
```

---

## Unpack Solution

```bash
pac solution unpack \
  --zipfile ./exports/PPALMCore.zip \
  --folder ./solutions/PPALMCore
```

---

## Project Structure

```text
PPALM
│
├── exports
├── solutions
├── scripts
├── docs
├── .github
└── README.md
```

---

## Contributing

Contributions are welcome.

Feel free to open:

- Issues
- Pull Requests
- Feature Requests

---

## License

Apache License 2.0
