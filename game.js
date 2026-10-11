/* DEFEND YOUR BULLSHIT - local-first satire engine.
   Optional AI adds variety, but the game always works with deterministic rules. */
(() => {
  "use strict";

  const $ = id => document.getElementById(id);
  const keys = Object.keys(window.DYB_PACKS);
  const random = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => arr.slice().sort(() => Math.random() - 0.5);
  const clamp = (x, min, max) => Math.max(min, Math.min(max, x));
  const pack = () => window.DYB_PACKS[$("pack").value];
  const liveUrl = "https://ginagina19992023.github.io/defend-your-bullshit/";

  const state = {
    project: "",
    statement: "",
    round: 0,
    scores: { depth: 0, confidence: 0, substance: 0, discomfort: 0 },
    chosen: 0,
    question: null,
    professor: null,
    panel: [],
    history: [],
    final: null,
    customCritics: [],
    slots: {},
    slotChaos: 0,
    professorLeft: false
  };

  const professorPool = [
    {
      name: "PROF. CONCEPTUAL OVERFLOW",
      bias: "concept",
      biasLabel: "BIAS: concept over evidence",
      question: "你的项目是否过于依赖现实？它有没有能力脱离功能而继续成立？",
      topic: "form",
      preference: { depth: 2, confidence: 1, substance: -1, discomfort: 1 }
    },
    {
      name: "PROF. EVIDENCE PANIC",
      bias: "evidence",
      biasLabel: "BIAS: suspicious of pure theory",
      question: "你能不能说一个真正发生过的观察，而不是继续描述它的潜能？",
      topic: "evidence",
      preference: { depth: -1, confidence: 0, substance: 2, discomfort: -1 }
    },
    {
      name: "PROF. FORMAL DESTINY",
      bias: "form",
      biasLabel: "BIAS: shape must be inevitable",
      question: "为什么它必须长成这样？如果旋转、压扁、删掉，它还剩什么？",
      topic: "form",
      preference: { depth: 1, confidence: 1, substance: 0, discomfort: 1 }
    },
    {
      name: "PROF. PUBLIC GUILT",
      bias: "power",
      biasLabel: "BIAS: every bench is political",
      question: "谁有资格使用它？谁被你的设计礼貌地排除在外？",
      topic: "power",
      preference: { depth: 1, confidence: 0, substance: 1, discomfort: 1 }
    },
    {
      name: "PROF. BEAUTIFUL ABSENCE",
      bias: "erase",
      biasLabel: "BIAS: deletion is maturity",
      question: "如果你把设计全部删除，项目会不会终于变得诚实？",
      topic: "form",
      preference: { depth: 2, confidence: 1, substance: -1, discomfort: 2 }
    },
    {
      name: "PROF. TRAUMATIC MEMORY",
      bias: "memory",
      biasLabel: "BIAS: haunted by old reviews",
      question: "这个项目让我想起某次失败的终评。你如何证明这不是同一个问题的礼貌复现？",
      topic: "memory",
      preference: { depth: 1, confidence: 1, substance: 0, discomfort: 2 }
    }
  ];

  const absurdReasons = [
    "教授突然想起自己曾经被 fail 的毕设也探讨了同样的问题，因此给了你一部分同情分。",
    "委员会误以为你把长椅放到屋顶上是在批判垂直公共性，因此短暂提高了分数。",
    "一位教授听见了自己喜欢的词，于是决定不追问它是什么意思。",
    "你的停顿被解释成一种精确的沉默方法。",
    "有人觉得这个项目看起来很适合被印在展览海报上，所以暂时原谅了它。",
    "教授把一个明显的漏洞理解为制度性空缺，并要求你保留它。"
  ];

  const contradictionPool = {
    tooEmpirical: [
      "你居然提供了可检验的回答。委员会对此表示不适，因为它让讨论过早接触现实。",
      "证据是有帮助的，但你需要小心：过多证据会削弱项目保持开放的能力。"
    ],
    tooConceptual: [
      "理论高度充足，但经验基础可疑。委员会决定把这种可疑暂时称为张力。",
      "你的概念非常丰厚，丰厚到几乎遮住了项目本身。"
    ],
    tooHonest: [
      "你承认自己也不确定。委员会决定将其理解为激进的自我反思。",
      "这种诚实令人担忧，但也许正是它使项目获得了不稳定的伦理位置。"
    ],
    tooAmbitious: [
      "你试图同时解决形式、公共性、感知和历史。委员会赞赏这种危险的过度野心，并要求你下周缩小范围。",
      "项目的野心超过了它的结构承载力。奇怪的是，这让它听起来更像研究。"
    ],
    eraseDesign: [
      "你删除了几乎一切。委员会担心你可能真的开始质疑建筑本身，并对此产生神秘赞许。",
      "当设计消失，论证突然变得清晰。教授们短暂地沉默了。"
    ],
    evasive: [
      "你没有回答问题，但你成功移动了问题的位置。委员会暂时无法证明这是错误的。",
      "这个回答绕开了核心质疑，却制造了新的核心质疑。评图系统对此非常熟悉。"
    ],
    balanced: [
      "你在证据和概念之间保持了危险的平衡。委员会尚未决定该攻击哪一边。",
      "回答既没有完全落地，也没有彻底升空。它正处在一个可被继续讨论的位置。"
    ],
    weak: [
      "评图委员会认为你还有大量概念工作需要完成。请把这个问题改写成一个更大的问题。",
      "目前的回答过于直接，因此缺少足够的学术保护层。"
    ]
  };

  const stitchParts = {
    openings: ["这并不是一个物体", "我真正想处理的不是功能", "这个形式的脆弱性", "如果我们暂时拒绝效率", "这里的失败"],
    verbs: ["暴露了", "延迟了", "重新组织了", "迫使我们面对", "把问题转译为"],
    concepts: ["观看者的身体协商", "公共性的临时边界", "材料自身的沉默", "被制度化的等待", "空间意义的生产条件"],
    endings: ["因此它必须保持未完成。", "这也是我选择不解决它的原因。", "所以证据不是结果，而是过程。", "它需要以不舒服的方式存在。", "否则它就只剩下一个设计。"]
  };
  let currentTokens = [];

  function show(id) {
    for (const x of ["setup", "statement", "defense", "final"]) $(x).hidden = x !== id;
    window.scrollTo?.(0, 0);
  }

  function addSelects() {
    for (const key of keys) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = window.DYB_PACKS[key].name;
      $("pack").append(option);
    }
  }

  function buildPanel() {
    const base = pack().professors.map(prof => {
      const question = random(prof.questions);
      return {
        name: prof.name,
        bias: prof.moodBias || "classic",
        biasLabel: "BIAS: classic studio suspicion",
        question: question.text,
        topic: question.topic,
        preference: { depth: 0, confidence: 0, substance: 0, discomfort: 0 }
      };
    });
    const custom = state.customCritics.map(c => ({
      name: c.name || "GUEST CRITIC",
      bias: c.bias || "chaos",
      biasLabel: "BIAS: " + (c.biasLabel || c.bias || "imported chaos"),
      question: random(c.questions || ["你如何为这个决定负责？"]),
      topic: c.topic || "form",
      preference: c.preference || { depth: 1, confidence: 1, substance: 0, discomfort: 1 },
      imported: true
    }));
    state.panel = shuffle(base.concat(professorPool, custom)).slice(0, 3);
  }

  function updateChoice() {
    document.querySelectorAll(".strategy").forEach((el, i) => {
      el.classList.toggle("selected", i === state.chosen);
      el.setAttribute("aria-pressed", String(i === state.chosen));
    });
  }

  function statement() {
    const p = pack();
    const v = p.vocabulary;
    const intensity = Number($("intensity").value);
    const a = random(v);
    const b = random(v.filter(x => x !== a));
    const c = random(v.filter(x => x !== a && x !== b));
    const project = state.project;
    const first = "本项目并不试图简单地" + project + "，而是将这一看似微不足道的操作视作一次关于" + a + "的空间实践。通过改变观看和行动的既定方式，作品试图重新审视主体与环境之间的关系。";
    const second = "在这一过程中，" + project + "不再仅仅是一项物理动作，而逐渐被转译为一种围绕" + b + "展开的开放系统。材料、时间与参与者的介入共同塑造了作品中不断变化的意义。";
    const third = "我们特别关注过程而非结果：随着形式被重复、修正和重新感知，原本稳定的空间界线变得难以确定。由此，" + c + "并非附着于形式之上的解释，而成为设计发生的条件。";
    const final = "最终，真正需要讨论的并非项目是否完成，而是我们为什么仍旧假设空间必须被完成。作品试图将这个无法被轻易解决的问题留给每一个参与者。";
    state.statement = [first, second, ...(intensity >= 2 ? [third] : []), ...(intensity >= 3 ? [final] : [])].join("\n\n");
    $("generated").textContent = state.statement;
    show("statement");
  }

  function countMatches(text, terms) {
    return terms.reduce((count, term) => count + (text.includes(term) ? 1 : 0), 0);
  }

  function analyze(answer, question) {
    const p = pack();
    const topic = p.topics.find(t => t.id === question.topic) || p.topics[0];
    const otherTopicHits = p.topics
      .filter(t => t.id !== question.topic)
      .reduce((n, t) => n + countMatches(answer, t.keywords), 0);
    const relevant = countMatches(answer, topic.keywords);
    const evidence = countMatches(answer, p.topics.find(t => t.id === "evidence").keywords);
    const inflated = countMatches(answer, p.vocabulary.concat(["本体", "范式", "话语", "解构", "再语境化", "辩证", "主体性", "开放性", "后人类", "生产", "阈限"]));
    const evasions = countMatches(answer, ["不是", "而是", "追问", "谁规定", "无法回答", "未完成", "留白", "开放", "不在于", "问题本身", "暴露"]);
    const concrete = countMatches(answer, ["因为", "例如", "通过", "对比", "记录", "测试", "测量", "现场", "使用者", "厘米", "米", "小时", "次", "材料", "路径", "反馈"]);
    const honest = countMatches(answer, ["不知道", "不能证明", "不确定", "失败", "承认", "无法", "也许"]);
    const erase = countMatches(answer, ["删除", "去掉", "空缺", "消失", "剩下", "缺席", "取消"]);
    const ambition = countMatches(answer, ["同时", "全部", "整体", "社会", "历史", "公共", "权力", "身体", "形式", "系统"]);
    const onTopic = relevant > 0 || (question.topic === "evidence" && evidence > 0);
    return { topic, relevant, otherTopicHits, evidence, inflated, evasions, concrete, honest, erase, ambition, onTopic };
  }

  function evaluate(answer, question, style) {
    const a = analyze(answer, question);
    const pref = state.professor.preference || {};
    const tooConceptual = a.inflated >= 3 && a.evidence === 0;
    const tooEmpirical = a.evidence >= 2 && a.concrete >= 2 && a.inflated <= 1;
    const tooHonest = a.honest >= 2 || style === "honest";
    const eraseDesign = a.erase >= 2 || style === "erase";
    const tooAmbitious = a.ambition >= 4 && a.otherTopicHits >= 2;
    const evasiveWithoutAnswer = a.evasions >= 2 && !a.onTopic && a.evidence === 0;

    let depth = 1 + Math.min(4, a.inflated) + Math.min(2, a.otherTopicHits) + (eraseDesign ? 2 : 0) + (tooHonest ? 1 : 0) + (pref.depth || 0);
    let confidence = 1 + Math.min(3, a.evasions) + Math.min(2, a.inflated) + (answer.length > 80 ? 1 : 0) + (style === "deflect" ? 1 : 0) + (pref.confidence || 0);
    let substance = (a.onTopic ? 2 : 0) + Math.min(4, a.evidence) + Math.min(2, a.concrete) - (tooConceptual ? 2 : 0) - (evasiveWithoutAnswer ? 1 : 0) + (pref.substance || 0);
    let discomfort = 1 + Math.min(3, a.evasions) + (tooEmpirical ? 4 : 0) + (tooConceptual ? 3 : 0) + (tooHonest ? 3 : 0) + (tooAmbitious ? 2 : 0) + (eraseDesign ? 4 : 0) - (a.onTopic ? 1 : 0) + (pref.discomfort || 0);

    if (style === "evidence") substance += 1;
    if (style === "jargon") depth += 1;
    if (style === "erase") confidence += 1;
    if (!a.onTopic && a.evidence === 0) substance -= 1;
    if (state.slotChaos >= 4) {
      discomfort += Math.min(4, Math.floor(state.slotChaos / 2));
      confidence += 1;
    }
    if (state.professorLeft) {
      discomfort += 4;
      confidence += 2;
      substance -= 1;
    }

    const lucky = Math.random() < 0.38;
    if (lucky) {
      depth += 1;
      confidence += 1;
      discomfort += 1;
    }

    const tags = [];
    if (tooEmpirical) tags.push("tooEmpirical");
    if (tooConceptual) tags.push("tooConceptual");
    if (tooHonest) tags.push("tooHonest");
    if (tooAmbitious) tags.push("tooAmbitious");
    if (eraseDesign) tags.push("eraseDesign");
    if (evasiveWithoutAnswer) tags.push("evasive");
    if (!tags.length && depth >= 3 && substance >= 3) tags.push("balanced");
    if (!tags.length) tags.push("weak");

    const reasons = [];
    reasons.push(a.onTopic ? "回答触及「" + a.topic.label + "」" : "没有正面回应「" + a.topic.label + "」");
    if (a.evidence > 0) reasons.push("出现了测试、记录或验证线索");
    if (a.inflated >= 3) reasons.push("概念密度偏高");
    if (a.evasions >= 2) reasons.push("使用了问题反转或概念转移");
    if (tooHonest) reasons.push("诚实程度危险");
    if (eraseDesign) reasons.push("触发删除设计逻辑");
    if (lucky) reasons.push(random(absurdReasons));
    if (state.slotChaos >= 4) reasons.push("临场词汇拼装让教授面部表情出现了可见偏移");
    if (state.professorLeft) reasons.push("教授短暂离席，委员会将其记录为强烈空间反应");

    return {
      depth: clamp(depth, 0, 9),
      confidence: clamp(confidence, 0, 9),
      substance: clamp(substance, -2, 9),
      discomfort: clamp(discomfort, 0, 10),
      tags,
      reason: reasons.join("；") + "。",
      absurd: lucky ? reasons[reasons.length - 1] : ""
    };
  }

  function moodFor(discomfort) {
    if (discomfort >= 18) return { face: ":-O", label: "theoretically destabilized", note: "委员会已经不确定自己是否仍在评建筑。" };
    if (discomfort >= 14) return { face: ">:|", label: "deeply disturbed", note: "教授开始用沉默表达赞许与敌意。" };
    if (discomfort >= 10) return { face: ":-/", label: "uneasy", note: "讨论正在偏离现实，效果不错。" };
    if (discomfort >= 5) return { face: ":-?", label: "skeptical", note: "委员会怀疑你可能真的有一点想法。" };
    return { face: ":-|", label: "mild concern", note: "委员会仍在试图相信你。" };
  }

  function updateMood() {
    const mood = moodFor(state.scores.discomfort);
    $("professorFace").textContent = mood.face;
    $("moodLabel").textContent = mood.label;
    $("moodNote").textContent = mood.note;
    $("biasLabel").textContent = state.professor?.biasLabel || "BIAS: undecided";
  }

  function passStatus() {
    const s = state.scores;
    const items = [
      ["Depth >= 8", s.depth >= 8, s.depth + "/8"],
      ["Confidence >= 8", s.confidence >= 8, s.confidence + "/8"],
      ["Substance >= 4", s.substance >= 4, s.substance + "/4"],
      ["Discomfort 4-15", s.discomfort >= 4 && s.discomfort <= 15, s.discomfort + "/15"]
    ];
    $("passChecklist").replaceChildren();
    for (const [label, ok, value] of items) {
      const row = document.createElement("div");
      row.className = "check " + (ok ? "ok" : "wait");
      row.innerHTML = "<span>" + (ok ? "PASS" : "WAIT") + "</span><strong>" + label + "</strong><em>" + value + "</em>";
      $("passChecklist").append(row);
    }
  }

  function populateWordBank() {
    const bank = $("wordBank");
    bank.replaceChildren();
    currentTokens = [
      ...shuffle(stitchParts.openings).slice(0, 3).map(text => ({ text, type: "opening" })),
      ...shuffle(stitchParts.verbs).slice(0, 3).map(text => ({ text, type: "move" })),
      ...shuffle(stitchParts.concepts).slice(0, 4).map(text => ({ text, type: "concept" })),
      ...shuffle(stitchParts.endings).slice(0, 3).map(text => ({ text, type: "proof" })),
      { text: "我把长椅放到了屋顶上", type: "absurd", absurd: true },
      { text: "这让我想起某次失败的终评", type: "absurd", absurd: true },
      { text: "我们记录了三位使用者的停留时间", type: "proof" }
    ];
    currentTokens.forEach((token, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "chip";
      btn.textContent = token.text;
      btn.draggable = true;
      btn.dataset.tokenIndex = String(index);
      btn.addEventListener("dragstart", event => {
        event.dataTransfer.setData("text/plain", String(index));
      });
      btn.addEventListener("click", () => {
        appendAnswer(token.text);
        microReact(token.absurd ? "absurd" : "append", token.text);
      });
      bank.append(btn);
    });
  }

  function resetSlots() {
    state.slots = {};
    state.slotChaos = 0;
    state.professorLeft = false;
    $("chaosMeter").textContent = "CHAOS 0";
    $("improvStatus").textContent = "教授正在观察你的临场拼装。";
    $("professorFace").classList.remove("flinch", "leave");
    document.querySelectorAll(".slot").forEach(slot => {
      slot.className = "slot";
      slot.innerHTML = "<span>" + slot.dataset.slot.toUpperCase() + "</span><strong>" + defaultSlotText(slot.dataset.slot) + "</strong>";
      slot.ondragover = event => event.preventDefault();
      slot.ondrop = event => {
        event.preventDefault();
        const token = currentTokens[Number(event.dataTransfer.getData("text/plain"))];
        if (token) placeToken(slot, token);
      };
    });
  }

  function defaultSlotText(slot) {
    return { opening: "拖一个开场", move: "拖一个动作", concept: "拖一个概念", proof: "拖证据或离谱理由" }[slot] || "拖一个词";
  }

  function placeToken(slotEl, token) {
    const slot = slotEl.dataset.slot;
    const compatible = token.type === slot || (slot === "proof" && (token.type === "proof" || token.type === "absurd"));
    const absurd = Boolean(token.absurd);
    state.slots[slot] = token.text;
    slotEl.className = "slot filled " + (absurd ? "absurd" : compatible ? "good" : "wrong");
    slotEl.innerHTML = "<span>" + slot.toUpperCase() + "</span><strong>" + token.text + "</strong>";
    if (absurd) state.slotChaos += 4;
    else if (!compatible) state.slotChaos += 2;
    else state.slotChaos = Math.max(0, state.slotChaos - 1);
    updateSlotAnswer();
    microReact(absurd ? "absurd" : compatible ? "good" : "wrong", token.text);
  }

  function updateSlotAnswer() {
    const sentence = ["opening", "move", "concept", "proof"].map(key => state.slots[key]).filter(Boolean).join(" ");
    if (sentence) $("customAnswer").value = sentence;
  }

  function microReact(kind, text) {
    const face = $("professorFace");
    face.classList.remove("flinch", "leave");
    void face.offsetWidth;
    if (kind === "good") {
      $("improvStatus").textContent = "教授的眉毛微微上扬：这个词放得像是有预谋。";
    } else if (kind === "wrong") {
      $("improvStatus").textContent = "教授眯起眼睛：这个词的位置不对，但也许可以被解释。";
      face.classList.add("flinch");
    } else if (kind === "absurd") {
      $("improvStatus").textContent = "教授明显停顿了一下：" + text + " 造成了评图事故的前兆。";
      face.classList.add("flinch");
    } else {
      $("improvStatus").textContent = "教授听见了一个词，但还没有决定要不要生气。";
    }
    if (state.slotChaos >= 7) {
      state.professorLeft = true;
      $("improvStatus").textContent = "教授离席去倒水。委员会把这称为一次强烈的空间反应。";
      face.classList.add("leave");
    }
    $("chaosMeter").textContent = "CHAOS " + state.slotChaos;
  }

  function appendAnswer(text) {
    const box = $("customAnswer");
    box.value = (box.value.trim() ? box.value.trim() + " " : "") + text;
    box.focus();
  }

  function stitchedSentence() {
    return [random(stitchParts.openings), random(stitchParts.verbs), random(stitchParts.concepts), random(stitchParts.endings)].join(" ");
  }

  function critique() {
    state.professor = state.panel[state.round];
    state.question = { text: state.professor.question, topic: state.professor.topic };
    $("roundLabel").textContent = "ROUND " + (state.round + 1) + " / 3";
    $("professorLabel").textContent = state.professor.name;
    $("question").textContent = state.question.text;
    $("strategies").replaceChildren();
    pack().strategies.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.className = "strategy";
      btn.type = "button";
      const title = document.createElement("strong");
      title.textContent = s.name;
      const description = document.createElement("span");
      description.textContent = s.description;
      btn.append(title, description);
      btn.addEventListener("click", () => {
        state.chosen = i;
        updateChoice();
      });
      $("strategies").append(btn);
    });
    state.chosen = 0;
    updateChoice();
    updateMood();
    passStatus();
    populateWordBank();
    resetSlots();
    $("customAnswer").value = "";
    $("feedbackBlock").hidden = true;
    $("submitDefense").disabled = false;
    $("submitDefense").textContent = "DEFEND YOUR PROJECT";
    show("defense");
  }

  function aiPrompt(answer, grading) {
    return [
      "你是一个虚构建筑评图教授，写中文。不要提真实机构或真实教授姓名。",
      "请根据玩家答辩给出一段不超过90字的讽刺反馈。",
      "语气：荒谬、聪明、像critic，但不要人身攻击。",
      "教授偏好：" + state.professor.biasLabel,
      "项目：" + state.project,
      "教授问题：" + state.question.text,
      "玩家回答：" + answer,
      "规则判定：" + grading.tags.join(", ") + "；" + grading.reason,
      "可以加入一个随机荒谬理由，例如想起自己失败的毕设、屋顶长椅、展览海报、沉默被误读等。",
      "只输出反馈正文。"
    ].join("\n");
  }

  async function fetchPollinations(prompt) {
    const url = "https://text.pollinations.ai/" + encodeURIComponent(prompt) + "?model=openai&seed=" + Math.floor(Math.random() * 999999);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 16000);
    try {
      const res = await fetch(url, { signal: controller.signal, referrerPolicy: "no-referrer" });
      if (!res.ok) throw new Error("Pollinations returned " + res.status);
      return (await res.text()).trim();
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchOllama(prompt) {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: $("ollamaModel").value.trim() || "llama3.1", prompt, stream: false })
    });
    if (!res.ok) throw new Error("Ollama returned " + res.status);
    const data = await res.json();
    return (data.response || "").trim();
  }

  async function optionalAiFeedback(answer, grading) {
    const provider = $("aiProvider").value;
    if (provider === "local") return "";
    const prompt = aiPrompt(answer, grading);
    try {
      if (provider === "ollama") return await fetchOllama(prompt);
      return await fetchPollinations(prompt);
    } catch (error) {
      console.warn("AI feedback failed, falling back to local rules:", error);
      return "";
    }
  }

  async function submit() {
    const choice = pack().strategies[state.chosen];
    const custom = $("customAnswer").value.trim();
    const answer = custom || choice.answer;
    const grading = evaluate(answer, state.question, custom ? "manual" : choice.style);
    for (const key of Object.keys(state.scores)) state.scores[key] += grading[key];

    $("submitDefense").disabled = true;
    $("submitDefense").textContent = "PROFESSOR IS THINKING...";
    const mainTag = grading.tags[0];
    const localResponse = random(contradictionPool[mainTag]);
    const aiResponse = await optionalAiFeedback(answer, grading);
    const response = aiResponse || localResponse;
    const accident = state.professorLeft ? "\n\nINCIDENT REPORT: 教授曾短暂离席，但没有人敢确认这是否算失败。" : "";
    $("feedback").textContent = response + accident + "\n\n" + grading.reason + "\n\nYOUR DEFENSE: " + answer;
    $("scoreChange").textContent = "DEPTH +" + grading.depth + "  CONFIDENCE +" + grading.confidence + "  SUBSTANCE " + (grading.substance >= 0 ? "+" : "") + grading.substance + "  DISCOMFORT +" + grading.discomfort + (aiResponse ? "  AI VARIATION ON" : "  LOCAL RULES");
    state.history.push({ professor: state.professor.name, question: state.question.text, answer, grading, response, ai: Boolean(aiResponse) });
    $("feedbackBlock").hidden = false;
    $("nextRound").textContent = state.round === 2 ? "FINAL VERDICT" : "NEXT CRITIQUE";
    updateMood();
    passStatus();
  }

  function verdict() {
    const s = state.scores;
    const pass = s.depth >= 8 && s.confidence >= 8 && s.substance >= 4 && s.discomfort >= 4 && s.discomfort <= 15;
    if (s.discomfort > 15) {
      return { passed: false, stamp: "PANEL DESTABILIZED", title: "TOO SUCCESSFULLY DISTURBING", text: "你让委员会过度不适。项目被认为具有潜力，但需要在现实世界造成更少的理论震荡。" };
    }
    if (pass) {
      return { passed: true, stamp: "PASSED WITH CONDITIONS", title: "CERTIFIED BULLSHIT DEFENDER", text: "你成功让「" + state.project + "」显得既有概念、又有一点证据、同时仍然足够令人不安。委员会建议继续修改，但这已经是胜利。" };
    }
    if (s.substance < 4 && s.depth + s.confidence >= 18) {
      return { passed: false, stamp: "THEORY WITHOUT FLOOR", title: "MASTER OF STRATEGIC AMBIGUITY", text: "你的语言非常强，项目却还没有足够落地。下次加一点观察、测试或材料证据，哪怕只是象征性地加。" };
    }
    if (s.depth < 8 || s.confidence < 8) {
      return { passed: false, stamp: "INSUFFICIENTLY INEVITABLE", title: "UNRESOLVED SPATIAL PROPOSITION", text: "项目还没有显得非做不可。请提高概念密度，或者把教授的问题改写成更宏大的问题。" };
    }
    return { passed: false, stamp: "OFFICIALLY UNRESOLVED", title: "PROMISING BUT SUSPICIOUS", text: "你差一点通过。委员会感到困惑，但不够困惑。真正的通关秘诀是：一点证据，一点黑话，一点危险的不适。" };
  }

  function finish() {
    state.final = verdict();
    const s = state.scores;
    $("finalStamp").textContent = state.final.stamp;
    $("rank").textContent = state.final.title;
    $("ending").textContent = state.final.text;
    $("scoreDepth").textContent = s.depth;
    $("scoreConfidence").textContent = s.confidence;
    $("scoreSubstance").textContent = s.substance;
    $("scoreDiscomfort").textContent = s.discomfort;
    drawShareCard();
    show("final");
  }

  function wrapCanvasText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
    const hasSpaces = /\s/.test(text);
    const words = hasSpaces ? text.split(/(\s+)/).filter(Boolean) : text.split("");
    let line = "";
    let lines = 0;
    for (const word of words) {
      const test = line + word;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, y);
        y += lineHeight;
        lines += 1;
        line = word.trimStart();
        if (lines >= maxLines - 1) break;
      } else {
        line = test;
      }
    }
    if (line && lines < maxLines) ctx.fillText(line, x, y);
  }

  function drawShareCard() {
    const canvas = $("shareCard");
    const ctx = canvas.getContext("2d");
    const s = state.scores;
    const last = state.history[state.history.length - 1] || {};
    const critique = (last.response || state.final.text || "").replace(/\s+/g, " ");
    const defense = (last.answer || state.statement || "").replace(/\s+/g, " ");
    const discomfortPercent = clamp(Math.round((s.discomfort / 20) * 100), 0, 100);
    const paper = "#efe4d4";
    const ink = "#1f1d1a";
    const red = "#c51d19";
    const tape = "#d7c29c";

    function rect(x, y, w, h, color, alpha = 1) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }

    function tapeLabel(text, x, y, w) {
      ctx.save();
      ctx.fillStyle = tape;
      ctx.globalAlpha = 0.78;
      ctx.fillRect(x, y, w, 38);
      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.font = "700 22px Consolas";
      ctx.fillText(text, x + 14, y + 27);
      ctx.restore();
    }

    function scoreRow(label, value, y, max, color = ink) {
      const x = 170;
      const barX = 430;
      const barW = 360;
      const fill = clamp(value / max, 0, 1);
      ctx.fillStyle = ink;
      ctx.font = "700 24px Consolas";
      ctx.fillText(label, x, y);
      rect(barX, y - 24, barW, 24, "#c8c0b5", 0.85);
      rect(barX, y - 24, barW * fill, 24, color, 0.94);
      ctx.strokeStyle = "#a99d8f";
      ctx.lineWidth = 2;
      ctx.strokeRect(barX, y - 24, barW, 24);
      ctx.fillStyle = color;
      ctx.font = "900 38px Arial";
      ctx.fillText(String(value), 832, y + 5);
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = ink;
    ctx.globalAlpha = 0.075;
    for (let y = 24; y < canvas.height; y += 34) ctx.fillRect(0, y, canvas.width, 2);
    for (let i = 0; i < 46; i += 1) {
      ctx.globalAlpha = 0.08;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 10 + Math.random() * 45, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = ink;
    ctx.font = "700 21px Consolas";
    ctx.fillText("A final review simulator.", 392, 48);
    ctx.font = "900 92px Arial";
    ctx.fillText("DEFEND YOUR", 236, 130);
    ctx.fillStyle = red;
    ctx.font = "900 116px Arial";
    ctx.fillText("BULLSHIT", 288, 230);
    ctx.strokeStyle = red;
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.moveTo(282, 246);
    ctx.lineTo(790, 232);
    ctx.stroke();

    ctx.save();
    ctx.translate(250, 260);
    ctx.rotate(-0.06);
    ctx.strokeStyle = red;
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, 580, 118);
    ctx.fillStyle = red;
    ctx.font = "900 72px Arial";
    ctx.fillText(state.final.passed ? "PASSED" : "FAILED", 118, 76);
    ctx.font = "900 44px Arial";
    ctx.fillText("SUCCESSFULLY", 118, 113);
    ctx.restore();

    tapeLabel("ACADEMIC RANK AWARDED:", 366, 408, 350);
    ctx.fillStyle = ink;
    ctx.font = "900 45px Consolas";
    wrapCanvasText(ctx, state.final.title, 320, 492, 500, 48, 2);
    ctx.strokeStyle = red;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(540, 524, 250, 48, -0.04, 0, Math.PI * 2);
    ctx.stroke();

    scoreRow("CONCEPTUAL DEPTH", s.depth, 642, 24);
    scoreRow("ACADEMIC CONFIDENCE", s.confidence, 700, 24);
    scoreRow("ACTUAL SUBSTANCE", s.substance, 758, 24);
    scoreRow("COMMITTEE DISCOMFORT", s.discomfort, 816, 20, red);

    tapeLabel("COMMITTEE DISCOMFORT INDEX", 172, 872, 390);
    ctx.fillStyle = red;
    ctx.font = "900 76px Arial";
    ctx.fillText(discomfortPercent + "%", 190, 972);
    rect(410, 912, 390, 52, "#f7f0e8", 1);
    ctx.strokeStyle = ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(410, 912, 390, 52);
    const cells = 14;
    for (let i = 0; i < cells; i += 1) {
      const filled = i / cells < discomfortPercent / 100;
      rect(424 + i * 26, 922, 20, 32, filled ? red : "#e0d8cd", 0.96);
    }

    ctx.save();
    ctx.translate(842, 916);
    ctx.fillStyle = "#d8cbbb";
    ctx.beginPath();
    ctx.arc(0, 0, 58, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = "900 44px Consolas";
    ctx.fillText(moodFor(s.discomfort).face, -42, 14);
    ctx.strokeStyle = red;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, 72, -0.4, 1.1);
    ctx.stroke();
    ctx.restore();

    tapeLabel("CRITIQUE EXCERPT:", 134, 1030, 285);
    ctx.fillStyle = ink;
    ctx.font = "700 28px Arial";
    wrapCanvasText(ctx, "“" + critique + "”", 152, 1110, 760, 40, 3);
    ctx.strokeStyle = red;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(150, 1130);
    ctx.quadraticCurveTo(500, 1160, 865, 1122);
    ctx.stroke();

    tapeLabel("YOUR DEFENSE:", 134, 1200, 240);
    ctx.fillStyle = ink;
    ctx.font = "500 25px Arial";
    wrapCanvasText(ctx, defense, 224, 1276, 610, 34, 2);

    ctx.save();
    ctx.translate(906, 1210);
    ctx.rotate(-0.18);
    ctx.strokeStyle = red;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 54, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = "900 62px Arial";
    ctx.fillStyle = red;
    ctx.fillText(state.final.passed ? "B" : "F", -20, 22);
    ctx.restore();

    ctx.fillStyle = ink;
    ctx.font = "700 18px Consolas";
    ctx.fillText(liveUrl, 96, 1326);
  }

  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => alert("已复制到剪贴板")).catch(() => prompt("请手动复制：", text));
    } else {
      prompt("请手动复制：", text);
    }
  }

  function loadCriticPack(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const critics = Array.isArray(parsed) ? parsed : parsed.critics;
        if (!Array.isArray(critics)) throw new Error("Missing critics array");
        state.customCritics = critics.map(c => ({
          name: String(c.name || "GUEST CRITIC").slice(0, 60),
          bias: String(c.bias || "chaos").slice(0, 40),
          biasLabel: String(c.biasLabel || c.bias || "imported chaos").slice(0, 80),
          questions: Array.isArray(c.questions) ? c.questions.map(q => String(q).slice(0, 180)) : ["你如何为这个决定负责？"],
          topic: ["experience", "form", "power", "evidence", "memory"].includes(c.topic) ? c.topic : "form",
          preference: c.preference && typeof c.preference === "object" ? c.preference : { depth: 1, confidence: 1, substance: 0, discomfort: 1 }
        }));
        $("criticPackStatus").textContent = "已导入 " + state.customCritics.length + " 个奇葩教授。下一局会随机抽取。";
      } catch (error) {
        $("criticPackStatus").textContent = "导入失败：JSON 需要包含 critics 数组。";
      }
    };
    reader.readAsText(file);
  }

  $("random").addEventListener("click", () => {
    $("project").value = random(pack().projects);
  });
  $("generate").addEventListener("click", () => {
    state.project = $("project").value.trim() || random(pack().projects);
    $("project").value = state.project;
    statement();
  });
  $("regenerate").addEventListener("click", statement);
  $("copyStatement").addEventListener("click", () => copy(state.statement));
  $("beginReview").addEventListener("click", () => {
    state.round = 0;
    state.history = [];
    state.scores = { depth: 0, confidence: 0, substance: 0, discomfort: 0 };
    state.final = null;
    buildPanel();
    critique();
  });
  $("submitDefense").addEventListener("click", submit);
  $("nextRound").addEventListener("click", () => {
    state.round += 1;
    if (state.round >= 3) finish();
    else critique();
  });
  $("restart").addEventListener("click", () => show("setup"));
  $("stitchSentence").addEventListener("click", () => appendAnswer(stitchedSentence()));
  $("criticPackFile").addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (file) loadCriticPack(file);
  });
  $("copyResult").addEventListener("click", () => {
    const s = state.scores;
    copy("DEFEND YOUR BULLSHIT / FINAL REVIEW\n" + state.final.title + "\nPROJECT: " + state.project + "\nCONCEPTUAL DEPTH: " + s.depth + "\nACADEMIC CONFIDENCE: " + s.confidence + "\nACTUAL SUBSTANCE: " + s.substance + "\nCOMMITTEE DISCOMFORT: " + s.discomfort + "\n" + liveUrl);
  });
  $("downloadCard").addEventListener("click", () => {
    drawShareCard();
    const link = document.createElement("a");
    link.download = "defend-your-bullshit-result.png";
    link.href = $("shareCard").toDataURL("image/png");
    link.click();
  });

  addSelects();
  $("random").click();
})();
