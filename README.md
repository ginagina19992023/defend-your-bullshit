# DEFEND YOUR BULLSHIT

A satirical architecture final-review game about defending a weak project with suspiciously confident academic language.

Live site:

https://ginagina19992023.github.io/defend-your-bullshit/

## What this is

This is a static browser game. It works without a backend, build step or private API key.

The core game is a local template/rule engine. Optional AI feedback can add variety, but the game always falls back to local rules when the free service is slow, unavailable or blocked.

Players can type their own architecture concept. The game can generate a statement and score custom defenses with explainable keyword rules. It does not deeply understand architecture; it playfully detects topic relevance, evidence, jargon, evasion, honesty, deletion and chaotic improvisation.

All reviewers are fictional. Do not add real faculty, real institutional branding or identifiable critic stories.

## How to play

1. Open the site.
2. Choose the Architecture Pack.
3. Type your actual project, or click the random project button.
4. Optionally choose an AI feedback mode:
   - **Free web AI**: tries a public no-key text endpoint, suitable for WeChat sharing but not guaranteed.
   - **Local rules only**: most stable.
   - **Local Ollama**: uses `http://localhost:11434` if the player runs Ollama on their own device.
5. Generate a concept statement.
6. Submit it to a fictional review panel.
7. Survive three rounds of critique.
8. Download the dynamic share card or copy the final report.

## Three-round defense

Each run randomly selects three professors from the pool. Professors have different biases:

- some prefer concept over evidence,
- some punish pure theory,
- some care about form,
- some treat every bench as political,
- some think deleting the design is maturity,
- some are haunted by their own failed reviews.

You can either choose a preset strategy, type your own defense, or use the **Live Improvisation Board**.

## Live Improvisation Board

The board lowers the input barrier for players who do not want to write a full answer from scratch.

Drag word chunks into four slots:

- **Opening**
- **Move**
- **Concept**
- **Proof / Chaos**

Good placements make the professor subtly soften. Wrong placements make the professor suspicious. Absurd placements can raise chaos and may trigger events such as the professor briefly leaving the room. These accidents are part of the scoring.

## Scores

The game tracks four scores:

- **Conceptual Depth**: theoretical density, disciplinary vocabulary and conceptual framing.
- **Academic Confidence**: redirection, reframing and overconfident delivery.
- **Actual Substance**: evidence, tests, observation, material, users or measurable details.
- **Committee Discomfort**: how uneasy the panel becomes. Too little is boring; too much may destabilize the room.

## How to pass

To pass, finish three critique rounds and land in this range:

- Conceptual Depth >= 8
- Academic Confidence >= 8
- Actual Substance >= 4
- Committee Discomfort between 4 and 15

Practical strategy:

- Do not only write beautiful jargon.
- Do not only provide practical evidence.
- Mix one concrete method with one conceptual reframing.
- Use the word slots to create an answer if you are stuck.
- Let the committee become a little uncomfortable, but not so uncomfortable that the review collapses.

## Optional AI feedback

The default **Free web AI** mode calls a public no-key text generation endpoint from the browser. It is useful for making WeChat playthroughs feel less repetitive, but it has limitations:

- it can be slow,
- it can fail,
- prompts travel to a third-party service,
- it should not receive private or sensitive content,
- it does not control the final score.

If the request fails, the local rule engine immediately provides feedback instead.

The **Local Ollama** mode is for players who run Ollama locally. It is not suitable for ordinary WeChat visitors unless they already have a local model server.

## Free text input

Players can enter new architecture ideas and custom answers. The current system checks for:

- topic keywords from the active question,
- evidence and verification terms,
- concrete design or site details,
- theoretical vocabulary,
- evasive reframing,
- honesty or uncertainty,
- deletion, absence and anti-design language,
- live improvisation chaos.

Limitations:

- local scoring is heuristic,
- it can miss clever answers if they do not contain recognizable clues,
- it can reward absurd answers if they match the satirical scoring logic.

## Sharing

The intended share copy is:

> 发现自己很擅长写学术废话，于是做了一个这样的小游戏，目前只有建筑包体可以体验，欢迎大家加入新的包体。

The final share card is drawn in the browser with the player's actual project title, verdict and scores. It is not a fixed sample image. Use **Download Share Card** on the result screen to export a PNG.

## Mobile and WeChat

The site is responsive and works on phones. The layout collapses into a single column, the share card scales to the screen width, and the exported PNG keeps a high-resolution canvas size.

WeChat users can play through the public GitHub Pages URL. The free AI endpoint is attempted directly from the browser; if WeChat blocks or delays it, gameplay still continues with local rules.

## Community discipline packs

Packs live in `packs.js` as plain data objects, not executable plugins.

Each discipline pack defines:

- `id`
- `name`
- `projects`
- `topics`
- `vocabulary`
- `professors`
- `strategies`

To add a new discipline pack, copy the `architecture` object, change the `id` and `name`, replace the content arrays, and submit a pull request.

## Weird critic packs

Players can import a local JSON critic pack from the setup screen. This is for trying out "weird critic" behavior without editing the repository.

Example:

```json
{
  "critics": [
    {
      "name": "PROF. ROOFTOP BENCH",
      "bias": "absurd publicness",
      "biasLabel": "thinks rooftop benches explain society",
      "topic": "power",
      "questions": [
        "如果这张长椅不在屋顶上，它还具有公共性吗？"
      ],
      "preference": {
        "depth": 1,
        "confidence": 1,
        "substance": 0,
        "discomfort": 2
      }
    }
  ]
}
```

Community submission rules:

- keep all critic names fictional,
- remove identifying personal details,
- avoid real institutional names,
- turn real anecdotes into generalized satire,
- keep the joke aimed at critique culture, not at identifiable people.

## Run locally

Clone the repository:

```bash
git clone https://github.com/ginagina19992023/defend-your-bullshit.git
cd defend-your-bullshit
```

Open `index.html` in a browser.

Optional local server:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deploy

This repository uses GitHub Pages from the `main` branch through `.github/workflows/pages.yml`.

After pushing to `main`, check the GitHub Actions Pages deployment. The public URL should be:

https://ginagina19992023.github.io/defend-your-bullshit/

## License

Experimental satire prototype.
