/* Project-specific strategy drafts, with explicit source and stale-response cancellation. */
(() => {
  const directions={
    jargon:'现象学：从身体实际如何停步、绕行、观看出发，把微小操作放大为感知与秩序的关系。不要拟人，不要写抒情散文。',
    deflect:'问题反转：先回应追问，再揭示原有规则同样依赖未经说明的前提。反问必须来自项目的具体差别。',
    evidence:'证据：把放大的学术解释变成一个具体可观察的差别。只有被问到依据时才给简短验证方法，不捏造数据。',
    honest:'诚实：指出放大的解释在哪个具体条件下不能成立，不把失败写成勋章或笑话。',
    erase:'删减：撤回具体介入，追问意义是否仍存在，以及设计者是否制造了对自己的需求。围绕项目质疑专业存在的必要性。',
    balanced:'清晰辩护：从具体细节逐步推导它如何改变关系，以过度郑重但可以跟上的学术判断结束。'
  };
  function prompt({project,question,strategy,discipline,disciplineId,topic,criticInterest="",previous=[]}){
    const plan=window.DYB_QUESTION_ARGUMENTS?.plan({project,question,topic,disciplineId});
    return [
      '生成玩家将说出的答辩，不是教授评论。用中文，两句为主，50到80字，含标点最多100字。只输出正文。',
      '适用于任何题目：抓住它最离谱的具体细节，把它说得比实际大得多。普通高度可以成为无法越过的精神阻碍，删除可以被说成更完整的建造，但只能沿当前项目的细节推演。',
      '语法像认真汇报，结论让人觉得竟然还能这样辩。尽量用一个明确的主张和一个具体推论，不写泛泛的“存在资格、全部意义、制度秩序”，不让每个题目都变成同一种宏大命题。',
      '说话者正在回应一个具体问题，不是解释这款游戏的黑色幽默。不要补写客户利益、俱乐部规则或人物动机，除非当前素材已经给出。',
      '学科：'+discipline,'当前项目：'+project,'教授问题：'+question,'教授兴趣：'+criticInterest,
      '所选策略：'+strategy.name+'；'+(strategy.description||''),'表达路径：'+(directions[strategy.style]||directions.balanced),
      plan?'实际追问要求：'+plan.demand:'',plan?'本题可用的具体素材：'+plan.case.premise+'；'+plan.case.experience:'',plan?'本题可放大的关系：'+plan.case.magnification:'',
      plan&&['evidence','failure','compare'].includes(plan.intent)?'涉及验证或比较时可用：'+plan.test+'；反例：'+plan.case.failure:'',
      '不要复述标题或问题，不写段子、抖机灵、金句和拟人包袱。不添加题目没有的数字、材料或项目设定；心理夸大可以很猛烈，不用补一句实际上可行来收回它。',
      '不要人身攻击、歧视或捏造研究结果。只针对当前学科。',
      previous.length?'换一条具体说法，不重复这些原句：'+previous.slice(-2).join(' / '):'',
      '输出前进行内部检查字数，删铺垫、重复和总结，最多100字，不显示检查过程。'
    ].filter(Boolean).join('\n');
  }

  function valid(text,project){if(window.DYB_PROJECT_FACTS&&!window.DYB_PROJECT_FACTS.valid(text,project))return false;return typeof text==='string'&&text.length>=40&&text.length<=120&&!/<(?:html|script)|<!doctype|unauthorized|api key|payment required/i.test(text)}
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
        controller=new AbortController();const owned=controller;const signal=owned.signal;const timeout=setTimeout(()=>owned.abort(),25000);
        try{
          const instructions=prompt(context);
          text=await request(instructions,{signal,provider,model});
          if(typeof text==='string'&&text.length>100&&text.length<=2000){
            text=await request(instructions+'\n压缩任务：下文是你刚写的答辩。保留其具体回答与最尖锐的一项推论，不添加事实或笑话。改为两句、50–80字，含标点最多100字。内部数完字再输出，仅输出压缩后的正文。\n原答辩：'+text,{signal,provider,model});
          }
          if(window.DYB_QUESTION_ARGUMENTS&&!window.DYB_QUESTION_ARGUMENTS.valid(text,window.DYB_QUESTION_ARGUMENTS.plan(input)))throw Error('没有回应本句追问的具体要求');
          if(!valid(text,input.project)||(window.DYB_DISCIPLINE_LANGUAGE&&!window.DYB_DISCIPLINE_LANGUAGE.valid(text,input.disciplineId)))throw Error('内容未通过项目与学科检查');if(previous.includes(text))throw Error('接口返回了重复回答');source='ai';
        }catch(error){failure=error.name==='AbortError'?'请求超过25秒':(error.message||'网络连接失败');text=''}finally{clearTimeout(timeout)}
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
