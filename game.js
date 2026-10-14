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
    strategyDraft: null,
    useGeneratedStrategy: true,
    reviewSubmitting: false,
    round: 0,
    scores: { depth: 0, confidence: 0, substance: 0, discomfort: 0 },
    chosen: 0,
    question: null,
    professor: null,
    panel: [],
    criticPool: [],
    seatEvents: [],
    history: [],
    final: null,
    customCritics: [],
    jobId: null
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

  function show(id) {
    for (const x of ["career", "setup", "statement", "defense", "final", "sessionHistory", "welcome"]) $(x).hidden = x !== id;
    $("helpToggle").hidden = id === "welcome";
    $("optionalDock").hidden = id !== "setup";
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
    critics.reset();
    questions.reset();
    const disciplinePool = pack().id === "architecture" ? professorPool : base.map(professor => ({
      ...professor,
      biasLabel: "BIAS: " + professor.bias,
      preference: {
        depth: professor.bias === "form" ? 1 : 0,
        confidence: 1,
        substance: professor.bias === "evidence" ? 2 : 0,
        discomfort: professor.bias === "power" ? 1 : 0
      }
    }));
    state.criticPool = base.concat(disciplinePool, custom);
    state.seatEvents = [];
    state.panel = shuffle(state.criticPool).slice(0, 3).map(critics.cast);
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
    const first = "本项目并不试图简单地" + project + "，而是将这一看似微不足道的操作视作一次关于" + a + "的" + (p.practice || "空间实践") + "。通过改变观看和行动的既定方式，作品试图重新审视主体与环境之间的关系。";
    const second = "在这一过程中，" + project + "不再仅仅是一项物理动作，而逐渐被转译为一种围绕" + b + "展开的开放系统。材料、时间与参与者的介入共同塑造了作品中不断变化的意义。";
    const third = "我们特别关注过程而非结果：随着形式被重复、修正和重新感知，原本稳定的空间界线变得难以确定。由此，" + c + "并非附着于形式之上的解释，而成为设计发生的条件。";
    const final = "最终，真正需要讨论的并非项目是否完成，而是我们为什么仍旧假设空间必须被完成。作品试图将这个无法被轻易解决的问题留给每一个参与者。";
    // Change the argument itself, rather than swapping a few nouns in one template.
    const variants = [
      [first, second, third, final],
      ["与其把「" + project + "」理解成一个需要被证明有用的方案，我们更愿意将它作为研究「" + a + "」的切入口。它的价值来自问题如何被提出，而非答案如何被包装。",
       "方法上，我们从参与者的实际行动出发，记录材料、时间与反馈的变化，再用「" + b + "」重新组织这些观察。每一次偏离预期的使用，都可能修正项目的前提。",
       "因此，「" + c + "」不是最终结论，而是一组可以被比较和检验的假设。我们希望通过小尺度试验，让抽象的立场留下具体的痕迹。",
       "项目的完成并不意味着讨论终止。它更像一份可继续修改的提案，邀请参与者共同决定下一步。"],
      ["「" + project + "」看似只是一个简单决定，却暴露了我们对「" + a + "」的默认理解。本项目从这个矛盾开始，尝试让习以为常的秩序重新成为问题。",
       "我们把「" + b + "」转化为可被体验的情境，而非停留在概念描述。通过调整介入的尺度与顺序，项目让不同参与者对同一件事产生不同判断。",
       "这里的关键不在于形式是否独特，而在于「" + c + "」如何改变行动的可能性。设计必须允许质疑、误读与重新使用，这些反馈构成它持续发展的依据。",
       "最终，我们保留的不是一个封闭答案，而是一种讨论机制：让项目在不断被回应的过程中获得新的意义。"]
    ];
    state.statementVariant = ((state.statementVariant ?? -1) + 1) % variants.length;
    state.statement = variants[state.statementVariant].slice(0, intensity + 1).join("\n\n");
    $("statementProject").textContent = state.project;
    renderStatement([a, b, c]);
    show("statement");
  }

  function renderStatement(concepts) {
    const container = $("generated");
    container.replaceChildren();
    const labels = ["01 / 起手：重新定义", "02 / 展开：把动作讲成系统", "03 / 加码：让概念接管现场", "04 / 收束：把问题留给评委"];
    const terms = [...new Set([...concepts, "研究", "假设", "观察", "比较", "检验", "试验", "参与者", "过程而非结果", "问题", "意义"])].sort((a,b)=>b.length-a.length);
    state.statement.split("\n\n").forEach((paragraph,index)=>{
      const section = document.createElement("section");
      section.className = "speech-beat" + (index===0 ? " speech-lead" : "");
      const label = document.createElement("p");label.className="speech-label";label.textContent=labels[index];
      const body = document.createElement("p");body.className="speech-body";
      let offset=0, plain="";
      const flush=()=>{if(plain){body.append(document.createTextNode(plain));plain=""}};
      while(offset<paragraph.length){
        const term=terms.find(word=>paragraph.startsWith(word,offset));
        if(term){flush();const mark=document.createElement("strong");mark.className=concepts.includes(term)?"speech-concept":"speech-keyword";mark.textContent=term;body.append(mark);offset+=term.length}
        else {plain+=paragraph[offset];offset++}
      }
      flush();section.append(label,body);container.append(section);
    });
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
    const scenario = professional() ? career.snapshot().active?.scenario : null;
    const oldWound = scenario?.id === "trauma" && /大师|导师|柯布|库尔|密斯|扎哈|安藤/.test(answer);
    if (oldWound) discomfort += 2;
    const steadied = scenario?.id === "stress" && /理解|先稳|慢慢|一步|先记录|先测试/.test(answer);
    if (steadied) { confidence += 1; discomfort -= 1; }

    const lucky = style !== "battle" && Math.random() < 0.38;
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
    const heard = [...new Set([...a.topic.keywords, ...pack().vocabulary, ...pack().topics.find(t=>t.id==="evidence").keywords])].filter(term=>answer.includes(term)).slice(0,6);
    if(heard.length) reasons.push("评委听到：" + heard.map(term=>"「"+term+"」").join("、"));
    reasons.push(a.onTopic ? "回答触及「" + a.topic.label + "」" : "没有正面回应「" + a.topic.label + "」");
    if (a.evidence > 0) reasons.push("出现了测试、记录或验证线索");
    if (a.inflated >= 3) reasons.push("概念密度偏高");
    if (a.evasions >= 2) reasons.push("使用了问题反转或概念转移");
    if (tooHonest) reasons.push("诚实程度危险");
    if (eraseDesign) reasons.push("触发删除设计逻辑");
    if (lucky) reasons.push(random(absurdReasons));
    if (oldWound) reasons.push("大师的名字触发旧评图记忆，不适 +2");
    if (steadied) reasons.push("稳住客户的表达，自信 +1，不适 -1");

    const taste=window.DYB_CRITIC_TASTES.evaluate({bias:state.professor.bias,topic:question.topic,style,analysis:a,answer});
    return {
      depth: Math.max(0,clamp(depth,0,9)+taste.delta.depth),
      confidence: Math.max(0,clamp(confidence,0,9)+taste.delta.confidence),
      substance: clamp(substance,-2,9)+taste.delta.substance,
      discomfort: clamp(discomfort,0,10)+taste.delta.discomfort,
      taste,
      tags,
      reason: reasons.map(reason=>reason.replace(/[。；\s]+$/g, "")).join("；") + "。",
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
    $("reviewFace").textContent=mood.face;
    $("reviewPresenceText").textContent=mood.note;
    $("moodLabel").textContent = mood.label;
    $("moodNote").textContent = mood.note;
    $("reviewProject").textContent=state.project;
    $("reviewProfessor").textContent=state.professor?.name||"评委";
    const taste=window.DYB_CRITIC_TASTES.describe({bias:state.professor?.bias,topic:state.question?.topic});
    const focus=pack().topics.find(t=>t.id===state.question?.topic)?.label||"具体论证";
    $("reviewBias").textContent=taste.summary;
    $("reviewFocus").textContent="本轮关注："+focus;
    $("biasLabel").textContent = state.professor?.biasLabel || "BIAS: undecided";
  }

  function passStatus() {
    const s = state.scores;
    const items = [
      {short:"概",label:"概念深度 / Conceptual Depth",score:s.depth,goal:8,max:8,ok:s.depth>=8,hint:"目标至少 8 分"},
      {short:"自",label:"学术自信 / Academic Confidence",score:s.confidence,goal:8,max:8,ok:s.confidence>=8,hint:"目标至少 8 分"},
      {short:"实",label:"实际内容 / Actual Substance",score:s.substance,goal:4,max:4,ok:s.substance>=4,hint:"目标至少 4 分"},
      {short:"压",label:"评委不适 / Committee Discomfort",score:s.discomfort,goal:15,max:20,ok:s.discomfort>=4&&s.discomfort<=15,hint:s.discomfort>15?"超过 15，委员会过度不适":s.discomfort<4?"还需达到 4 分":"保持在 4—15 分"}
    ];
    const overview=$("scoreOverview");overview.replaceChildren();
    overview.setAttribute("aria-label","本局分数："+items.map(item=>item.label.split(" / ")[0]+item.score+" 分").join("，")+"。点击展开详情。");
    $("passChecklist").replaceChildren();
    for(const item of items){
      const percent=Math.max(0,Math.min(100,item.score/item.max*100));
      const tone=item.short==="压"&&item.score>15?"over":item.ok?"ok":"wait";
      const mini=document.createElement("span");mini.className="score-mini "+tone;
      const value=document.createElement("span");value.textContent=item.short+" "+item.score;
      const track=document.createElement("span");track.className="score-mini-track";track.setAttribute("aria-hidden","true");
      const fill=document.createElement("span");fill.style.width=percent+"%";track.append(fill);mini.append(value,track);overview.append(mini);
      const row=document.createElement("div");row.className="check score-detail "+tone;
      const status=document.createElement("span");status.textContent=item.ok?"达标":"未达标";
      const label=document.createElement("strong");label.textContent=item.label;
      const total=document.createElement("em");total.textContent=item.score+"/"+item.goal;
      const bar=document.createElement("div");bar.className="score-health-track";
      bar.setAttribute("role","meter");bar.setAttribute("aria-label",item.label+"，"+item.hint);
      bar.setAttribute("aria-valuemin","0");bar.setAttribute("aria-valuemax",String(item.max));bar.setAttribute("aria-valuenow",String(Math.max(0,Math.min(item.max,item.score))));bar.setAttribute("aria-valuetext",item.score+" 分，"+item.hint);
      if(item.short==="压"){bar.classList.add("discomfort-track");const range=document.createElement("span");range.className="score-safe-range";bar.append(range)}
      const health=document.createElement("span");health.className="score-health-fill";health.style.width=percent+"%";bar.append(health);
      const hint=document.createElement("small");hint.textContent=item.hint;
      row.append(status,label,total,bar,hint);$("passChecklist").append(row);
    }
  }

  function critique() {
    const scheduled = state.panel[state.round];
    const event = critics.replace(state.round, state.scores, scheduled, state.criticPool);
    state.professor = event ? event.incoming : scheduled;
    if(!state.professor.imported){
      const preId=professional()&&state.round===0?career.snapshot().active?.scenario?.id:null;
      const preferredTopic=preId==="evidence"?"evidence":preId==="trauma"?"memory":state.professor.topic;
      const selected=questions.pick({pack:pack().id,project:state.project,topic:preferredTopic,forceTopic:preId==="evidence"||preId==="trauma",round:state.round,answer:state.history.at(-1)?.answer||"",scores:state.scores});
      state.professor={...state.professor,question:selected.text,topic:selected.topic,questionId:selected.id};
    }
    const scenario = professional() ? career.snapshot().active?.scenario : null;
    if (state.round === 0 && scenario) {
      if (scenario.id === "evidence") {
        state.professor = { ...state.professor, bias: "evidence", biasLabel: "BIAS: 先给依据，再谈概念", question: "上次你没有解释依据。这次请用具体材料回应：" + state.professor.question, topic: "evidence", preference: { ...state.professor.preference, substance: 2 } };
      } else if (scenario.id === "trauma") {
        state.professor = { ...state.professor, bias: "memory", biasLabel: "BIAS: 对拼贴大师的名字有旧伤", question: "不要再借勒·柯布哈兹的名字。请用你自己的判断回答：" + state.professor.question, topic: "memory", preference: { ...state.professor.preference, discomfort: 1 } };
      } else if (scenario.id === "stress") {
        state.professor = { ...state.professor, question: "你的客户前几次都没讲清楚。你来接手，就能改变什么？ " + state.professor.question };
      }
    }
    state.panel[state.round] = state.professor;
    $("seatEvent").hidden = !event;
    if (event) {
      state.seatEvents.push({ round: state.round + 1, ...event });
      $("seatEventTitle").textContent = event.title;
      $("seatEventText").textContent = event.message + " 新评委的偏好和提问已生效，本轮次数与已有分数保留。";
    }
    state.question = { text: state.professor.question, topic: state.professor.topic };
    $("roundLabel").textContent = "ROUND " + (state.round + 1) + " / 3";
    $("professorLabel").textContent = state.professor.name;
    $("criticRole").textContent = state.professor.role;
    $("question").textContent = state.question.text;
    $("strategies").replaceChildren();
    pack().strategies.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.className = "strategy";
      btn.type = "button";
      const title = document.createElement("strong");
      title.textContent = s.name;
      const description = document.createElement("span");
      description.textContent = strategyTarget(s);
      btn.append(title, description);
      btn.addEventListener("click", () => {
        writeStrategy(i);
      });
      $("strategies").append(btn);
    });
    const voiceButton=document.createElement("button");voiceButton.type="button";voiceButton.className="voice-choice"+(pack().strategies.length%2===0?" full-width":"");voiceButton.id="normalVoiceChoice";
    const voiceTitle=document.createElement("strong");voiceTitle.textContent="长按语音回答";const voiceHint=document.createElement("span");voiceHint.textContent="说完点结束，再检查文字";voiceButton.append(voiceTitle,voiceHint);normalVoice.bind(voiceButton);$("strategies").append(voiceButton);
    normalVoice.reset();
    state.chosen = 0;
    state.reviewSubmitting=false;
    $("rewriteStrategy").disabled=false;$("editStrategy").disabled=false;
    $("strategyPreview").textContent="";
    state.strategyDraft=null;
    $("customReply").open=false;
    $("reviewDock").hidden=false;
    updateChoice();
    updateMood();
    passStatus();
    $("customAnswer").value = "";
    $("feedbackBlock").hidden = true;
    $("submitDefense").disabled = false;
    $("submitDefense").textContent = "DEFEND YOUR PROJECT";
    show("defense");
    writeStrategy(0);
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
      "必须逐字引用玩家回答开头的这段原文：「" + answer.slice(0,16) + "」。指出它如何回应教授问题、哪里缺少证据。不得编造海报、长椅等无关场景，不写诗，不用空洞隐喻。",
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
      const result = provider === "ollama" ? await fetchOllama(prompt) : await fetchPollinations(prompt);
      return answer.length >= 6 && result.length <= 400 && result.includes(answer.slice(0,16)) && !/<html|<!doctype|unauthorized|api key/i.test(result) ? result : "";
    } catch (error) {
      console.warn("AI feedback failed, falling back to local rules:", error);
      return "";
    }
  }

  async function submit() {
    if ($("submitDefense").disabled || state.reviewSubmitting || (professional() && !career.snapshot().active)) return;
    state.reviewSubmitting=true;
    document.querySelectorAll(".strategy,.voice-choice").forEach(button=>button.disabled=true);
    $("rewriteStrategy").disabled=true;$("editStrategy").disabled=true;
    const choice = pack().strategies[state.chosen];
    const custom = state.useGeneratedStrategy ? "" : $("customAnswer").value.trim();
    const answer = custom || state.strategyDraft?.text || choice.answer;
    writer.cancel();strategyVersion++;
    const beforeFace=$("professorFace").textContent;
    reaction.thinking({from:beforeFace,name:state.professor.name});
    const grading = evaluate(answer,state.question,custom||state.strategyDraft?.source==="voice"?"manual":choice.style);
    for (const key of Object.keys(state.scores)){state.scores[key]+=grading[key];if(key!=="substance")state.scores[key]=Math.max(0,state.scores[key]);}

    $("submitDefense").disabled = true;
    $("submitDefense").textContent = "PROFESSOR IS THINKING...";
    const mainTag = grading.tags[0];
    const excerpt=answer.split(/[。！？\n]/).find(Boolean)||answer;
    const localResponse = "你说「" + excerpt.slice(0,42) + (excerpt.length>42?"…":"") + "」。\n" + random(contradictionPool[mainTag]);
    const trigger = battle.pickTrigger(state.scores, grading);
    const aiResponse = trigger ? "" : await optionalAiFeedback(answer, grading);
    const response = [aiResponse||localResponse,grading.taste.reason].filter(Boolean).join("\n\n");
    $("submitDefense").textContent = trigger ? "已进入现实 BATTLE" : "答辩已提交";
    $("feedback").textContent = response;
    $("feedbackReason").textContent = grading.reason;
    $("submittedAnswer").textContent = answer;
    $("feedbackPoints").open=false;
    $("feedbackOriginal").open=false;
    const signed=value=>(value>=0?"+":"")+value;
    $("scoreChange").textContent="DEPTH "+signed(grading.depth)+"  CONFIDENCE "+signed(grading.confidence)+"  SUBSTANCE "+signed(grading.substance)+"  DISCOMFORT "+signed(grading.discomfort)+(aiResponse?"  AI VARIATION ON":"  LOCAL RULES");
    state.history.push({ professor: state.professor.name, question: state.question.text, answer, grading, response, ai: Boolean(aiResponse), draftSource: custom ? "manual" : state.strategyDraft?.source || "preset" });
    $("feedbackBlock").hidden = false;
    $("nextRound").textContent = state.round === 2 ? "FINAL VERDICT" : "NEXT CRITIQUE";
    updateMood();
    passStatus();
    $("nextRound").disabled = Boolean(trigger);
    const enterBattle=()=>{if (trigger) {
      battle.open(trigger, state.professor.name, state.project, answer => {
        const grading = evaluate(answer, state.question, "battle");
        return {
          scores: {
            depth: Math.max(0,Math.min(3,Math.floor((grading.depth-grading.taste.delta.depth)/2))+grading.taste.delta.depth),
            confidence: Math.max(0,Math.min(3,Math.floor((grading.confidence-grading.taste.delta.confidence)/2))+grading.taste.delta.confidence),
            substance: clamp(grading.substance-grading.taste.delta.substance,-1,3)+grading.taste.delta.substance,
            discomfort: Math.min(3,Math.floor((grading.discomfort-grading.taste.delta.discomfort)/2))+grading.taste.delta.discomfort
          },
          reason: [grading.reason,grading.taste.reason].filter(Boolean).join("\n")
        };
      }, result => {
        const oldFace=$("professorFace").textContent;
        reaction.thinking({from:oldFace,name:state.professor.name});
        for (const key of Object.keys(state.scores)) {
          state.scores[key] += result.scores[key];
          if (key !== "substance") state.scores[key] = Math.max(0, state.scores[key]);
        }
        state.history[state.history.length - 1].battle = result;
        updateMood();
        passStatus();
        $("nextRound").disabled = false;
        reaction.resolve({to:$("professorFace").textContent,text:"评委听完你的补充，重新看了一眼项目。\n"+result.response});
      }, { vocabulary: pack().vocabulary, discipline: pack().id, topic: state.question.topic, question: state.question.text, previousAnswer: answer, followUp: questions.pick({pack:pack().id,project:state.project,topic:state.question.topic,round:state.round,answer,stage:"battle",scores:state.scores}).text });
    }};
    $("reviewDock").hidden=true;
    const reactionLead=grading.taste.kind==="pleased"?"评委听到自己感兴趣的侧面，身体往前倾了一点。":grading.taste.kind==="angry"?"评委发现你在跳过问题，眉头又紧了一点。":(grading.substance>=3&&grading.depth>=3?"评委若有所思：这个项目可能真的有点意思。":grading.discomfort>=6?"评委皱起眉头，重新审视你的说法。":grading.substance>=3?"评委停下笔，认真看了看你给的依据。":"评委沉默片刻，似乎还在等更明确的解释。");
    const expression=grading.taste.kind==="angry"?">:|":grading.taste.kind==="pleased"?":-)":grading.substance>=3&&grading.depth>=3?"o_o":grading.tags.includes("tooConceptual")?">:|":grading.tags.includes("tooHonest")?":-?":grading.substance>=3?":-)":":-/";
    $("professorFace").textContent=expression;$("reviewFace").textContent=expression;
    $("reviewPresenceText").textContent=reactionLead;
    reaction.resolve({to:expression,text:reactionLead+"\n"+response,onContinue:enterBattle});
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
    const settlement = professional() ? career.settle(state.jobId, state.final, state.scores) : {ok:true,passed:state.final.passed,message:"本局已独立结算，并加入历史。"};
    if (settlement.ok && !settlement.passed && state.final.passed) {
      state.final = { passed: false, stamp: "CLIENT REJECTED", title: "过了评图，没过客户验收", text: settlement.message };
    }
    const s = state.scores;
    $("finalStamp").textContent = state.final.stamp;
    $("rank").textContent = state.final.title;
    $("ending").textContent = state.final.text;
    $("scoreDepth").textContent = s.depth;
    $("scoreConfidence").textContent = s.confidence;
    $("scoreSubstance").textContent = s.substance;
    $("scoreDiscomfort").textContent = s.discomfort;
    $("careerSettlement").textContent = settlement.message + (professional() ? (career.snapshot().closed ? " 黑名单达到 3 次，账号已停用，请返回俱乐部销号重开。" : " 回俱乐部处理下一件事，补货或接新单。") : " 每一局重新从零计算，无需购买物资。");
    play.record({mode:professional()?"career":"simple",project:state.project,theme:state.packId || $("pack").value,verdict:state.final,scores:state.scores,rounds:state.history});
    $("careerInvitation").hidden = play.snapshot().invitation !== "pending";
    $("restart").textContent = professional()?"返回俱乐部":"再玩一局";
    drawShareCard();
    show("final");
  }

  function drawShareCard() {
    const last = state.history[state.history.length - 1] || {};
    window.DYB_SHARE_CARD.draw($("shareCard"), {
      project: state.project,
      verdict: state.final,
      scores: state.scores,
      critique: last.response || state.final.text || "",
      defense: last.answer || state.statement || "",
      careerTitle: professional() ? career.snapshot().tierName : "简易单局",
      url: liveUrl
    });
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

  const battle = window.DYB_BATTLE.create();
  let strategyVersion=0;
  const writer=window.DYB_STRATEGY_WRITER.create({request:async(prompt,{signal,provider,model})=>{
    if(provider==="ollama"){
      const response=await fetch("http://localhost:11434/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model,prompt,stream:false}),signal});
      if(!response.ok)throw Error("model unavailable");return String((await response.json()).response||"").trim();
    }
    const response=await fetch("https://text.pollinations.ai/"+encodeURIComponent(prompt)+"?model=openai&seed="+Math.floor(Math.random()*999999999),{signal,referrerPolicy:"no-referrer"});
    if(!response.ok)throw Error("接口返回 HTTP "+response.status);return (await response.text()).trim();
  }});
  function strategyTarget(strategy){
    const labels={experience:"身体体验",form:"形式决定",power:"公共权力",evidence:"证据缺口",memory:"记忆与时间"};
    const topic=labels[state.question.topic]||"当前判断";
    const goals={jargon:"从感知解释",deflect:"反问评判规则：",evidence:"给出验证方法：",honest:"承认具体限制：",erase:"比较删除之后：",balanced:"具体理由 + 方法："};
    return (goals[strategy.style]||goals.balanced)+topic;
  }
  async function writeStrategy(index){
    if(state.reviewSubmitting)return;
    state.useGeneratedStrategy=true;
    $("normalVoiceChoice")?.classList.remove("selected");
    const version=++strategyVersion;state.chosen=index;state.strategyDraft=null;updateChoice();
    const base=pack().strategies[index];
    const strategy={...base,target:strategyTarget(base)};
    $("strategyPreviewPanel").open=true;
    $("strategyPreview").textContent="正在围绕「"+state.project+"」现编「"+strategy.name+"」……";
    $("strategyDraftStatus").textContent=$("strategyMode").value==="ai"?"AI 正在现编 · "+strategy.target+"。":"离线话术编写中。";
    $("submitDefense").disabled=true;$("submitDefense").textContent="话术正在生成…";
    $("reviewPresenceText").textContent="你准备采用「"+strategy.name+"」。评委正等你把理由说清楚。";
    const result=await writer.generate({project:state.project,question:state.question.text,strategy,discipline:pack().name,criticInterest:window.DYB_CRITIC_TASTES.describe({bias:state.professor.bias,topic:state.question.topic}).summary},{mode:$("strategyMode").value,provider:$("aiProvider").value,model:$("ollamaModel").value});
    if(!result||version!==strategyVersion)return;
    state.strategyDraft=result;$("strategyPreview").textContent=result.text;
    $("strategyDraftStatus").textContent=result.source==="ai"?"AI 现编 · 可以重编或修改，提交这段文字参与评分。":result.unavailable?"AI 暂时未返回有效新话术，已切换为离线回答。原因："+(result.failure||"未获得有效内容")+"。":"离线回答 · 可重编或自行修改。";
    $("submitDefense").disabled=false;$("submitDefense").textContent="提交这段回应";
  }
  $("customAnswer").addEventListener("input",()=>{
    if(state.reviewSubmitting)return;
    state.useGeneratedStrategy=false;
    if($("customAnswer").value.trim()){
      writer.cancel();strategyVersion++;
      $("submitDefense").disabled=false;$("submitDefense").textContent="提交自己的回答";
      $("strategyDraftStatus").textContent="提交时优先使用你填写的自由回答。";
    }else if(!state.strategyDraft){writeStrategy(state.chosen)}
  });
  $("rewriteStrategy").addEventListener("click",()=>writeStrategy(state.chosen));
  $("editStrategy").addEventListener("click",()=>{if(!state.strategyDraft)return;$("customReply").open=true;$("customAnswer").value=state.strategyDraft.text;state.useGeneratedStrategy=false;$("submitDefense").textContent="提交自己修改的回答";$("customAnswer").focus();});
  let voiceBackup=null;
  const normalVoice=window.DYB_NORMAL_VOICE.create({
    canStart:()=>!state.reviewSubmitting&&!$("defense").hidden,
    onStatus:text=>{$("strategyPreviewPanel").open=true;$("strategyDraftStatus").textContent=text;},
    onBegin:()=>{voiceBackup={draft:state.strategyDraft,useGenerated:state.useGeneratedStrategy};writer.cancel();strategyVersion++;state.strategyDraft=null;state.useGeneratedStrategy=true;$("strategyPreviewPanel").open=true;$("strategyPreview").textContent="正在听你说…";$("reviewDock").hidden=true;$("submitDefense").disabled=true;document.querySelectorAll('.strategy').forEach(button=>button.classList.remove('selected'));$("normalVoiceChoice").classList.add('selected');},
    onTranscript:text=>{$("strategyPreview").textContent=text;},
    onFinish:(text,meta)=>{
      if(meta.cancelled&&voiceBackup){state.strategyDraft=voiceBackup.draft;state.useGeneratedStrategy=voiceBackup.useGenerated;$("reviewDock").hidden=false;$("strategyPreview").textContent=state.strategyDraft?.text||"录制已取消，选择策略或自行回答。";$("strategyDraftStatus").textContent="录制已取消，保留原来的回答。";$("submitDefense").disabled=!(state.strategyDraft?.text||$("customAnswer").value.trim());$("submitDefense").textContent="提交这段回应";return;}
      $("reviewDock").hidden=false;state.strategyDraft={text,source:"voice"};state.useGeneratedStrategy=true;$("strategyPreview").textContent=text||"没有识别出可提交的文字。你可以直接补充，或用手机键盘的麦克风输入。";
      $("strategyDraftStatus").textContent=meta.cancelled?"录制已取消，可以重录或自行回答。":text?"语音已转为文字 · 可修改后提交。":"录音未能自动转写。请补充文字后再提交。";
      $("submitDefense").disabled=!text;$("submitDefense").textContent="提交这段语音回答";
      if(!text){$("customReply").open=true;$("customAnswer").focus();}
    }
  });
  const questions=window.DYB_QUESTIONS.create();
  const reaction=window.DYB_REACTION.create();
  const critics = window.DYB_CRITICS.create();
  const play = window.DYB_PLAY.create();
  const professional = () => play.snapshot().mode === "career";
  let career = null;
  let careerUI = null;
  career = window.DYB_CAREER.create({ onChange: () => { if (careerUI) careerUI.render(); } });
  function openJob(job) {
    play.mode("career"); syncMode();
    if (career.snapshot().closed) return;
    state.jobId = job.id;
    state.project = job.project || "";
    $("pack").value = job.theme;
    $("pack").disabled = true;
    $("project").value = job.project || random(pack().projects);
    const unlocked = career.snapshot().unlocked.map(theme => theme.id);
    for (const option of $("pack").options) option.disabled = !unlocked.includes(option.value);
    $("jobBrief").textContent = "CLIENT: " + job.client + " / " + job.scene + "\n验收通过 ¥" + job.reward + " · 经验 +10" + (job.scenario ? "\nPRE 情境：" + job.scenario.name + "\n" + job.scenario.brief + "\n" + job.scenario.goal : "") + (job.mission ? "\n" + job.mission.label + "：" + job.mission.goal : "");
    show("setup");
  }
  careerUI = window.DYB_CAREER_UI.create({ career, onAccept: openJob, show });
  $("backToClub").addEventListener("click", () => {
    career.setProject($("project").value);
    careerUI.render(); show("career");
  });
  $("project").addEventListener("change", () => career.setProject($("project").value));

  $("random").addEventListener("click", () => {
    $("project").value = random(pack().projects);
  });
  $("generate").addEventListener("click", () => {
    if (professional() && (!career.snapshot().active || career.snapshot().closed)) return;
    state.project = $("project").value.trim() || random(pack().projects);
    $("project").value = state.project;
    if (professional()) career.setProject(state.project);
    statement();
  });
  $("regenerate").addEventListener("click", statement);
  $("copyStatement").addEventListener("click", () => copy(state.statement));
  $("beginReview").addEventListener("click", () => {
    if (professional() && (!career.snapshot().active || career.snapshot().closed)) return;
    battle.reset();
    state.round = 0;
    state.history = [];
    state.scores = { ...((professional() && career.snapshot().active?.scenario?.opening) || { depth: 0, confidence: 0, substance: 0, discomfort: 0 }) };
    state.final = null;
    buildPanel();
    critique();
  });
  $("submitDefense").addEventListener("click", submit);
  $("nextRound").addEventListener("click", () => {
    if (battle.isPending()) return;
    battle.hide();
    state.round += 1;
    if (state.round >= 3) finish();
    else critique();
  });
  $("restart").addEventListener("click", () => { if(professional()){careerUI.render();show("career")}else openSimple(); });
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
  function syncMode() {
    $("careerStrip").hidden=!professional();
    $("backToClub").hidden=!professional();
    $("jobBrief").hidden=!professional();
    $("modeLabel").textContent=professional()?"学术嘴替 · 俱乐部生涯":"简易单局 · 上台就开讲";
    $("packHint").textContent=professional()?"通过累计通关解锁新主题，在俱乐部选择对应委托。":"直接选择主题，每局分数独立计算。";
    $("enterCareer").hidden=play.snapshot().invitation!=="accepted";
  }
  function openSimple() {
    play.mode("simple");battle.reset();state.jobId=null;syncMode();
    $("pack").disabled=false;for(const option of $("pack").options)option.disabled=false;
    show("setup");
  }
  $("pack").addEventListener("change",()=>{if(!professional()) $("random").click()});
  $("returnSimple").addEventListener("click",openSimple);
  $("enterCareer").addEventListener("click",()=>{play.mode("career");syncMode();careerUI.render();show("career")});
  $("acceptInvitation").addEventListener("click",()=>{if(play.choose(true)){syncMode();careerUI.render();show("career")}});
  $("declineInvitation").addEventListener("click",()=>{play.choose(false);$("careerInvitation").hidden=true;$("careerSettlement").textContent="继续简易版。每局独立计算，随时查看历史。"});
  let historyReturn="setup";
  $("viewHistory").addEventListener("click",()=>{
    historyReturn=professional()?"career":"setup";
    const list=$("historyList");list.replaceChildren();
    const sessions=play.snapshot().history;
    if(!sessions.length){const empty=document.createElement("p");empty.textContent="还没有完成的单局。完成三轮后，记录会出现在这里。";list.append(empty)}
    for(const entry of sessions){
      const item=document.createElement("details"), title=document.createElement("summary"), body=document.createElement("div");
      title.textContent="#"+entry.id+" · "+(entry.mode==="career"?"职业":"简易")+" · "+(entry.verdict.passed?"通过":"未通过")+" · "+entry.project;
      const result=document.createElement("p");result.textContent=new Date(entry.date).toLocaleString()+" / "+entry.verdict.title+" · 深度 "+entry.scores.depth+" / 自信 "+entry.scores.confidence+" / 实质 "+entry.scores.substance+" / 不适 "+entry.scores.discomfort;body.append(result);
      entry.rounds.forEach((round,i)=>{const answer=document.createElement("p");answer.textContent="ROUND "+(i+1)+" / "+round.answer;body.append(answer);const feedback=document.createElement("p");feedback.textContent=round.response||"";body.append(feedback)});
      item.append(title,body);list.append(item);
    }
    show("sessionHistory");
  });
  $("historyBack").addEventListener("click",()=>show(historyReturn));
  syncMode();
  $("startGame").addEventListener("click",()=>{if(professional()){careerUI.render();show("career")}else openSimple()});
  $("helpToggle").addEventListener("click",()=>$("helpDialog").showModal());
  $("optionalToggle").addEventListener("click",()=>$("optionalDialog").showModal());
  document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>$(button.dataset.close).close()));
  show("welcome");
})();

