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
    return ['你正在玩学术嘴替游戏。你扮演替学生作答的人，生成玩家将说出的答辩，而不是教授的评论。',
      '写中文，两句为主，50到80字，最多100字。像真正硬撑的学术嘴替：认真、尖锐、荒谬、有节奏。禁止写成产品说明、温吞建议或散文。不要堆砌无关联的名词，不使用Markdown或标题，不提真实教授或机构。',
      '核心写法：抓住题目最微小或离谱的细节→说明它具体怎样改变行动或关系→将这个差别过度郑重地放大为边界、资格、秩序或真实的问题。三步保持同一条因果链。荒谬来自小题大做的论证，不来自随机跳跃、拟人和结尾段子。不写“荒诞推论”等标签，不强行总结。',
      plan?'本题可放大的具体关系：'+plan.case.magnification+'。这是论证方向，不要逐字照抄。':'从自定义项目实际的数字、动作、材料或限制推导意义，不借用其他项目的细节。',
      '荒谬程度再推进一步：不要停在合理的批判或普通辩护。沿本题同一条逻辑，把一个原本只是代价、限制或缺陷的条件，郑重地升级为项目成立的必要条件。只越界一次，读者能跟上推理却发现结论过头；不得改写事实、胡乱跳跃或逃避教授的具体追问。',
      '凝练要求：第一句直接给关键判断，第二句把这项判断推到过头的学术结论。只保留一个对象和一条推论，不解释同一件事两次，不写逐步展开的长从句，不补总结。每句尽量不超过40字。锋利来自判断，不来自歧视词、人身攻击或贬损群体。',
      '不要逐字复述整句教授问题；把它要你解释的点落实到回答。避免固定开头“我想讨论的是”、套路句“理论可以把项目抬高”和到处适用的泛泛总结。',
      '学科：'+discipline,'评论和回答只针对本学科对象，不用建筑词汇解释艺术作品或产品。','评委研究兴趣：'+criticInterest,'项目原题：'+project.slice(0,500),'评委当前问题：'+question.slice(0,600),
      plan?'本句问题的实际要求：'+plan.demand:'',plan?'必须在前两句直接回答的点：'+plan.answer:'',plan?'题目特有的论证矛盾：'+plan.case.premise:'',plan?'可用的具体比较与反例：'+plan.test+'；失败条件：'+plan.case.failure:'',
      disciplineId==='startup'?'这是产品辩护，不是产品整改报告。除非教授问题或策略明确要求证据与诚实，不要自动许诺测试或承认产品无用。围绕本产品维持自身利益的矛盾进行学术化辩护；未经验证的提效工具的核心是如何让用户的验证不再成为产品价值的裁决，不是解释未来会做实验。别把所有产品都套成同一种验证问题。':'',
      '选择的策略：'+strategy.name+'。'+strategy.description,'本轮回应路径：'+(strategy.target||''),'风格要求：'+(directions[strategy.style]||directions.balanced),
      '不要复述项目标题或教授问题，不以“关于这个项目”“我的回答是”“您问的是”开头。直接说判断，项目只需通过具体对象和动作体现。',
      '先抓住项目中的具体动作或物体，再解释它如何回应问题。不要杜撰项目不存在的设备、场地、观众反馈或研究数据。',
      previous.length?'避免重复之前的表达：'+previous.slice(-2).map(s=>s.slice(0,200)).join(' / '):'',
      '绝对不写段子：不追求搞笑，不安排包袱、抖机灵、冷幽默、金句或反转收尾。整段是一条连续的学术论证，最后一句继续推导或限定判断，而不是另贴笑话。荒谬仅来自解释尺度远大于项目细节，措辞保持真实讲评的严肃与克制。',
      '禁止给物体办理护照、入职、辞职、升职、签收、免检等拟人段子；不要生搬神经科学、拓扑、量子或统计名词。术语必须解释当前实际差别。',
      '风格示范：三厘米不足以阻挡身体，却足以把经过重新定义为跨越；公共空间因此由谁需要抬脚、谁能直接通过来界定。示范只展示推演方式，当前题目没有三厘米或广场时绝不可借用这些对象。',
      '输出前在内部检查字数：正文含标点不超过100字，优先50–80字。若超长，先删铺垫、重复解释和总结，再改写为两句；不输出字数、检查过程或说明。',
      '只输出玩家的答辩正文。'].filter(Boolean).join('\n');
  }
  function valid(text,project){return typeof text==='string'&&text.length>=40&&text.length<=120&&!/<(?:html|script)|<!doctype|unauthorized|api key|payment required/i.test(text)}
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
