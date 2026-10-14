/* Sixteen tiles: eight topic/evidence options, six sentence bridges, two comic detours. */
(() => {
  const concepts={
    experience:['观看者的身体行动','感知与实际体验的差异','使用者的停留路径','触觉与观看的关系'],
    form:['形式与功能的边界','材料和尺度的关系','构成背后的具体判断','不同形式之间的比较'],
    power:['公共参与的规则','被排除的使用者','劳动与权力的分配','谁拥有改变规则的权利'],
    evidence:['对照测试的差异','观察与判断的距离','原型验证的限制','反例对假设的修正'],
    memory:['历史痕迹与当前行动','不同人的地方记忆','时间对材料的改变','保留与删除的判断']
  };
  const methods={
    experience:['我们计划记录人如何靠近、停下和离开。','我们会观察同一个人前后的行动路径。','我们会比较不同使用者的感知反馈。','我们先访谈不愿参与的人，再修改体验。','我们把观看和实际行动分别记录，避免混为一谈。'],
    form:['我们用两个不同形式的原型作对照测试。','我们先比较尺度变化，再判断形式是否必要。','我们记录材料改变后实际使用的差异。','我们会测试删掉一部分之后，关系是否还成立。','我们把构成拆成具体决定，逐一说明依据。'],
    power:['我们先访谈被排除的人，记录他们的反馈。','我们比较不同规则下，谁能参与、谁必须离开。','我们记录劳动如何分配，以及谁能改变决定。','我们把使用权写成可检查的规则，而不是口号。','我们给参与者保留拒绝和退出的权利。'],
    evidence:['我们先做一个原型，再用对照测试验证判断。','我们记录不同情况下的反馈，不只挑好看的结果。','我们会先说明样本限制，再讨论结果。','我们预先定义什么反例出现时就修改假设。','我们用观察和测量区分事实与自己的解释。'],
    memory:['我们对照档案和实际访谈，记录两者的分歧。','我们比较保留与删除痕迹之后，人如何使用它。','我们先说明这段历史具体改变了哪个决定。','我们让不同参与者补充各自的记忆，而非替他们统一。','我们记录变化的过程，不把过去当作固定答案。']
  };
  const specific={
    architecture:{
      experience:{concept:['入口与身体路径的协商','边界对空间感知的影响'],proof:['我们计划记录人在入口和长椅附近的停留时间。','我们用现场观察比较两条动线的实际使用。','我们测试不同尺度下，使用者能否顺利经过。']},
      form:{concept:['体块与结构的必要联系','孔洞、墙体与边界的尺度'],proof:['我们会对照模型和构造节点，检查结构限制。','我们比较孔洞大小改变后的光线与路径。','我们用两种材料测试同一个节点，先看它能否成立。']},
      power:{concept:['公共空间的进入门槛','维护空间的人与隐形劳动'],proof:['我们先确认入口对不同身体条件的人是否开放。','我们记录住户、维护者和访客各自的使用权。','我们把夜间开放和维护规则也作为设计的一部分。']},
      evidence:{concept:['模型与现场之间的证据缺口','尺度选择的验证依据'],proof:['我们先做一个构造原型，再记录它的限制。','我们对照改造前后的现场路径与停留时间。','我们分别验证尺寸、材料和使用方式，避免只看效果图。']},
      memory:{concept:['旧墙的痕迹与新的使用','场地历史对空间决定的影响'],proof:['我们先访谈原使用者，比较设计与地方记忆。','我们记录材料老化的变化，而不是只看竣工照片。','我们在保留旧墙和拆除旧墙的方案之间作对照。']}
    },
    art:{
      experience:{concept:['观众观看与参与的差别','拒绝互动也是一种体验'],proof:['我们记录观众在展厅里靠近、绕开与停留的行动。','我们比较阅读说明前后的观看反馈。','我们观察拒绝参与的观众，避免只收集热情回答。']},
      form:{concept:['媒介选择与观看条件','作品形态与展场路径'],proof:['我们比较影像、文字和装置对同一内容的呈现。','我们在不同展厅尺度中测试观看距离。','我们测试声光设备关闭后，作品还保留什么。']},
      power:{concept:['作者与参与者的解释权','展览机构对可见性的分配'],proof:['我们让被拍摄者确认授权，并保留撤回方式。','我们记录参与者贡献，避免把劳动隐去。','我们比较门票和开放时间如何影响观众进入。']},
      evidence:{concept:['观众反馈与作者意图的错位','过程档案能够证明的范围'],proof:['我们会保存一次失败的试展，说明如何修改作品。','我们对照观众访谈和自己的策展解释。','我们把相反的反馈也放进档案，不只收集赞美。']},
      memory:{concept:['撤展之后仍被保存的关系','私人记忆进入公共展厅的变化'],proof:['我们让故事讲述者修订自己的档案。','我们记录撤展以后，哪些关系还在继续。','我们比较原语境与展览语境中的照片解释。']}
    },
    startup:{
      experience:{concept:['第一次使用与第二次返回的差别','用户行动与产品预设的冲突'],proof:['我们计划观察新用户在哪一步停下来。','我们比较关掉提醒之后，用户是否仍愿意返回。','我们记录不熟悉技术的用户遇到的实际障碍。']},
      form:{concept:['功能流程与实际需求的关系','自动化应该停止的边界'],proof:['我们比较这个功能和普通表格，测试不可替代之处。','我们先删掉非核心功能，再观察用户能否完成任务。','我们用一个最小原型验证流程，而不是先做完整平台。']},
      power:{concept:['数据创造者与收益分配','用户退出与平台控制的关系'],proof:['我们明确用户拒绝授权时还能使用哪些服务。','我们记录自动化错误由谁承担后果。','我们测试用户是否能导出数据并主动离开。']},
      evidence:{concept:['增长曲线与真实价值的区别','留存指标对用户行为的解释'],proof:['我们对照有无广告投放时的用户行为。','我们记录实际付费意愿，不把口头喜欢算作订单。','我们定义留存所对应的行动，再检查它是否真的有用。']},
      memory:{concept:['旧版本失败留下的判断','早期承诺与当前模式的冲突'],proof:['我们记录上一个版本为什么失败，以及这次改变了什么。','我们比较新旧用户的习惯，解释迁移的代价。','我们先说明停止运营以后，用户积累的数据如何保留。']}
    }
  };
  const openings=['我想先从一个具体行动说起','这个决定不是为了显得复杂','您指出的限制确实存在','如果把项目缩小到最基本的一步','我不想用概念替它免除责任','我先回应您刚才问的那个点','这里真正需要解释的是','这个项目还没有替所有人得出结论','我们可以先把漂亮话放在一边','我想把这一点当成可讨论的假设','我不认为形式自动带来意义','与其直接宣布它成立'];
  const moves=['让我重新审视','迫使我们具体讨论','需要通过实际比较来解释','把问题集中到','并不能跳过','可以从这一点来观察','将判断落实到','要求我们验证','把论证推进到','仍然必须回应'];
  const detours=['因为海报已经看起来很认真。','因为这是我凌晨三点唯一没删的图。','因为咖啡机似乎赞同这个决定。','因为路过的猫替我点了头。','否则我的模型就只是一个很贵的摆件。','先别问我，答辩稿还在路上。','因为我已经把标题字号调得很大了。','我想把今天的沉默也算成答复。','因为这页排版不允许我再改了。','否则评图前那杯咖啡就白喝了。','因为我需要保住这张图的最后一个角。','我希望打印机也能为这个决定负责。'];
  const shuffle=(values,random)=>{const a=values.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  let last=[];try{last=JSON.parse(window.localStorage.getItem('dyb-battle-words-v1')||'[]');if(!Array.isArray(last))last=[]}catch(_){}
  function make({discipline='architecture',topic='form',project='',random=()=>Math.random()}={}){
    if(!concepts[topic])topic='form';const s=(specific[discipline]||specific.architecture)[topic];
    const pick=(values,count)=>{values=values.filter(text=>!project||!window.DYB_QUESTIONS||window.DYB_QUESTIONS.fitsProject({text},project));const fresh=shuffle(values.filter(text=>!last.includes(text)),random),old=shuffle(values.filter(text=>last.includes(text)),random);return fresh.concat(old).slice(0,count)};
    const result=[...pick(openings,3).map(text=>({text,type:'opening'})),...pick(moves,3).map(text=>({text,type:'move'})),...pick(concepts[topic].concat(s.concept),4).map(text=>({text,type:'concept',relevant:true})),...pick(methods[topic].concat(s.proof),4).map(text=>({text,type:'proof',relevant:true})),...pick(detours,2).map(text=>({text,type:'absurd',absurd:true}))];
    last=result.map(t=>t.text);try{window.localStorage.setItem('dyb-battle-words-v1',JSON.stringify(last))}catch(_){}
    return shuffle(result,random);
  }
  window.DYB_BATTLE_WORDS={make,quota:{relevant:8,bridges:6,detours:2,total:16}};
})();
