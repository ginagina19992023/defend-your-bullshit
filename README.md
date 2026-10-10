# DEFEND YOUR BULLSHIT

A satirical architecture critique / final review game. No real professors depicted.

## Play locally

Clone the repository:

```bash
git clone https://github.com/ginagina19992023/defend-your-bullshit.git
cd defend-your-bullshit
```

Open `index.html` in a browser. No dependencies, API keys or build step required.

For an optional local web server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## How it works

1. Pick an absurd project idea (or write your own).
2. Generate a structured architecture-style concept statement at one of three intensities.
3. Face three fictional reviewers, each attacking a different conceptual issue.
4. Choose a defense tactic or write your own response.
5. Earn Conceptual Depth, Academic Confidence, Actual Substance and Critique Survival scores.

### Logic

- The generator uses multi-paragraph rhetorical structures plus randomized disciplinary vocabulary. This is intentionally **not AI**, and does not claim to understand your project.
- Reviewer prompts carry a hidden topic: experience, form, power or evidence.
- Custom-answer scoring uses domain keyword overlap and evidence markers, including penalties for evasive or overloaded jargon. It is an **explainable, playful heuristic**, not a fair assessment of genuine academic merit.
- Longer replies alone have little effect. Discussing the asked topic and including verifiable methods helps.
- Future roadmap: AI-assisted critiques, community discipline packs, contextual scoring, shareable results and content moderation.

## Community packs

Packs are plain data objects in `packs.js`, not executable plugins. Each one defines project prompts, topics, vocabulary, fictional professors, questions and defense strategies. Start by copying the `architecture` object and changing its `id` and name. Submit a pull request.

## Deploy

The repository contains a GitHub Pages workflow under `.github/workflows/pages.yml`.
After pushing, visit **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The published address should be:

https://ginagina19992023.github.io/defend-your-bullshit/

Verify the Actions deployment has completed before sharing. GitHub Pages may require enabling Actions and appropriate permissions.

### Sharing to WeChat

Open the live public URL in WeChat and use **Share → Moments**. The page contains standard Open Graph metadata for title and description, but **WeChat-specific custom thumbnails require additional server-side WeChat JS-SDK integration / domain setup**, and aren't guaranteed by GitHub Pages alone. For reliable WeChat previews, consider a custom domain plus appropriate hosting/CDN.

## License

This repository is an experimental satire prototype.