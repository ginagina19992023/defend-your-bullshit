/* The original magnetic-word collage, now a timed, conditionally triggered battle. */
(() => {
  "use strict";
  const duration = 20;
  const order = ["opening", "move", "concept", "proof"];
  const labels = { opening: "拖一个开场", move: "拖一个动作", concept: "拖一个概念", proof: "拖证据或离谱理由" };
  const parts = {
    opening: ["这并不是一个物体", "我真正想处理的不是功能", "这个形式的脆弱性", "如果我们暂时拒绝效率", "这里的失败"],
    move: ["暴露了", "延迟了", "重新组织了", "迫使我们面对", "把问题转译为"],
    concept: ["观看者的身体协商", "公共性的临时边界", "材料自身的沉默", "被制度化的等待", "空间意义的生产条件"],
    proof: ["因此它必须保持未完成。", "这也是我选择不解决它的原因。", "所以证据不是结果，而是过程。", "它需要以不舒服的方式存在。", "否则它就只剩下一个设计。"]
  };
  const encounters = {
    pressure: { title: "委员会坐不住了。拼给他看。", reason: "委员会不适值首次达到 10，评委要求你当场重新拼出论证。", question: "别再读陈述。用这些磁条，把概念和现实拼在一起。" },
    admiration: { title: "他太喜欢你的概念了。再拼一句。", reason: "概念得分很高，触发欣赏型 Battle。评委突然兴奋，要求你现场延伸概念。", question: "这个概念有意思！现在用这些词，让它再往前走一步。" },
    surprise: { title: "评图现场突然加赛。", reason: "随机突发 Battle。评委打断流程，要求你临场拼贴单词。", question: "拿走稿子。给你这些磁条，你能当场拼出一个答辩吗？" }
  };
  const sample = (items, count) => {
    const shuffled = items.slice();
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
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
      active = { kind, professor, project };
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
      tokens = Object.entries(parts).flatMap(([type, terms]) => sample(type === "concept" && vocabulary ? vocabulary : terms, type === "concept" ? 4 : 3).map(text => ({ text, type }))).concat([
        { text: "我把长椅放到了屋顶上", type: "absurd", absurd: true },
        { text: "这让我想起某次失败的终评", type: "absurd", absurd: true },
        { text: "我们记录了三位使用者的停留时间", type: "proof" }
      ]);
      $("battleStart").hidden = true;
      $("battleSubmit").hidden = false;
      $("battleSubmit").disabled = false;
      $("battleActions").classList.add("is-live");
      $("battleDockPause").disabled=false;
      $("battleIntro").hidden = true;
      $("battleLive").hidden = false;
      $("battleQuestion").textContent = encounters[active.kind].question;
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
      const result = { kind: active.kind, scores, answer, timedOut, chaos, professorLeft, response };
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
