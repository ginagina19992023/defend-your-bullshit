/* Project-specific strategy drafts, with explicit source and stale-response cancellation. */
(() => {
  const directions={
    jargon:'现象学烟雾弹：把题目的具体操作讲成身体与世界之间过分郑重的协商。先有一个可想象的体验，再提出一次概念升级，最后用一本正经的反差收尾。身体可以被冒犯，术语不能替人走路。不要写抒情散文。',
    deflect:'问题反转术：先承认问题的一个具体点，再审查是谁规定了评判标准，把规则也拉上答辩席。要有锋利但有逻辑的反问，让教授发现自己的问题也欠一份说明。禁止泛泛地说问题本身就是答案。',
    evidence:'证据策略：像一个给荒谬项目做认真对照实验的人，提出针对题目而可执行的验证。笑点来自研究程序的严肃和项目的小题大做，不来自捏造数据。把海报、语气或掌声与真正的证据分清。',
    honest:'危险的诚实：具体承认一个局限，再郑重地给失败办理学术身份。像知道自己在硬撑却拒绝撒谎的学生。自嘲可以锋利，但保留一个可继续研究的判断和下一步。',
    erase:'删减策略：撤掉题目中的设计介入，质疑建筑师、艺术作者或产品设计师的专业意义与存在必要性。追问是否是专业身份先制造问题，再把自己的介入宣布为答案；如果没有设计者，事情是否反而能够发生。语气要尖锐、一本正经，像把评委的职业合法性一起拉上答辩席。必须围绕当前项目说清被撤掉的决定和仍存在的关系，而不是夸撤退优雅，也不是泛泛骂设计师。可以给一项有无介入的对照，让自我否定承担检验。',
    balanced:'替客户讲清楚：用清晰理由给荒谬项目辩护，并让概念接受实际验证。语气像在认真为一件离谱小事申请研究经费，最后一处反差与题目紧密相关，不写温吞的总结。'
  };
  function prompt({project,question,strategy,discipline,disciplineId,topic,criticInterest="",previous=[]}){
    return ['你正在玩学术嘴替游戏。你扮演替学生作答的人，生成玩家将说出的答辩，而不是教授的评论。',
      '写中文，4到5句，约150到240字。像真正硬撑的学术嘴替：认真、尖锐、荒谬、有节奏。禁止写成产品说明、温吞建议或散文。不要堆砌无关联的名词，不使用Markdown或标题，不提真实教授或机构。',
      '结构：抓住题目一个具体矛盾→按所选策略把它学术升级→正面回应教授追问并给一个方法或判断→用与这个矛盾相关的冷幽默收尾。正文至少两处有趣的反差，不要只在结尾贴一句笑话。',
      '幽默尺度示例：删墙时可以说“墙已经退场，边界还在坚持上班”；循环开幕致辞可以说“作品一直在开幕，观众已经下班”；提醒关闭提醒可以说“解决问题的通知，成了问题本人”。这些是写法示范，只在题目确实对应时使用，不照搬到别的题目。',
      '不要逐字复述整句教授问题；把它要你解释的点落实到回答。避免固定开头“我想讨论的是”、套路句“理论可以把项目抬高”和到处适用的泛泛总结。',
      '学科：'+discipline,'评论和回答只针对本学科对象，不用建筑词汇解释艺术作品或产品。','评委研究兴趣：'+criticInterest,'项目原题：'+project.slice(0,500),'评委当前问题：'+question.slice(0,600),
      '选择的策略：'+strategy.name+'。'+strategy.description,'本轮回应路径：'+(strategy.target||''),'风格要求：'+(directions[strategy.style]||directions.balanced),
      '第一句必须包含项目的这段原文：'+project.slice(0,36),
      '先抓住项目中的具体动作或物体，再解释它如何回应问题。不要杜撰项目不存在的设备、场地、观众反馈或研究数据。',
      previous.length?'避免重复之前的表达：'+previous.slice(-2).map(s=>s.slice(0,200)).join(' / '):'',
      '只输出玩家的答辩正文。'].filter(Boolean).join('\n');
  }
  function valid(text,project){return typeof text==='string'&&text.length>=40&&text.length<=800&&text.includes(project.slice(0,36))&&!/<(?:html|script)|<!doctype|unauthorized|api key|payment required/i.test(text)}
  function fallback({project,question,strategy,disciplineId,topic,previous=[]}){
    // These are complete alternative arguments, not random word substitutions.
    const p='「'+project+'」',q='「'+question.slice(0,70)+'」';
    const scripts={
      jargon:[`对${p}，我想讨论的是身体如何先于解释作出反应。参与者可能先停下、绕开或者靠近，然后才问这件事有什么用。您问${q}，我会从这个实际行动出发，而不是让术语替它发生。概念可以晚到一点，身体已经在现场替它签到。`, `在${p}里，重要的不只是物体，而是人如何意识到自己正在看它。关于${q}，我希望比较同一个人靠近与离开时的判断，观察形式怎样改变行动。这并不保证每个人都感动，现象学也不能强迫一个人被三句话说服。`, `我不想替${p}颁发一个天然成立的意义。面对${q}，我先把它当作一次感知的打断：人为什么停下，又如何重新行动？我们可以记录这些差异，再讨论它是不是产生了关系。暂时让身体负责体验，让概念负责加班。`],
      deflect:[`我接受${q}，但对${p}来说，还需要问谁决定了评判它的标准。我们先把实际使用过程记录下来，再看这条规则解释了什么、遗漏了什么。我不是取消问题，只是不希望项目在开口之前，已经被问题宣判。`, `关于${p}，如果只按现成的答案来验收，我们得到的可能只是一个非常听话的项目。我会先回应${q}中的具体限制，再提出一个可比较的不同做法。项目可以接受质疑，但不必接受每一道问题都自带标准答案。`],
      evidence:[`针对${p}和${q}，我会先做一个最小原型，记录使用者的行动与反馈，再和未改动的情况对照。现在没有数据，所以我不能宣称它已经有效；如果结果相反，就修改判断。证据可以不宏大，至少别让结论比项目先竣工。`, `关于${p}，我会把${q}拆成一个可验证的假设：什么变化出现，才算我们的决定有用？先观察、记录，再比较不同做法，而不是只挑好看的照片。如果测试失败，至少我们终于得到了一样不用靠语气证明的东西。`],
      honest:[`我承认${p}还不能完全回答${q}。最值得承认的，不是整个项目没有价值，而是我们目前在哪个具体判断上缺少依据。我希望通过测试缩小这个不确定性，而不是把它包装成已经解决的问题。现在我能保证的，是我知道自己在哪里不敢保证。`, `对于${p}，我现在没有一个可以让${q}立即闭嘴的答案。我可以明确说出当前的限制，再提出下一步怎么观察、验证和修改。把失败写进过程，不是让它自动升华；至少下次汇报时，它不会再穿着成功的衣服进来。`],
      erase:[`如果取消${p}里最显眼的那一步，我们反而能看清${q}究竟在问什么。我会比较保留与删除两种情况，观察关系是否仍然存在。删除不是免答题券，也需要证据；我只是希望项目不要为了证明自己存在，先占满所有空间。`, `我想先从${p}里拿掉那个最急于替自己解释的部分。面对${q}，剩下的行动、边界和反馈可能比完整形象更诚实。我们用对照去判断删掉后究竟损失了什么，不能因为东西变少，就声称思想变多。`],
      balanced:[`对${p}，我先回答${q}里的具体判断，再讨论概念。我们可以通过原型观察实际行动，记录差异并比较不同做法，让形式、体验和公众之间的关系有一个可检查的落点。理论可以把项目抬高，但至少要留一条梯子，让证据上得来。`, `我不会让${p}只靠一个漂亮概念通过${q}。先明确我们想改变的实际关系，再用测试、观察和反馈决定下一步。如果概念成立，它应该能承担一个具体反例；否则它只是比项目更擅长汇报。`]
    };
    const satirical=window.DYB_SATIRICAL_DRAFTS?.drafts(disciplineId,{project,question,strategy,topic});
    const specific=window.DYB_DISCIPLINE_LANGUAGE?.drafts(disciplineId,{project,question,strategy});
    const list=satirical||specific||scripts[strategy.style]||scripts.balanced;return list.find(text=>!previous.includes(text))||list[previous.length%list.length];
  }
  function create({request}={}){
    let sequence=0,controller=null;const seen=new Map();
    function cancel(){sequence++;if(controller)controller.abort();controller=null}
    async function generate(input,{mode='ai',provider='local',model='llama3.1'}={}){
      cancel();const id=sequence;const key=input.project+'|'+input.question+'|'+input.strategy.name;
      const previous=seen.get(key)||[];const context={...input,previous};let text='',source='local',failure='';
      if(mode==='ai'){
        controller=new AbortController();const owned=controller;const signal=owned.signal;const timeout=setTimeout(()=>owned.abort(),12000);
        try{
          text=await request(prompt(context),{signal,provider,model});
          if(!valid(text,input.project)||(window.DYB_DISCIPLINE_LANGUAGE&&!window.DYB_DISCIPLINE_LANGUAGE.valid(text,input.disciplineId)))throw Error('内容未通过项目与学科检查');if(previous.includes(text))throw Error('接口返回了重复回答');source='ai';
        }catch(error){failure=error.name==='AbortError'?'请求超过12秒':(error.message||'网络连接失败');text=''}finally{clearTimeout(timeout)}
      }
      if(id!==sequence)return null;
      if(!text)text=fallback(context);
      seen.set(key,[...previous,text].slice(-8));controller=null;
      return {text,source,failure,unavailable:mode==='ai'&&source!=='ai'};
    }
    return {generate,cancel};
  }
  window.DYB_STRATEGY_WRITER={create,prompt,valid,fallback};
})();
