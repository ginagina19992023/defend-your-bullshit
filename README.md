# DEFEND YOUR BULLSHIT

A satirical presentation-stand-in career game: join the 学术嘴替 club, take client briefs, survive reviews, and keep your membership while managing food, time and in-game Tokens.

Live site:

https://ginagina19992023.github.io/defend-your-bullshit/

## What this is

This is a static browser game. It works without a backend, build step or private API key.

Scoring uses a local rule engine. AI strategy drafts and optional AI critic feedback add variety, but the game always falls back to local rules when the free service is slow, unavailable or blocked.

Players can type their own project concept in architecture, contemporary art or startup pitches. The game can generate a statement and score custom defenses with explainable keyword rules. It does not deeply understand architecture; it playfully detects topic relevance, evidence, jargon, evasion, honesty, deletion and timed word-collage Battles.

All reviewers are fictional. Do not add real faculty, real institutional branding or identifiable critic stories.

## How to play

1. Start in Simple Mode: choose a theme and play a standalone three-round review. Scores reset each game; no economy or membership is required.
2. After finishing your first game (pass or fail), receive a club invitation. Accept to enter Career Mode, or decline and keep playing Simple Mode indefinitely.
3. Type the client project, or click the random project button.
4. Optionally choose an AI feedback mode:
   - **Free web AI**: tries a public no-key text endpoint, suitable for WeChat sharing but not guaranteed.
   - **Local rules only**: most stable.
   - **Local Ollama**: uses `http://localhost:11434` if the player runs Ollama on their own device.
5. Generate a concept statement.
6. Submit it to a fictional review panel.
7. Survive three rounds of critique.
8. Collect the payout, download the share card, then return to the club to handle events, rest, buy supplies and take another job.

## Simple Mode and invitation

Simple Mode is the default for new players, including WeChat visitors. All three themes are available immediately; three-round scores start from zero each game. Battle and fictional critic events remain active, without hunger, Token costs, blacklists or mandatory career progression.

Every completed game saves its project, verdict, four scores and three answers/critic responses in local history. The history list distinguishes Simple and Career games. The first completed game produces one invitation, regardless of its outcome. Declining permanently dismisses it; future simple games continue freely. Accepting opens the club with a fresh career inventory. Career members can return to Simple Mode and later re-enter the club without losing career state. The career economy only changes while playing Career Mode. Both history and career are stored in the current browser; private/blocked storage supports only the current session.

## 学术嘴替 / Career loop

Career state is saved locally in the browser. A reload retains resources, unlocked themes, events and the accepted job. Resume starts its review again at round 1 without charging preparation twice; individual round progress is not saved. Blocked browser storage permits a temporary session.

| Membership | Required cleared jobs | Experience |
| --- | --- | --- |
| 试用嘴替 | 0 | 0 |
| 注册嘴替 | 2 | 20 |
| 资深嘴替 | 4 | 45 |
| 高级代汇报 Agent | 7 | 80 |

Clearing 2 jobs unlocks contemporary art, architecture competition finals and client side missions. Clearing 4 unlocks startup pitches, owner presentations and recommendation events. Cleared means both the academic verdict and the PRE acceptance goal pass. Normal jobs award 10 XP, 2 reputation and the listed fee; failed jobs award 2 XP, ¥8 and one blacklist. A completed optional mission adds ¥12, 5 XP and 1 reputation.

Every 3 settled jobs, the club checks the most recent 3 jobs. Registered members need 1 clear and ¥10; senior members need 2 clears in 2 scenes and ¥20; advanced agents need 2 clears in 2 themes and ¥30. All require reputation ≥−3. Failure demotes one tier and freezes promotion until a later audit succeeds. Previously unlocked content remains available.

Food costs ¥18 for 2 portions; 10 Tokens cost ¥20. A shopping trip takes 1 time. Eating a portion restores 35 hunger (maximum 100). Rest advances a day, restores time to 6 and consumes 10 hunger. Once per day, a 1-time club chore earns ¥15, 1 food and 2 Tokens, allowing recovery even with no cash. Tokens are fictional inventory, separate from optional AI API usage. Three blacklists disable the account; the two-click reset clears the career and starts a new account.

## PRE client situations

Each new offer draws equally from these four situations. Its scene, client and PRE are retained across reloads. Premiums are included in the displayed fee.

