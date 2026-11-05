# jsanjuanjover.com

Personal site, CV and blog. Built with [Quarto](https://quarto.org), served by
Cloudflare Workers.

Live at <https://jsanjuanjover.com>.

## Local setup

Quarto is installed at `~/.local/opt/quarto` with a symlink in `~/.local/bin`.
The Python environment is managed with [uv](https://docs.astral.sh/uv/):

```bash
uv sync                  # create/refresh .venv from pyproject.toml
uv run quarto preview    # live preview at http://localhost:4200
uv run quarto render     # full build into _site/
```

Always render through `uv run`, so Quarto picks up the project's Python rather
than the system one.

## Writing a post

```bash
mkdir -p blog/posts/my-post-slug
$EDITOR blog/posts/my-post-slug/index.qmd
```

Front matter:

```yaml
---
title: "Post title"
description: >
  One or two sentences. This is what shows in the blog listing and in link
  previews when the post is shared.
date: 2026-10-01
categories: [Python, Machine learning]
---
```

Jupyter notebooks work too: drop an `.ipynb` in the same place instead of a
`.qmd`, with the same front matter in a raw first cell.

### The one rule that matters

**Commit `_freeze/` along with the post.** Code is executed locally and its
output stored there; CI renders from those stored results and never runs Python.
If you skip `_freeze/`, the published page loses its figures.

### Adding a project

Create `projects/<slug>/index.qmd` with `title`, `description`, `date` and
`categories`. It is picked up by the listing automatically. To give it a
thumbnail in the listing, add `image: cover.png` to the front matter — the
current pages have no images, which is the most obvious thing to improve.

## What is deliberately not in this repo

`data/` is git-ignored. It holds the source CV, which contains a personal phone
number, and this repository is public. The CV published by the site is generated
from `cv.qmd` and contains only the email address.

## The CV is a single source

`cv.qmd` renders twice from one file:

- `cv.html` — the page at `/cv.html`, indexable by search engines.
- `cv.pdf` — the download, produced with Typst (bundled with Quarto; no LaTeX
  installation needed).

Edit `cv.qmd` only. Both outputs update on the next render.

## Deployment

`.github/workflows/publish.yml` runs on every push to `main`:

1. Installs Quarto (pinned version) and renders the site into `_site/`.
2. Runs `wrangler deploy`, which reads `wrangler.jsonc` and uploads `_site/` to
   the `jsanjuanjover` Worker as static assets. There is no Worker script.

Nothing needs to be built by hand. The deploy needs two repository secrets
(Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — created from the *Edit Cloudflare Workers* template,
  scoped to this account and zone. Never commit it.
- `CLOUDFLARE_ACCOUNT_ID`

Wrangler is pinned in the workflow (`wranglerVersion`). The action's default is
an old Wrangler 3 that cannot deploy an assets-only Worker, so do not drop the
pin; bump it deliberately.

## Domain and DNS

The domain is registered at Cloudflare and its DNS lives there too.

- **`jsanjuanjover.com`** is attached to the Worker as a *Custom domain*
  (Worker → Settings → Domains & Routes). Cloudflare manages the DNS record and
  the certificate.
- **`www.jsanjuanjover.com`** is not attached to the Worker. A proxied DNS record
  plus a Redirect Rule (`https://www.jsanjuanjover.com/*` →
  `https://jsanjuanjover.com/${1}`, 301) sends it to the apex, so there is a
  single canonical URL.
- **Always Use HTTPS** is on (SSL/TLS → Edge Certificates).
- `site-url` in `_quarto.yml` must match the domain, or Open Graph previews and
  the sitemap point at the wrong address.

## Client subdomains

Every subdomain of `jsanjuanjover.com` is free to use. For `client-x`, one
repository per client, each with its own Worker:

1. Copy `wrangler.jsonc` and the workflow, changing `name` to the client's
   Worker name.
2. Attach `client-x.jsanjuanjover.com` to that Worker as a Custom domain.

Use a separate API token per project, scoped to the account and zone it needs,
so a leaked token cannot touch other sites.

A site that must not be public can be put behind a login with Cloudflare Access
(Zero Trust, free for small teams). Private repositories cost
nothing extra: the build runs in GitHub Actions and only the output reaches
Cloudflare.
