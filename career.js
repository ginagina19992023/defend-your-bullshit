/* Persistent, local career economy for a professional presentation stand-in. */
(() => {
  "use strict";
  const storageKey = "dyb-career-v1";
  const tiers = ["试用嘴替", "注册嘴替", "资深嘴替", "高级代汇报 Agent"];
  const thresholds = [{ xp: 0, passes: 0 }, { xp: 20, passes: 2 }, { xp: 45, passes: 4 }, { xp: 80, passes: 7 }];
  const themes = [
    { id: "architecture", name: "建筑评图", passes: 0, scenes: ["期末评图", "竞赛终审", "业主汇报"] },
    { id: "art", name: "当代艺术", passes: 2, scenes: ["展览开幕", "策展评审"] },
    { id: "startup", name: "产品创业", passes: 4, scenes: ["融资路演", "产品发布会"] }
  ];
  const events = {
    misdelivery: {
      title: "签收一份不属于你的话术包？", text: "门口的包裹写着隔壁嘴替的名字。里面可能是你今晚用得上的答辩素材。",
      choices: [
        { id: "keep", label: "先拿来用", detail: "Token +8，口碑 -2；下一单有 30% 概率被追查，黑名单 +1。" },
        { id: "return", label: "原封退回", detail: "口碑 +2，不获得素材。" }
      ]
    },
    observer: {
      title: "有人在偷看你的汇报稿。", text: "同行躲在共享屏幕另一端。他愿意帮你跑腿，换取继续观摩你的话术。",
      choices: [
        { id: "report", label: "向俱乐部举报", detail: "用时 1，口碑 +5；已有跑腿关系也会结束。" },
        { id: "deal", label: "达成交易，让他跑腿", detail: "花费 ¥10，口碑 -2；解锁零用时配送，每次加价 ¥5。下一单有 20% 概率被客户投诉，黑名单 +1。" },
        { id: "ignore", label: "关掉共享，不追究", detail: "没有收益，也不欠人情。" }
      ]
    },
    rescue: {
      title: "临时救场：客户的嘴替失联了。", text: "一场汇报马上开始。客户只求你先把现场稳住，也有人建议你直接发一段看不懂的录音。",
      choices: [
        { id: "help", label: "抽时间帮他补一段", detail: "用时 1，饱腹 -10；现金 +20，口碑 +3，经验 +3。" },
        { id: "recording", label: "把现成录音卖给他", detail: "现金 +30，口碑 -3；50% 概率被拉黑。" },
        { id: "decline", label: "不接额外的锅", detail: "保留时间和精力。" }
      ]
    },
    patron: {
      title: "高级会员的推荐名额", text: "俱乐部有人愿意推荐你。是用已完成的作品说话，还是交钱购买一个看起来体面的背书？",
      choices: [
        { id: "portfolio", label: "整理跨场景作品集", detail: "用时 1，Token -2；经验 +6，口碑 +3。" },
        { id: "buy", label: "买下这次推荐", detail: "花费 ¥35，经验 +10，口碑 -4。低口碑会让会员审核更难通过。" },
        { id: "later", label: "暂时不要", detail: "不改变生涯。" }
      ]
    }
  };
  const scenarios = [
    { id: "stress", name: "连续被 diss，客户快崩溃了", brief: "客户已经被同一组评委否定三次。他一边删稿一边说：要不我别讲了。你接过这次汇报，需要先稳住现场。", goal: "验收需通关且自信分 ≥10", key: "confidence", target: 10, premium: 8, opening: { depth: 1, confidence: 2, substance: 0, discomfort: 4 } },
    { id: "evidence", name: "返场补交：你到底凭什么？", brief: "上次汇报只剩漂亮概念。评委要求针对一个具体决定拿出依据，客户把材料、观察和测试记录交给了你。", goal: "验收需通关且实质分 ≥8", key: "substance", target: 8, premium: 12, opening: { depth: 0, confidence: 0, substance: 0, discomfort: 1 } },
    { id: "trauma", name: "大师的名字，踩中了评委旧伤", brief: "客户的稿子引用了一位拼贴大师。这位评委曾在大师的工作坊被否定，听见借名声作答就会不爽。", goal: "照常验收；提及“大师、导师、柯布、库尔”等词，不适额外 +2", premium: 10, opening: { depth: 0, confidence: 1, substance: 0, discomfort: 3 } },
    { id: "regular", name: "普通代汇报", brief: "客户交来一个还没讲明白的项目。替他完成三轮汇报，让委员会相信它值得继续。", goal: "按四项答辩标准验收", premium: 0, opening: { depth: 0, confidence: 0, substance: 0, discomfort: 0 } }
  ];
  const fresh = serial => ({
    version: 1, serial, day: 1, time: 6, cash: 90, tokens: 18, food: 3, hunger: 75,
    reputation: 0, xp: 0, passes: 0, completed: 0, tier: 0, blacklists: 0,
    promotionHold: false, courier: false, choreDay: 0, debt: null,
    sequence: 0, offers: [], active: null, event: null, history: [], log: [], closed: false
  });
  const clone = value => JSON.parse(JSON.stringify(value));

  function create({ storage, random = () => Math.random(), onChange = () => {} } = {}) {
    let state = fresh(1);
    let persistence = true;
    try {
      if (!storage) storage = window.localStorage;
      const saved = storage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const counters = ["serial","day","time","cash","tokens","food","hunger","reputation","xp","passes","completed","tier","blacklists","sequence","choreDay"];
        const valid = parsed.version === 1 && counters.every(key => Number.isFinite(parsed[key]) && Number.isInteger(parsed[key])) &&
          parsed.serial > 0 && parsed.day > 0 && parsed.time >= 0 && parsed.time <= 6 && parsed.hunger >= 0 && parsed.hunger <= 100 && parsed.tier >= 0 && parsed.tier <= 3 &&
          ["cash","tokens","food","xp","passes","completed","blacklists","sequence"].every(key => parsed[key] >= 0) &&
          Array.isArray(parsed.offers) && Array.isArray(parsed.history) && Array.isArray(parsed.log) &&
          (!parsed.active || (typeof parsed.active.id === "string" && themes.some(t => t.id === parsed.active.theme))) &&
          (!parsed.event || events[parsed.event.kind]);
        if (valid) state = { ...fresh(parsed.serial), ...parsed };
      }
    } catch (_) { persistence = false; }
    const pick = array => array[Math.min(array.length - 1, Math.floor(random() * array.length))];
    const note = text => { state.log.unshift("DAY " + state.day + " · " + text); state.log = state.log.slice(0, 12); };
    const unlocked = () => themes.filter(theme => state.passes >= theme.passes);
    const uid = prefix => prefix + "-" + state.serial + "-" + (++state.sequence);
    function write() {
      state.closed = state.blacklists >= 3;
      try { storage.setItem(storageKey, JSON.stringify(state)); } catch (_) { persistence = false; }
      onChange(snapshot());
    }
    function snapshot() { return { ...clone(state), persistence, unlocked: clone(unlocked()), tierName: tiers[state.tier] }; }
    function failed(message) { return { ok: false, message }; }
    function changed(message, extra = {}) { note(message); write(); return { ok: true, message, ...extra }; }
    function guard() {
      if (state.closed) return "黑名单已达 3 次，这个账号已停用。请销号重开。";
      if (state.active) return "先完成正在进行的委托。";
      return null;
    }
    function makeOffers() {
      const available = unlocked();
      state.offers = [0, 1, 2].map(index => {
        const theme = available[index % available.length];
        const scenes = theme.id === "architecture" ? theme.scenes.slice(0, state.passes >= 4 ? 3 : state.passes >= 2 ? 2 : 1) : theme.scenes;
        const scene = pick(scenes);
        const scenario = clone(pick(scenarios));
        const reward = (theme.id === "architecture" ? 36 : theme.id === "art" ? 48 : 65) + scenario.premium;
        const clients = ["明天再说工作室", "空壳设计组", "未完成研究所", "一点点未来公司", "迟到策展室"];
        let mission = null;
        if (state.passes >= 2 && random() < 0.4) {
          mission = pick([
            { id: "evidence", label: "客户加单：拿出一点真的证据", goal: "通关且实质分 ≥8", key: "substance", target: 8 },
            { id: "confidence", label: "客户加单：讲得像已经成功", goal: "通关且自信分 ≥12", key: "confidence", target: 12 },
            { id: "calm", label: "客户加单：别把场子搞炸", goal: "通关且不适分 ≤10", key: "discomfort", target: 10 }
          ]);
        }
        return { id: uid("job"), theme: theme.id, themeName: theme.name, scene, client: pick(clients), reward, mission, scenario, project: "" };
      });
    }
    function maybeEvent() {
      if (random() >= 0.45) return;
      const pool = ["misdelivery"];
      if (state.passes >= 2) pool.push("observer", "rescue");
      if (state.passes >= 4) pool.push("patron");
      state.event = { id: uid("event"), kind: pick(pool) };
    }
    if (!state.offers.length && !state.active && !state.closed) makeOffers();
    write();

    function accept(id) {
      const blocked = guard();
      if (blocked) return failed(blocked);
      if (state.event) return failed("先处理门口这件事，再接新单。");
      const job = state.offers.find(offer => offer.id === id);
      if (!job || !unlocked().some(theme => theme.id === job.theme)) return failed("这个委托尚未解锁或已经过期。");
      if (state.time < 2) return failed("今天不足 2 格时间，休息到明天再接单。");
      if (state.hunger < 20) return failed("饱腹不足 20，先吃点东西。");
      if (state.tokens < 6) return failed("话术 Token 不足 6，先补货。");
      state.time -= 2;
      state.hunger -= 20;
      state.tokens -= 6;
      state.active = clone(job);
      state.offers = [];
      return changed("接下「" + job.scene + "」：时间 -2、饱腹 -20、Token -6。", { job: clone(job) });
    }
    function setProject(project) {
      if (!state.active || state.closed) return false;
      state.active.project = String(project).slice(0, 2000);
      write();
      return true;
    }
    function eligibleTier() {
      let tier = 0;
      for (let i = 1; i < thresholds.length; i += 1) {
        if (state.xp >= thresholds[i].xp && state.passes >= thresholds[i].passes) tier = i;
      }
      return tier;
    }
    function audit() {
      if (state.completed % 3 !== 0) return null;
      const target = state.promotionHold ? Math.max(1, state.tier) : state.tier;
      if (!target) return "试用会员本次免审核。";
      const recent = state.history.slice(-3).filter(job => job.passed);
      const requiredPasses = target >= 2 ? 2 : 1;
      const diversity = target >= 3 ? new Set(recent.map(job => job.theme)).size : new Set(recent.map(job => job.scene)).size;
      const requiredDiversity = target >= 2 ? 2 : 1;
      const fee = target * 10;
      if (recent.length >= requiredPasses && diversity >= requiredDiversity && state.cash >= fee && state.reputation >= -3) {
        state.cash -= fee;
        state.promotionHold = false;
        return "会员审核通过，缴费 ¥" + fee + "。";
      }
      state.tier = Math.max(0, state.tier - 1);
      state.promotionHold = true;
      return "会员审核未通过：最近三单需 " + requiredPasses + " 单通关、" + requiredDiversity + (target >= 3 ? " 个主题" : " 个场景") + "，口碑 ≥-3，且能支付 ¥" + fee + "。降一级，暂停晋升到下次审核。";
    }
    function settle(jobId, verdict, scores) {
      if (!state.active || state.active.id !== jobId || state.history.some(job => job.id === jobId)) return failed("这份委托已经结算。");
      const job = state.active;
      const academicPassed = verdict.passed === true;
      const requirement = job.scenario?.key;
      const passed = academicPassed && (!requirement || scores[requirement] >= job.scenario.target);
      const beforeUnlocks = unlocked().map(theme => theme.id);
      const payout = passed ? job.reward : 8;
      state.cash += payout;
      state.completed += 1;
      state.xp += passed ? 10 : 2;
      state.reputation += passed ? 2 : -2;
      if (passed) state.passes += 1;
      else state.blacklists += 1;
      let bonus = false;
      if (passed && job.mission) {
        const value = scores[job.mission.key];
        bonus = job.mission.id === "calm" ? value <= job.mission.target : value >= job.mission.target;
        if (bonus) { state.cash += 12; state.xp += 5; state.reputation += 1; }
      }
      let consequence = "";
      if (state.debt) {
        if (random() < state.debt.chance) {
          state.blacklists += 1;
          consequence = state.debt.label + "被客户追查，黑名单 +1。";
        } else consequence = state.debt.label + "暂时没有被追查。";
        state.debt = null;
      }
      state.history.push({ id: job.id, theme: job.theme, scene: job.scene, client: job.client, passed, bonus });
      // Keep the complete pass counters but only the last 30 job records.
      state.history = state.history.slice(-30);
      const oldTier = state.tier;
      if (!state.promotionHold) state.tier = Math.max(state.tier, eligibleTier());
      const auditMessage = audit();
      const newlyUnlocked = unlocked().filter(theme => !beforeUnlocks.includes(theme.id)).map(theme => theme.name);
      state.active = null;
      makeOffers();
      if (state.blacklists < 3) maybeEvent();
      const message = (passed ? "客户验收通过，到账 ¥" + payout + "，经验 +10。" : (academicPassed && requirement ? "答辩通过，但没达到客户要求「" + job.scenario.goal + "」。" : "客户不满意。") + "只报销 ¥8，黑名单 +1。") +
        (bonus ? " 加单达标：现金 +12，经验 +5。" : "") +
        (newlyUnlocked.length ? " 解锁：" + newlyUnlocked.join("、") + "。" : "") +
        (state.tier > oldTier ? " 晋升「" + tiers[state.tier] + "」。" : "") +
        (auditMessage || "") + consequence;
      return changed(message, { passed, payout: payout + (bonus ? 12 : 0), bonus, newlyUnlocked, audit: auditMessage });
    }
    function buy(kind, delivery = false) {
      const blocked = guard(); if (blocked) return failed(blocked);
      if (kind !== "food" && kind !== "tokens") return failed("没有这种商品。");
      if (delivery && !state.courier) return failed("还没有跑腿关系。");
      const cost = (kind === "food" ? 18 : 20) + (delivery ? 5 : 0);
      const time = delivery ? 0 : 1;
      if (state.cash < cost || state.time < time) return failed("现金或时间不足。");
      state.cash -= cost; state.time -= time;
      if (kind === "food") state.food += 2; else state.tokens += 10;
      return changed((delivery ? "同行送货" : "去补货") + "：花费 ¥" + cost + "、时间 -" + time + "，" + (kind === "food" ? "盒饭 +2。" : "Token +10。"));
    }
    function eat() {
      const blocked = guard(); if (blocked) return failed(blocked);
      if (!state.food) return failed("没有存粮，先补货或找俱乐部打杂。");
      if (state.hunger >= 100) return failed("已经吃饱了。");
      state.food -= 1; state.hunger = Math.min(100, state.hunger + 35);
      return changed("吃掉一份盒饭，饱腹 +35。");
    }
    function rest() {
      const blocked = guard(); if (blocked) return failed(blocked);
      state.day += 1; state.time = 6; state.hunger = Math.max(0, state.hunger - 10);
      return changed("睡到第二天，时间恢复为 6，饱腹 -10。");
    }
    function chore() {
      const blocked = guard(); if (blocked) return failed(blocked);
      if (state.time < 1 || state.choreDay === state.day) return failed("每天只能打杂一次，需要 1 格时间。");
      state.time -= 1; state.choreDay = state.day; state.cash += 15; state.food += 1; state.tokens += 2;
      return changed("帮俱乐部收椅子：时间 -1，现金 +15、盒饭 +1、Token +2。没有晋升经验。");
    }
    function canChoose(choiceId) {
      if (!state.event || state.closed || state.active) return false;
      const choice = events[state.event.kind].choices.find(c => c.id === choiceId);
      if (!choice) return false;
      if (["report","help","portfolio"].includes(choiceId) && state.time < 1) return false;
      if (choiceId === "help" && state.hunger < 10) return false;
      if (choiceId === "deal" && state.cash < 10) return false;
      if (choiceId === "buy" && state.cash < 35) return false;
      if (choiceId === "portfolio" && state.tokens < 2) return false;
      return true;
    }
    function chooseEvent(eventId, choiceId) {
      if (!state.event || state.event.id !== eventId || !canChoose(choiceId)) return failed("事件已处理，或资源不足。");
      const kind = state.event.kind;
      let outcome = "";
      if (kind === "misdelivery") {
        if (choiceId === "keep") { state.tokens += 8; state.reputation -= 2; state.debt = { chance: 0.3, label: "错签的话术包" }; }
        else state.reputation += 2;
      } else if (kind === "observer") {
        if (choiceId === "report") { state.time -= 1; state.reputation += 5; state.courier = false; }
        if (choiceId === "deal") { state.cash -= 10; state.reputation -= 2; state.courier = true; state.debt = { chance: 0.2, label: "与偷窥同行的交易" }; }
      } else if (kind === "rescue") {
        if (choiceId === "help") { state.time -= 1; state.hunger -= 10; state.cash += 20; state.reputation += 3; state.xp += 3; }
        if (choiceId === "recording") {
          state.cash += 30; state.reputation -= 3;
          if (random() < 0.5) { state.blacklists += 1; outcome = " 录音被识破，黑名单 +1。"; }
        }
      } else if (kind === "patron") {
        if (choiceId === "portfolio") { state.time -= 1; state.tokens -= 2; state.xp += 6; state.reputation += 3; }
        if (choiceId === "buy") { state.cash -= 35; state.xp += 10; state.reputation -= 4; }
      }
      const label = events[kind].choices.find(c => c.id === choiceId).label;
      state.event = null;
      if (!state.promotionHold) state.tier = Math.max(state.tier, eligibleTier());
      return changed(label + "。" + outcome);
    }
    function abandon() {
      if (!state.active) return failed("没有进行中的委托。");
      return settle(state.active.id, { passed: false }, { depth: 0, confidence: 0, substance: 0, discomfort: 0 });
    }
    function resetAccount() {
      state = fresh(state.serial + 1); makeOffers();
      return changed("旧账号已注销。新账号从试用嘴替重新开始。");
    }
    return { snapshot, accept, setProject, settle, buy, eat, rest, chore, chooseEvent, canChoose, abandon, resetAccount };
  }
  window.DYB_CAREER = { create, storageKey, tiers, thresholds, themes, events, scenarios };
})();
