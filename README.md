# DEFEND YOUR BULLSHIT

A satirical architecture final-review game about defending a weak project with suspiciously confident academic language.

Live site:

https://ginagina19992023.github.io/defend-your-bullshit/

## What this is

This is a static browser game. It works without a backend, build step or private API key.

The core game is a local template/rule engine. Optional AI feedback can add variety, but the game always falls back to local rules when the free service is slow, unavailable or blocked.

Players can type their own architecture concept. The game can generate a statement and score custom defenses with explainable keyword rules. It does not deeply understand architecture; it playfully detects topic relevance, evidence, jargon, evasion, honesty, deletion and timed word-collage Battles.

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

You can either choose a preset strategy, type your own defense, or face a surprise **Reality Battle** after submitting a defense.

## Reality Battle / 现实 Battle

The existing magnetic-word collage is now a timed Battle that appears only when triggered, rather than staying visible throughout every critique. The original phrase bank and four slots (**Opening**, **Move**, **Concept**, **Proof / Chaos**) remain the core interaction.

Click **Start Timed Collage** to begin a 20-second countdown. Drag a word tile into a slot, or tap/click a tile and then a slot. The professor reacts immediately to correct placements, misplaced tiles and absurd phrases. The assembled sentence is previewed below the tiles. Submit early, or let the timer automatically grade the current collage. Empty and incomplete boards receive penalties; a complete, correctly placed sentence can calm the committee. Topic relevance, jargon and evidence are still evaluated by the existing local rule engine, with smaller Battle bonuses.

The timer can be paused, and switching away from the page automatically pauses it. After settlement, the Battle score changes are applied once and the normal three-round defense resumes. The next critique stays locked while the Battle is pending. Triggered Battles use local feedback immediately, without waiting for optional AI.

Chaos is calculated from current placements: each misplaced ordinary tile adds 2, and each absurd tile adds 4. Replacing a tile updates chaos instead of accumulating unlimited points. At chaos 7 or above, the professor briefly leaves to get water; this is a temporary reaction, not a permanent seat replacement.

## Fictional critic names and seat changes

Each scheduled and replacement critic receives a unique, deliberately misspelled collage of architect names, such as **扎哈·柯布希耶 / ZAHA CORBUSHIER** or **密斯·库尔哈兹 / MIES KOOLHAAZ**. These are fictional satirical characters. The original critic archetype and bias are still displayed separately. Imported critic packs also receive a collage display name while retaining their questions and preferences.

Before each round's question, a seat-change event may replace its scheduled critic. The incoming critic has a different bias and supplies their own question and scoring preferences. Existing scores and the three-round limit stay intact. A visible notice explains who left and who arrived.

## Random event table

| Event | When it is checked | Condition / chance | Effect |
| --- | --- | --- | --- |
| Pressure Battle | After a normal defense is scored | Total discomfort >= 10, and this guaranteed Battle has not occurred this run | Opens the timed word-collage Battle; takes priority over random Battles |
| Admiration Battle | After a normal defense, if pressure did not trigger | Current defense depth >= 6; 35% chance | Professor likes the concept and asks for another live collage |
| Surprise Battle | If neither earlier Battle check fired | 12% chance | Unexpected live word-collage challenge |
| Meeting | Before round 2 or 3 | 12% | Scheduled professor leaves for a meeting; a different critic takes the seat |
| Clocking off | Before round 3 | 15% | Professor leaves work; a replacement takes over |
| Visiting critic | Before any round | 8%; raised to 18% when accumulated depth >= 8 | An invited critic takes the scheduled seat |
| Absurd sympathy bonus | During normal defense and nonempty Battle scoring | 38% | Adds a small random bonus with an absurd local explanation |
| Brief walkout | While placing Battle tiles | Chaos reaches 7; deterministic | Professor temporarily gets water; modifies Battle settlement |

There is at most one Battle per round and one seat change at each round opening. Seat changes use one weighted draw: meeting, clocking off and visiting probabilities occupy separate intervals. The total seat-change chance is 8% in round 1; 20% or 30% in round 2; and 35% or 45% in round 3, depending on accumulated depth. Battle chances are sequential conditional checks: the 12% surprise chance applies only if the previous checks did not trigger. The guaranteed pressure Battle and collage name deck reset for each new run.

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
- In a Battle, build a sentence with magnetic tiles before the 20-second timer expires.
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
- the live word collage during a Battle.

Limitations:

- local scoring is heuristic,
- it can miss clever answers if they do not contain recognizable clues,
- it can reward absurd answers if they match the satirical scoring logic.

## Sharing

The intended share copy is:

> 发现自己很擅长写学术废话，于是做了一个这样的小游戏，目前只有建筑包体可以体验，欢迎大家加入新的包体。

The final share card is drawn in the browser with the player's actual project title, verdict and scores. It is not a fixed sample image. Use **Download Share Card** on the result screen to export a PNG.

## Visual assets

The cover artwork lives at `assets/review-wall-cover.png` and is used on the start screen and Open Graph metadata.

`assets/share-poster-reference.png` is kept as a visual reference for the result-card style. The exported result card is still generated dynamically in canvas so it can show the player's real score, critique excerpt and defense.

## Mobile and WeChat

The site is responsive. Battle tiles support both drag-and-drop and tap-a-tile / tap-a-slot input. The layout collapses into a single column, the share card scales to the screen width, and the exported PNG keeps a high-resolution canvas size.

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


## Browser checks

Install the Python `playwright` package and Chromium (or run `playwright install chromium`), then run:

```bash
python -m unittest discover -s tests -v
```

Set `CHROMIUM_PATH` if the browser is installed at a custom path. The checks cover trigger conditions, word placement, timers, one-time scoring, seat changes, fictional names, mobile taps and the three-round game flow.
