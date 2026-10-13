/* Career desk: resource tradeoffs, side events and client dispatch. */
(() => {
  "use strict";
  function create({ career, onAccept, show }) {
    const $ = id => document.getElementById(id);
    let resetArmed = false;
    let abandonArmed = false;
    const element = (tag, text, className) => {
      const node = document.createElement(tag);
      if (text !== undefined) node.textContent = text;
      if (className) node.className = className;
      return node;
    };
    function report(result) {
      $("careerMessage").textContent = result.message;
      $("careerMessage").classList.toggle("error", !result.ok);
      render();
      return result;
    }
    function render() {
      const s = career.snapshot();
      $("memberTier").textContent = s.tierName;
      $("memberAccount").textContent = "ZT-" + String(s.serial).padStart(3, "0");
      $("careerStrip").textContent = "DAY " + s.day + " · " + s.tierName + " · ¥" + s.cash + " · Token " + s.tokens + " · 饱腹 " + s.hunger + " · 黑名单 " + s.blacklists + "/3";
      $("accountClosed").hidden = !s.closed;
      $("jobBoard").replaceChildren();
      $("activeJob").replaceChildren();
      $("activeJob").hidden = !s.active || s.closed;
      if (s.active && !s.closed) {
        $("activeJob").append(element("strong", "进行中：" + s.active.client + " / " + s.active.scene));
        const resume = element("button", "继续当前委托");
        resume.id = "resumeJob"; resume.type = "button";
        resume.addEventListener("click", () => onAccept(s.active));
        const abandon = element("button", abandonArmed ? "再次点击：撤单记一次黑名单" : "撤单 / 会被客户拉黑", "outline");
        abandon.id = "abandonJob"; abandon.type = "button";
        abandon.addEventListener("click", () => {
          if (!abandonArmed) { abandonArmed = true; render(); return; }
          abandonArmed = false; report(career.abandon());
        });
        $("activeJob").append(resume, abandon);
      }
      if (!s.closed && !s.active) s.offers.forEach(job => {
        const card = element("article", undefined, "job-card");
        card.append(element("p", job.themeName + " / " + job.scene, "eyebrow"), element("h3", job.client), element("p", "客户只交了一个项目，剩下的解释由你负责。"), element("strong", "验收通过 ¥" + job.reward + " · 经验 +10"));
        if (job.scenario) card.append(element("p", "PRE 情境 / " + job.scenario.name, "scenario-label"), element("p",job.scenario.brief), element("p",job.scenario.goal,"scenario-goal"));
        if (job.mission) card.append(element("p", job.mission.label + "\n" + job.mission.goal + "；额外 ¥12 / 经验 +5。", "mission-note"));
        const button = element("button", "接单 / 替他上台");
        button.type = "button"; button.className = "accept-job"; button.dataset.jobId = job.id;
        button.disabled = Boolean(s.event) || s.time < 2 || s.tokens < 6 || s.hunger < 20;
        button.addEventListener("click", () => {
          const result = career.accept(job.id);
          if (report(result).ok) onAccept(result.job);
        });
        card.append(button); $("jobBoard").append(card);
      });
      const stats = [["今天剩余时间", s.time + " / 6"], ["现金", "¥" + s.cash], ["话术 Token", s.tokens], ["存粮", s.food + " 份"], ["饱腹", s.hunger + " / 100"], ["通关 / 接单", s.passes + " / " + s.completed], ["经验", s.xp], ["行业口碑", s.reputation], ["客户黑名单", s.blacklists + " / 3"]];
      $("careerStats").replaceChildren();
      stats.forEach(([label,value]) => {
        const row = element("div", undefined, "career-stat"); row.append(element("span", label), element("strong", String(value))); $("careerStats").append(row);
      });
      const fee = Math.max(s.promotionHold ? 1 : 0,s.tier) * 10;
      $("clubAudit").textContent = "距会员审核还有 " + (3 - s.completed % 3) + " 单；当前会费 ¥" + fee + "。" + (s.promotionHold ? " 晋升暂停，完成下一轮审核恢复。" : "") + (!s.persistence ? " 浏览器无法保存，当前生涯只在本次页面有效。" : "");
      $("unlockRoadmap").replaceChildren();
      window.DYB_CAREER.themes.forEach(theme => {
        const open = s.passes >= theme.passes;
        $("unlockRoadmap").append(element("p", (open ? "已解锁 " : "待解锁 ") + theme.name + (open ? "" : " / 通关 " + theme.passes + " 单"), open ? "unlocked" : "locked"));
      });
      if (s.tier < 3) {
        const next = window.DYB_CAREER.thresholds[s.tier + 1];
        $("unlockRoadmap").append(element("p", "下一等级：" + window.DYB_CAREER.tiers[s.tier + 1] + " / " + next.passes + " 次通关 + " + next.xp + " 经验", "sub"));
      }
      $("courierStatus").textContent = s.courier ? "同行跑腿关系已建立：配送不消耗时间，但每次加价 ¥5。" : "还没有跑腿关系。通关 2 单后，同行支线可能带来配送服务。";
      const locked = s.closed || Boolean(s.active);
      $("eatFood").disabled = locked || !s.food || s.hunger >= 100;
      $("buyFood").disabled = locked || s.cash < 18 || s.time < 1;
      $("buyTokens").disabled = locked || s.cash < 20 || s.time < 1;
      $("deliverFood").disabled = locked || !s.courier || s.cash < 23;
      $("deliverTokens").disabled = locked || !s.courier || s.cash < 25;
      $("clubChore").disabled = locked || s.time < 1 || s.choreDay === s.day;
      $("sleepDay").disabled = locked;
      $("lifeEvent").hidden = !s.event || s.closed || Boolean(s.active);
      $("lifeEventChoices").replaceChildren();
      if (s.event && !s.closed) {
        const event = window.DYB_CAREER.events[s.event.kind];
        $("lifeEventTitle").textContent = event.title; $("lifeEventText").textContent = event.text;
        event.choices.forEach(choice => {
          const button = element("button", undefined, "life-choice outline"); button.type = "button"; button.dataset.choice = choice.id;
          button.append(element("strong", choice.label), element("span", choice.detail));
          button.disabled = !career.canChoose(choice.id);
          button.addEventListener("click", () => report(career.chooseEvent(s.event.id,choice.id)));
          $("lifeEventChoices").append(button);
        });
      }
      $("careerLog").replaceChildren();
      s.log.forEach(text => $("careerLog").append(element("li",text)));
      if (!s.log.length) $("careerLog").append(element("li","加入学术嘴替俱乐部。先接一单，再考虑体面。"));
      if (!$("careerMessage").textContent && !s.active && !s.closed) $("careerMessage").textContent = s.event ? "先处理门口的事件，才能接新单。" : "准备好现金、存粮和话术后，挑一份委托。";
    }
    const controls = {
      eatFood: () => career.eat(), buyFood: () => career.buy("food"), buyTokens: () => career.buy("tokens"),
      deliverFood: () => career.buy("food",true), deliverTokens: () => career.buy("tokens",true), clubChore: () => career.chore(), sleepDay: () => career.rest()
    };
    Object.entries(controls).forEach(([id, action]) => $(id).addEventListener("click", () => report(action())));
    $("resetCareer").addEventListener("click", () => {
      if (!resetArmed) {
        resetArmed = true;
        $("resetCareer").textContent = "再次点击：清空生涯，销号重开";
        $("careerMessage").textContent = "即将清空当前账号的等级、资源与委托记录。";
        return;
      }
      resetArmed = false; abandonArmed = false;
      $("resetCareer").textContent = "销号重开";
      report(career.resetAccount()); show("career");
    });
    render();
    return { render, report };
  }
  window.DYB_CAREER_UI = { create };
})();
