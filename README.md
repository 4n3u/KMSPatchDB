# KMSPatchDB

Web archive for MapleStory KMS (Live) and KMST (Test) official CDN patch files.

## Getting Started

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Manual Patch Scan

```bash
# Scan Nexon CDN and update local database
python scripts/update_patches.py
```

---

## Deployment Setup

1. Go to repository **Settings** &rarr; **Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Under **Settings** &rarr; **Actions** &rarr; **General** &rarr; **Workflow permissions**, select **Read and write permissions**.
