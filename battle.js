/* The original magnetic-word collage, now a timed, conditionally triggered battle. */
(() => {
  "use strict";
  const duration = 20;
  const order = ["opening", "move", "concept", "proof"];
  const labels = { opening: "拖一个开场", move: "拖一个动作", concept: "拖一个概念", proof: "拖证据或离谱理由" };
  const encounters = {
    pressure: { title: "等等，这一点还没有说清楚。", reason: "不适值首次达到 10，评委中断陈述，要求澄清当前论证。", lead: "请直接解释，不要再换一个更大的概念。" },
    admiration: { title: "这个概念有意思，能展开一点吗？", reason: "触发欣赏型追问：评委想了解概念如何在项目里成立。", lead: "这个判断有潜力，但我想知道它具体如何发生。" },
    surprise: { title: "我想追问一个具体问题。", reason: "随机突发追问：评委要求补充解释或依据。", lead: "先停在这一点，我们把它讲清楚。" }
  };
  const followUps = {
    experience: "你说的体验具体发生在哪一个时刻？谁在使用，它如何改变了人的行动？",
    form: "为什么必须采用这个形式？如果换一种形式，你最重要的判断还成立吗？请说出依据。",
    power: "这个安排具体让谁受益，又排除了谁？你如何判断，而不是只宣称它具有公共性？",
    evidence: "你具体观察了什么、记录了哪些变化？这些证据如何支持你刚才的判断？",
    memory: "你引用的记忆或历史，具体改变了项目的哪个决定？请解释两者的联系。"
  };

  function create() {
    const $ = id => document.getElementById(id);
    let pressureTriggered = false;
    let phase = "idle";
    let timer = null;
    let deadline = 0;
    let remaining = 0;
    let paused = false;
    let active = null;
    let grade = null;
    let onResolve = null;
    let selected = null;
    let slots = {};
    let tokens = [];
    let chaos = 0;
    let professorLeft = false;
    let vocabulary = null;
    let recognition = null;
    const stopVoice = () => { if(recognition){recognition.abort();recognition=null} };

    function stopTimer() { clearInterval(timer); timer = null; }
    function isPending() { return phase === "ready" || phase === "playing"; }
    function hide() { if (!isPending()) $("battle").hidden = true; }
    function reset() {
      stopTimer();
      stopVoice();
      $("battleActions").classList.remove("is-live");
      pressureTriggered = false;
      phase = "idle";
      active = null;
      grade = onResolve = null;
      $("battle").hidden = true;
      $("professorFace").classList.remove("flinch", "leave");
    }
    function pickTrigger(scores, grading) {
      if (!pressureTriggered && scores.discomfort >= 10) return "pressure";
      if (grading.depth >= 6 && Math.random() < 0.35) return "admiration";
      if (Math.random() < 0.12) return "surprise";
      return null;
    }
    function open(kind, professor, project, gradeAnswer, callback, options = {}) {
      if (isPending()) return;
      stopTimer();
      if (kind === "pressure") pressureTriggered = true;
      active = { kind, professor, project, topic: options.topic || "form", discipline: options.discipline || "architecture", question: (options.previousAnswer ? "你刚才说「" + options.previousAnswer.slice(0,36) + (options.previousAnswer.length>36?"…":"") + "」。\n" : "") + encounters[kind].lead + "\n" + (options.followUp || followUps[options.topic] || options.question || "你最关键的判断是什么？请解释它如何体现在这个项目里，并给一个具体依据。") };
      vocabulary = Array.isArray(options.vocabulary) ? options.vocabulary : null;
      grade = gradeAnswer;
      onResolve = callback;
      phase = "ready";
      slots = {};
      selected = null;
      chaos = 0;
      professorLeft = false;
      $("battle").hidden = false;
      $("battleTitle").textContent = encounters[kind].title;
      $("battleQuestion").textContent=active.question;
      $("battleReason").textContent = professor + " · 项目「" + project + "」\n" + encounters[kind].reason;
      $("battleIntro").hidden = false;
      $("battleLive").hidden = true;
      $("battleStart").hidden = false;
      $("battleSubmit").hidden = true;
      $("battleResponse").textContent = "";
      $("battleDraft").value="";
      $("battleInputMode").value="collage";
      $("battleDraft").disabled=false;
      $("battleInputMode").disabled=false;
      $("battleVoice").disabled=false;
      $("battleVoiceStatus").textContent=voiceSupported?"语音会转成文字，可修改后提交。":"当前浏览器不支持直接录音，可用手机键盘的麦克风输入。";
      $("battleScoreChange").textContent = "";
      $("battle").scrollIntoView({ block: "start" });
      $("battleStart").focus({ preventScroll: true });
    }
    function canPlay() {
      if (phase !== "playing") return false;
      if (!paused && performance.now() >= deadline) { finish(true); return false; }
      return true;
    }
    function showTime() {
      const label = Math.max(0, Math.ceil(remaining / 1000)) + " 秒" + (paused ? " / 已暂停" : "");
      $("battleTimer").textContent = label;
      $("battleDockTime").textContent=label;
      $("battleDockPause").textContent=paused?"继续":"暂停";
    }
    function tick() {
      if (phase !== "playing" || paused) return;
      remaining = Math.max(0, deadline - performance.now());
      showTime();
      if (remaining <= 0) finish(true);
    }
    function collage() { return order.map(key => slots[key]?.text).filter(Boolean).join(" "); }
    function sentence() { const draft=$("battleDraft").value.trim();return $("battleInputMode").value==="free"?draft:[collage(),draft].filter(Boolean).join(" "); }
    function preview() { $("battleSentence").textContent=sentence()||"拼词、补充文字，或直接回答评委。"; }
    function updateSelection() {
      $("wordBank").querySelectorAll("button").forEach((button, i) => {
        button.classList.toggle("selected", i === selected);
        button.setAttribute("aria-pressed", String(i === selected));
      });
    }
    function compatible(slot, token) { return token.type === slot || (slot === "proof" && token.type === "absurd"); }
    function place(slot, index) {
      if (!canPlay() || !Number.isInteger(index) || !tokens[index]) return;
      const token = tokens[index];
      slots[slot] = token;
      const element = $("slotBoard").querySelector('[data-slot="' + slot + '"]');
      element.className = "slot filled " + (token.absurd ? "absurd" : "good");
      element.querySelector("strong").textContent = token.text;
      element.setAttribute("aria-label", slot.toUpperCase() + ": " + token.text);
      // Current placements determine chaos; replacing a tile cannot farm points.
      chaos = Object.entries(slots).reduce((sum, [key, item]) => sum + (item.absurd ? 4 : 0), 0);
      selected = null;
      updateSelection();
      preview();
      const face = $("battleFace");
      face.classList.remove("flinch", "leave");
      if (token.absurd) {
        face.textContent = ":-O";
        face.classList.add("flinch");
        $("improvStatus").textContent = "评委停顿了一下：" + token.text + "，这句话可能引发评图事故。";
      } else if (!compatible(slot, token)) {
        face.textContent = ">:|";
        face.classList.add("flinch");
        $("improvStatus").textContent = "评委眯起眼睛：这句衔接有点跳跃。能说明它和项目有什么关系吗？";
      } else {
        face.textContent = ":-)";
        $("improvStatus").textContent = "评委微微点头：我记下了这句话，还要听它回应了什么。";
      }
      if (chaos >= 7) professorLeft = true;
      if (professorLeft) {
        face.textContent = "…";
        face.classList.add("leave");
        $("improvStatus").textContent = "教授暂时离席倒水。计时继续，委员会把这叫作强烈的空间反应。";
      }
      $("chaosMeter").textContent = "CHAOS " + chaos;
    }
    function start() {
      if (phase !== "ready") return;
      phase = "playing";
      paused = false;
      remaining = duration * 1000;
      deadline = performance.now() + remaining;
      tokens = window.DYB_BATTLE_WORDS.make({discipline:active.discipline,topic:active.topic,project:active.project});
      $("battleStart").hidden = true;
      $("battleSubmit").hidden = false;
      $("battleSubmit").disabled = false;
      $("battleActions").classList.add("is-live");
      $("battleDockPause").disabled=false;
      $("battleIntro").hidden = true;
      $("battleLive").hidden = false;

      $("battleFace").textContent = ":-|";
      $("battleFace").classList.remove("flinch", "leave");
      $("battlePause").disabled = false;
      $("battlePause").textContent = "暂停计时";
      $("battlePause").setAttribute("aria-pressed", "false");
      $("improvStatus").textContent = "点击词条，再点击槽位；也可以直接拖拽磁条。";
      $("chaosMeter").textContent = "CHAOS 0";
      $("battleSentence").textContent = "你的答辩句子会出现在这里。";
      $("wordBank").replaceChildren();
      tokens.forEach((token, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "chip";
        button.textContent = token.text;
        button.draggable = true;
        button.dataset.tokenIndex = String(index);
        button.dataset.type = token.type;
        button.setAttribute("aria-pressed", "false");
        button.addEventListener("dragstart", event => {
          if (!canPlay()) { event.preventDefault(); return; }
          event.dataTransfer.setData("application/x-dyb-token", String(index));
          event.dataTransfer.effectAllowed = "copy";
        });
        button.addEventListener("click", () => {
          if (!canPlay()) return;
          selected = index;
          updateSelection();
          $("improvStatus").textContent = "已拿起「" + token.text + "」，点击一个槽位放下。";
        });
        $("wordBank").append(button);
      });
      $("slotBoard").querySelectorAll(".slot").forEach(element => {
        const key = element.dataset.slot;
        element.disabled = false;
        element.className = "slot";
        element.querySelector("strong").textContent = labels[key];
        element.setAttribute("aria-label", key.toUpperCase() + ": " + labels[key]);
        element.onclick = () => { if (selected !== null) place(key, selected); };
        element.ondragover = event => { if (phase === "playing") event.preventDefault(); };
        element.ondrop = event => {
          event.preventDefault();
          const value = event.dataTransfer.getData("application/x-dyb-token");
          if (/^\d+$/.test(value)) place(key, Number(value));
        };
      });
      showTime();
      timer = setInterval(tick, 100);
      $("battle").scrollIntoView({ block: "start" });
      $("wordBank").firstElementChild.focus({ preventScroll: true });
    }
    function finish(timedOut) {
      if (phase !== "playing") return;
      phase = "complete";
      stopTimer();
      stopVoice();
      $("battleActions").classList.remove("is-live");
      const answer = sentence();
      const grading = answer ? grade(answer) : { scores: { depth: 0, confidence: 0, substance: 0, discomfort: 0 }, reason: "没有拼出答辩句子。" };
      const scores = { ...grading.scores };
      if(!answer){scores.confidence=-1;scores.discomfort=1;}
      const response = (timedOut ? "时间到，按你的最终回答结算。" : "现场回答已提交。") + "\n" + grading.reason + "\n评委按回应问题、概念与证据评分，磁条位置不计分。";
      const result = { kind: active.kind, question:active.question, professor:active.professor, scores, answer, timedOut, chaos, professorLeft, response };
      $("battleTimer").textContent = timedOut ? "时间到" : "已提交";
      $("battlePause").disabled = true;
      $("battleDockPause").disabled=true;
      $("battleDraft").disabled=true;
      $("battleInputMode").disabled=true;
      $("battleVoice").disabled=true;
      $("battleSubmit").disabled = true;
      $("wordBank").querySelectorAll("button").forEach(button => { button.disabled = true; button.draggable = false; });
      $("slotBoard").querySelectorAll("button").forEach(button => { button.disabled = true; });
      $("battleResponse").textContent = response;
      const sign = n => (n >= 0 ? "+" : "") + n;
      $("battleScoreChange").textContent = "BATTLE · DEPTH " + sign(scores.depth) + "  CONFIDENCE " + sign(scores.confidence) + "  SUBSTANCE " + sign(scores.substance) + "  DISCOMFORT " + sign(scores.discomfort);
      const callback = onResolve;
      onResolve = null;
      callback(result);
      $("battleResponse").scrollIntoView({ block: "nearest" });
      $("nextRound").focus({ preventScroll: true });
    }
    function pause() {
      if (phase !== "playing" || paused) return;
      remaining = Math.max(0, deadline - performance.now());
      if (!remaining) return finish(true);
      paused = true;
      stopTimer();
      $("battlePause").textContent = "继续计时";
      $("battlePause").setAttribute("aria-pressed", "true");
      showTime();
    }
    $("battleStart").addEventListener("click", start);
    $("battleSubmit").addEventListener("click", () => { if (canPlay()) finish(false); });
    $("battlePause").addEventListener("click", () => {
      if (phase !== "playing") return;
      if (!paused) return pause();
      paused = false;
      deadline = performance.now() + remaining;
      $("battlePause").textContent = "暂停计时";
      $("battlePause").setAttribute("aria-pressed", "false");
      showTime();
      timer = setInterval(tick, 100);
    });
    $("battleDraft").addEventListener("input",()=>{if(canPlay())preview()});
    $("battleInputMode").addEventListener("change",()=>{if(canPlay())preview()});
    $("battleDockPause").addEventListener("click",()=>$("battlePause").click());
    const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
    const voiceSupported=Boolean(Speech);
    $("battleVoice").addEventListener("click",()=>{
      if(!canPlay())return;
      if(!Speech){$("battleDraft").focus();return;}
      if(recognition){stopVoice();return;}
      const session=new Speech();recognition=session;session.lang="zh-CN";session.interimResults=false;
      session.onresult=event=>{if(!canPlay())return;const transcript=Array.from(event.results).map(result=>result[0].transcript).join(" ");$("battleDraft").value=[$("battleDraft").value,transcript].filter(Boolean).join(" ");preview();};
      session.onerror=()=>{$("battleVoiceStatus").textContent="未能识别语音，可直接打字或用键盘麦克风。";};
      session.onend=()=>{if(recognition===session)recognition=null;$("battleVoice").textContent="语音输入";};
      try{session.start();$("battleVoice").textContent="停止语音";$("battleVoiceStatus").textContent="正在听，识别结果会放入文字框。";}catch(_){recognition=null;$("battleVoiceStatus").textContent="无法启动语音，请使用键盘麦克风。";}
    });
    document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });
    return { pickTrigger, open, reset, hide, isPending };
  }
  window.DYB_BATTLE = { create };
})();