| PRE | Opening scores (depth / confidence / substance / discomfort) | Actual gameplay effect | Premium |
| --- | --- | --- | --- |
| Repeatedly dissed, close to breaking down | 1 / 2 / 0 / 4 | First question challenges the rescue attempt; calming phrases add confidence and reduce discomfort. Acceptance requires confidence ≥10 as well as a pass. | ¥8 |
| Return with evidence for a specific decision | 0 / 0 / 0 / 1 | First question requests an observation, comparison or test; reviewer favors substance. Acceptance requires substance ≥8 as well as a pass. | ¥12 |
| A cited master failed this critic years ago | 0 / 1 / 0 / 3 | First question challenges the fictional master; citing master/mentor names adds 2 discomfort per scored answer. | ¥10 |
| Ordinary stand-in presentation | 0 / 0 / 0 / 0 | Standard three-round acceptance rules. | ¥0 |

## Club and survival random events

After each settlement, unless the account closes, one event has a **45%** chance to appear. Eligible event types are equally likely, and at most one awaits resolution. Handle it before accepting another job; shopping and resting remain available. Choices display costs and consequences before selection.

| Event | Unlock condition | Choices and consequences |
| --- | --- | --- |
| Someone else's delivered package | From start | Keep: +8 Tokens, −2 reputation, 30% chance of a blacklist at next job settlement. Return: +2 reputation. |
| A peer snoops on your presentation | 2 cleared jobs | Report: 1 time, +5 reputation, ends courier relationship. Deal: ¥10, −2 reputation, unlocks delivery at no time cost (+¥5 per purchase), 20% blacklist risk next settlement. Ignore: no effect. |
| Emergency rescue request | 2 cleared jobs | Help: 1 time, −10 hunger, +¥20, +3 reputation, +3 XP. Sell recording: +¥30, −3 reputation, 50% immediate blacklist. Decline: no effect. |
| Senior-member recommendation | 4 cleared jobs | Portfolio: 1 time and 2 Tokens, +6 XP, +3 reputation. Buy recommendation: ¥35, +10 XP, −4 reputation. Postpone: no effect. |
| Optional client mission | 2 cleared jobs; independent 40% chance per new offer | Clear with substance ≥8, confidence ≥12, or discomfort ≤10, according to the brief, to earn its bonus. |

## Question selection and immediate reactions

`questions.js` contains **150 authored questions**: 40 each for architecture, contemporary art and startup presentations, plus 30 follow-ups across five critique topics. Normal rounds stay within the selected discipline. A hard compatibility filter first removes questions that assume absent features (for example rotated masses in a wall-deletion project). It uses the project title rather than trusting previous AI answers, and remains in force when question pools are exhausted. Generic titles receive general questions instead of invented objects. Weighted selection then considers critic preference, project and previous-answer keywords, question-topic variety, round number and pressure. Later or tense rounds favor more dramatic dilemmas. Topic matching is a local keyword heuristic, not semantic AI. Imported professor questions remain intact; PRE evidence and memory cases constrain the chosen topic.

The last 60 question IDs persist across sessions in the current browser. Previously asked questions are excluded while fresh eligible questions remain; if a discipline/topic pool is exhausted, repetition is allowed. Each run also keeps its own used-question set. Battle follow-ups retain the current scoring topic and quote the previous response. Players read the critic's actual clarification request before the timer starts. Magnetic words are a response interface, never an instruction spoken by the critic.

Normal defense options use a compact two-column grid. Preview the selected answer or open your own text response when needed. The current project title stays at the top of the sticky reviewer strip throughout defense and Battle. A sticky reviewer strip prominently shows a readable Chinese bias and the current topic while selecting, and the submit action stays at the bottom of the viewport. Every normal submission and resolved Battle opens an immediate reaction dialog, changing expression and typing a short response. Continue can skip the typing animation; Escape also continues after grading. Reduced-motion preferences skip animated typing. A triggered Battle starts only after this reaction is dismissed, so no timer runs behind the modal.

Critic feedback, scoring rationale and the original answer appear in separate sections. Rationale and original text are collapsed initially, and the rationale is rendered once with normalized punctuation.

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

The existing magnetic-word collage is now a timed Battle that appears only when triggered, rather than staying visible throughout every critique. The topic-specific phrase bank and four slots (**Opening**, **Move**, **Concept**, **Proof / Chaos**) remain the core interaction.

