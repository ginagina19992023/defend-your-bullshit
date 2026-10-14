/* Project-specific strategy drafts, with explicit source and stale-response cancellation. */
(() => {
  const directions={
    jargon:'用现象学把具体操作转成身体、感知、观看或行动关系。举一个围绕项目的具体体验；幽默来自把一件小事讲得过分认真，不要写无意义诗句。',
    deflect:'聪明地反转评委问题：先回应一个具体点，再把它推向规则、权力或未完成性。保留一个与项目直接有关的包袱，不要只说不是而是。',
    evidence:'用实际可执行的观察、对照或测试回应质疑。没有给定数据时只能说计划，不能编造已经发生的访谈结果。结尾可用一本正经的小笑话。',
    honest:'承认这个项目一个具体的局限，再把诚实转成一个可继续研究的问题。像一个知道自己在硬撑、但仍认真辩护的学生。',
    erase:'明确说删掉或取消项目的哪个部分，解释保留的关系。把撤退讲成方法论，幽默但要有具体对象。',
    balanced:'兼顾一个具体方法和一个概念判断。回答评委的问题，再用一个贴合项目的反差笑点收尾。'
  };
  function prompt({project,question,strategy,discipline,criticInterest="",previous=[]}){
    return ['你正在玩学术嘴替游戏。你扮演替学生作答的人，生成玩家将说出的答辩，而不是教授的评论。',
      '写中文，3到5句，约120到220字。聪明、具体、一本正经地好笑。不要堆砌无关联的名词，不使用Markdown或标题，不提真实教授或机构。',
      '学科：'+discipline,'评委研究兴趣：'+criticInterest,'项目原题：'+project.slice(0,500),'评委当前问题：'+question.slice(0,600),
      '选择的策略：'+strategy.name+'。'+strategy.description,'本轮回应路径：'+(strategy.target||''),'风格要求：'+(directions[strategy.style]||directions.balanced),
      '第一句必须包含项目的这段原文：'+project.slice(0,36),
      '先抓住项目中的具体动作或物体，再解释它如何回应问题。不要杜撰项目不存在的设备、场地、观众反馈或研究数据。',
      previous.length?'避免重复之前的表达：'+previous.slice(-2).map(s=>s.slice(0,200)).join(' / '):'',
      '只输出玩家的答辩正文。'].filter(Boolean).join('\n');
  }
  function valid(text,project){return typeof text==='string'&&text.length>=40&&text.length<=800&&text.includes(project.slice(0,36))&&!/<(?:html|script)|<!doctype|unauthorized|api key|payment required/i.test(text)}
  function fallback({project,question,strategy,previous=[]}){
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
    const list=scripts[strategy.style]||scripts.balanced;return list.find(text=>!previous.includes(text))||list[previous.length%list.length];
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
          if(!valid(text,input.project))throw Error('内容未通过项目关联检查');if(previous.includes(text))throw Error('接口返回了重复回答');source='ai';
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
