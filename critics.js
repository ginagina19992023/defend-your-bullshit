/* Fictional, deliberately misspelled architect-name collages and seat changes. */
(() => {
  "use strict";

  const identities = [
    "扎哈·柯布希耶 / ZAHA CORBUSHIER",
    "密斯·库尔哈兹 / MIES KOOLHAAZ",
    "弗兰克·安藤恩 / FRANCK ANDOH",
    "路易·盖里昂 / LOUIS GHEHRY",
    "阿尔瓦·哈迪德尔 / ALVAR HADIDEL",
    "诺曼·卡恩斯 / NORMANN KAHNS",
    "雷姆·阿尔托恩 / REM AALTOHN",
    "勒·福斯特耶 / LE FOSTIER",
    "安藤·利贝斯金德尔 / ANDOH LIBESKINDEL",
    "彼得·皮亚诺夫 / PETTER PIANOV",
    "伦佐·艾森曼恩 / RENZO EISENMANN",
    "丹尼尔·西扎罗 / DANIEL SIZARO",
    "比亚克·卒姆托尔 / BJARKE ZUMTHOHR",
    "彼得·英格尔森 / PETTER INGELSSEN",
    "奥斯卡·密斯迈耶 / OSKAR MIESMEYER",
    "柯布·盖里耶 / CORBU GHEHRIE"
  ];

  function pickSeatEvent(round, scores, roll = Math.random()) {
    // One weighted draw: eligible event probabilities do not overlap.
    const meeting = round >= 1 ? 12 : 0;
    const clockOff = round === 2 ? 15 : 0;
    const visiting = scores.depth >= 8 ? 18 : 8;
    const percentile = roll * 100;
    if (percentile < meeting) return "meeting";
    if (percentile < meeting + clockOff) return "clockOff";
    if (percentile < meeting + clockOff + visiting) return "visiting";
    return null;
  }

  function create() {
    let deck = [];

    function reset() {
      deck = identities.slice();
      for (let i = deck.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }

    function cast(professor) {
      const identity = deck.pop();
      if (!identity) throw new Error("The fictional critic name deck is exhausted");
      return { ...professor, role: professor.role || professor.name, name: "PROF. " + identity };
    }

    function replace(round, scores, scheduled, pool) {
      const kind = pickSeatEvent(round, scores);
      if (!kind) return null;
      const candidates = pool.filter(professor => professor.bias !== scheduled.bias);
      if (!candidates.length) return null;
      const incoming = cast(candidates[Math.floor(Math.random() * candidates.length)]);
      const outgoing = scheduled.name;
      const titles = {
        meeting: "席位变动 / 评委去开会了",
        clockOff: "席位变动 / 评委决定下班",
        visiting: "席位变动 / VISITING CRITIC 空降"
      };
      const reasons = {
        meeting: outgoing + " 收到开会提醒，把评图笔记推给了 " + incoming.name + "。",
        clockOff: outgoing + " 看了一眼时间：今天就到这里。" + incoming.name + " 被临时拉来接班。",
        visiting: outgoing + " 邀请的 visiting critic 提前到了。" + incoming.name + " 坐进这个席位，决定亲自提问。"
      };
      return { kind, title: titles[kind], message: reasons[kind], outgoing, incoming };
    }

    reset();
    return { reset, cast, replace };
  }

  window.DYB_CRITICS = { create, pickSeatEvent };
})();