Before timing starts, the critic quotes the previous answer and asks a follow-up about the active topic (experience, form, power, evidence or memory). Their dialogue asks for clarification or an example, never for magnetic-word assembly. The question is visible while players prepare. Click **Start Response** to begin 20 seconds. Drag/tap tiles, supplement the assembled sentence, or choose free answer mode and type the entire response. Optional speech recognition transcribes into the editable field where supported; unsupported browsers offer keyboard microphone input instead. Recording stops on settlement/reset, and late transcripts cannot change a settled answer.

`battle-words.js` supplies a changing 16-tile pool for each discipline and critique topic: 4 relevant concepts, 4 alternative methods/evidence statements, 3 openings, 3 connecting phrases and 2 comic detours. Relevant concepts/methods are 50% of each pool; connectors are 37.5%; detours are 12.5%. Multiple concepts and methods can form valid responses. The previous pool is stored locally and fresh phrases are preferred, so identical random draws still produce different successive pools. These are content options, not a single canonical answer.

The professor evaluates the final text against the current question: recognized topic concepts, concrete methods and evidence. Slot count, tile type compatibility and timeout do not award or subtract points. An empty answer loses confidence; nonempty Battle grading has no random sympathy bonus. Score changes and recognized expressions are shown explicitly. Local keyword scoring remains heuristic. Absurd tiles can produce a temporary walkout animation, but placement chaos does not change settlement scores.

While playing, a fixed bottom bar keeps time, pause/resume and submission reachable on mobile and desktop. The timer starts only on Start; visibility loss pauses it. Submission or timeout resolves exactly once. Free input mode ignores all tiles; collage mode appends the editable text to tiles in slot order.

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
| Absurd sympathy bonus | During normal defense only | 38% | Adds a small random bonus with an absurd local explanation |
| Brief walkout | While placing Battle tiles | Chaos reaches 7; deterministic | Professor temporarily gets water; visual reaction only |

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

## Long-press normal voice answer

The last strategy-grid slot is a long-press voice option. Hold for 350 ms (or use Enter/Space) to request browser microphone permission. A recording bar then provides elapsed time, End and Cancel. Speech-recognition results populate the strategy draft; End finalizes the transcript for editing and scoring as manual speech content, independent of the previously selected strategy. A local audio recording is available for playback when MediaRecorder is supported. Cancel preserves the previous draft. Recording stops on visibility loss, after two minutes, on question reset and on page exit; stale events cannot alter a new answer.

Browser speech recognition is not available in every WeChat/webview version. In that case the recording remains local and the UI explicitly asks for keyboard microphone input or text; no automatic transcription is falsely claimed, and an empty transcript cannot be submitted. Audio files are not uploaded by this application or saved into persistent history.

## Critic tastes

Critic research interests interact with the chosen argumentative approach and the actual answer. A phenomenological explanation that addresses memory/time can earn extra depth and confidence and reduce discomfort for a memory/interested-experience critic. Evidence critics prefer a testable method; power critics can approve a grounded challenge to rules. A strategy label alone never earns the bonus: the answer must contain the corresponding content and address the current topic.

Concept switching or evasive reframing can lose substance and add discomfort. These extra taste scores are applied after base grading and remain intact in Battle grading. The setup displays research interests and the current focus, without showing reward/anger conditions. A receipt appears in the critic's comment only when a taste is actually triggered; it is not duplicated in the general rationale.

## AI strategy drafts

Selecting a defense strategy now generates the player's actual answer from the project, current critic question, discipline and strategy direction. Phenomenology uses a concrete bodily experience; deflection reframes the actual question; evidence proposes a test without inventing measured results; honesty admits a specific limit; deletion names what is removed. AI strategy generation is enabled by default, independently of optional professor feedback. The public no-key endpoint is used unless Local Ollama is selected.

The draft appears before submission. Players may request a new version or copy it into their own editable response. The submitted, scored and recorded answer is the actual draft or the player's edit, not the old fixed strategy text. Changing choices aborts earlier requests; a late reply cannot overwrite the latest choice. Generation times out after 12 seconds. Unrelated, repeated or unavailable service responses use clearly labeled offline alternative arguments; offline text is never labeled AI. Professor feedback remains local by default.

