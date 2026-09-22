# jsanjuanjover.github.io

Personal site, CV and blog. Built with [Quarto](https://quarto.org), published to
GitHub Pages.

Live at <https://jsanjuanjover.github.io>.

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

`.github/workflows/publish.yml` runs on every push to `main`: it installs
Quarto, renders, and pushes the result to the `gh-pages` branch, which Pages
serves. Nothing needs to be built by hand.

---

## Moving to a custom domain

When the domain is bought, three steps:

1. **DNS at the registrar.** For an apex domain (`jsanjuan.dev`), create four
   `A` records pointing at GitHub's Pages IPs (`185.199.108.153`,
   `185.199.109.153`, `185.199.110.153`, `185.199.111.153`), plus a `CNAME`
   record for `www` pointing at `jsanjuanjover.github.io.`.
2. **In this repo.** Settings → Pages → Custom domain. GitHub writes a `CNAME`
   file to the `gh-pages` branch. Wait for the certificate, then tick *Enforce
   HTTPS*.
3. **Update `site-url`** in `_quarto.yml`, or Open Graph previews and the
   sitemap will keep pointing at the old address.

### Verify the domain on GitHub

Do this as soon as the domain is bought: Settings → Pages → Verify domain adds a
`_github-pages-challenge-jsanjuanjover` TXT record. Until it is verified, anyone
with a GitHub account can claim an unused subdomain of your domain that points
at Pages. It costs one DNS record.

## Client subdomains

For `client-x.jsanjuan.dev`, one repository per client:

1. DNS: a `CNAME` record for `client-x` pointing at `jsanjuanjover.github.io.`
2. In the client repo: Settings → Pages → Custom domain `client-x.jsanjuan.dev`.

Subdomains of the same domain can live in different repositories without
conflicting with this site. Two limits worth knowing before promising anything
to a client:

- **Wildcards do not exist on GitHub Pages.** Every subdomain needs its own DNS
  record and its own repository. Fine for a handful of clients, tedious at scale.
- **A Pages site is always public**, even when its repository is private — and
  Pages on a private repository requires GitHub Pro. There is no password
  protection.

### When a client site must not be public

Use [Cloudflare Pages](https://pages.cloudflare.com/) instead: private
repositories at no cost, wildcard subdomains, and access control on preview
deployments. Quarto output is plain static HTML, so the same `_site/` deploys
there unchanged — only the workflow differs. The personal site can stay on
GitHub Pages regardless.