## Optional AI feedback

Local feedback is the default and quotes the answer with the rule explanation. Optional AI must quote the actual answer opening and stay within 400 characters; unanchored, error-page or empty responses fall back to local feedback. The prompt forbids unrelated invented imagery.

The optional **Free web AI** mode calls a public no-key text generation endpoint from the browser. It is useful for making WeChat playthroughs feel less repetitive, but it has limitations:

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

> 发现自己很擅长写学术废话，于是做了一个这样的小游戏，从建筑评图接单开始，通关后解锁艺术和创业主题，欢迎大家加入新的包体。

The final share card is drawn in the browser with the player's actual project title, verdict, scores and full final normal defense. Its smaller defense text wraps all paragraphs, and canvas height grows to fit every line; neither title nor defense is truncated. Red pencil circles, wavy underlines, score-dependent marginal comments, torn tape labels and paper grain echo the original collage references. The original cover supplies architectural margins and a bottom review-panel collage when it has loaded; the card also renders without that image. It is not a fixed sample image. Use **Download Share Card** on the result screen to export a PNG.

## Visual assets

The cover artwork lives at `assets/review-wall-cover.png` and is used on the start screen and Open Graph metadata.

`assets/share-poster-reference.png` is kept as a visual reference for the result-card style. The exported result card is still generated dynamically in canvas so it can show the player's real score, critique excerpt and defense.

## Mobile and WeChat

The site is responsive. Battle tiles support both drag-and-drop and tap-a-tile / tap-a-slot input. The layout collapses into a single column, the share card scales to the screen width, and the exported PNG keeps a high-resolution canvas size.

WeChat users can play through the public GitHub Pages URL. When selected, the free AI endpoint is attempted directly from the browser; if WeChat blocks or delays it, gameplay still continues with local rules.

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

Run `node tests/career.test.js`, `node tests/play-session.test.js` and `node tests/questions.test.js`, `node tests/strategy-writer.test.js` and `node tests/battle-words.test.js` for economy, invitations and question-selection checks.

Set `CHROMIUM_PATH` if the browser is installed at a custom path. The checks cover trigger conditions, word placement, timers, one-time scoring, seat changes, fictional names, mobile taps, the three-round game flow, career resume/reset, unlocked themes, PRE questions and complete multilingual share-card rendering.

评委问题现在由本局项目题目、实际操作、当前关注点及追问阶段构建，不再直接复用题库原句；题库承担关注点与戏剧情境的抽样。问题生成目前是本地规则，不依赖公共 AI 接口。反应弹窗将回顾缩小淡化，核心评语用衬线字体，荒谬关键词放大标红。

分享卡分两页预览：第一页是结局海报和本局实际评图教授的模拟签名，第二页完整保存三轮问题、玩家回答、教授评语及 Battle 追问。保存按钮将两页合为一张长图，文字先测量后绘制，不截断答辩。

同一评委持续三轮提问，只有显式换席事件才改变姓名；换席理由在页面开头显示。建筑、艺术与产品包使用各自独立的虚构大师拼贴姓名池。限时 Battle 在关闭上一段反馈后自动进入并计时，无需额外点击开始。

新增六个带简笔建筑平面或轴侧图的荒谬题目，可在选题菜单直接选择并预览；进入概念陈述、普通答辩与限时追问时显示当前题目的对应图纸，改写成其他题目后不会沿用旧图。
评分平衡：减轻实证、诚实、删减与概念堆叠的不适叠加，匹配问题且有依据可缓和不适，随机同情分不再额外惹怒评委。通关门槛保持不变。最终评语覆盖全部 23 种可行未达标组合及四种通过表现，多项不足不会被高不适覆盖。
所有学科的概念陈述、即时评语、离线话术、问题生成、结局建议与 AI 身份提示均按建筑／艺术／产品分流，公共 AI 返回错误学科的文案会被拒绝。

详细的通关、AS 计算、全部选项、Battle、会员验收及事件判定见 [GAME_RULES.md](./GAME_RULES.md)。

拼词现为点选直接入对应槽，同类词替换；顶部实时拼句条随滚动固定，可展开完整文字。

现编话术强化了六种策略的语气和与题目相关的反差。离线回答也使用完整的讽刺论证；删减策略质疑设计者的专业必要性。
