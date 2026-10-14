/* The opening statement follows the project's own detail, rather than random vocabulary. */
(()=>{
  function context({project,disciplineId}){return window.DYB_QUESTION_ARGUMENTS.plan({project,disciplineId,question:'为什么必须这样做？'}).case}
  function fallback(input){
    const c=context(input),profile=window.DYB_DISCIPLINE_LANGUAGE.profile(input.disciplineId);
    const meaning=c.magnification.split('；');
    const versions=[
      [c.premise.replace(/^我/,'本项目')+'。',c.magnification+'。',`${c.experience}。这一具体过程使${profile.people}不再只是接受${profile.object}，也成为其意义成立的条件。`,`${c.time}。项目由此追问的，是这个微小决定如何改变我们对${profile.object}的定义。`],
      [meaning[0]+'。',meaning.slice(1).join('；')?meaning.slice(1).join('；')+'。':c.premise.replace(/^我/,'这里')+'。',`${c.experience}。通常被忽略的这个动作，在此成为重新理解${profile.object}的起点。`,`${c.time}。意义并不来自增加了多少内容，而来自原本默认的关系如何变得需要重新解释。`],
      [c.premise.replace(/^我/,'这里')+'。',`${c.experience}。${c.magnification}。`,`${c.stake}。一个看似微不足道的决定，因而涉及${profile.people}如何参与${profile.object}的成立。`,`${c.time}。这个项目将上述差别视为理解${profile.object}的具体入口，而不把它当成可以忽略的细节。`]
    ];return versions[(input.variant||0)%3];
  }
  function prompt(input){const c=context(input);return[
    '写一段开场概念陈述，中文四段，每段一至两句，共180–260字。不要标题或Markdown。',
    '适用于任何题目，包括自定义题目：从题目里一个实际的动作、尺寸、限制或缺席起笔，把它过分郑重地放大。小事逐渐承担不成比例的意义，保持同一条具体论证。',
    '不要用正常常识消解夸张，不必先纠正它实际能否做到。可以制造精神上无法越过的阻碍，但不改掉题目数字，也不把每个项目都说成存在资格、无限价值或支配全世界。',
    '沿玩家自己的项目展开，不额外设置客户、俱乐部利益、行政规则或人物经历。不要在正文分析黑色幽默的原理，也不解释自己在扯淡。',
    '当前学科：'+input.disciplineId,'当前题目：'+input.project,'具体操作：'+c.premise,'实际体验：'+c.experience,'可放大的关系：'+c.magnification,'时间与过程：'+c.time,
    '素材提供方向，不逐字拼接。第一段落在具体细节，后面把其关系和意义逐步推得过头；不强制介绍验证计划或做正常整改。',
    '不复述完整标题，不随机插术语，不写段子、拟人笑话和反转包袱。不捏造数字、设备、场地或实际发生的数据；没有数字就从动作或限制出发。',
    '结尾仍属于本题论证，不补伦理提醒或合理化解释。换一处起笔，版本：'+input.variant+'。仅输出四段正文，用空行分隔。'
    ].join('\n')}

  function valid(text,input){if(window.DYB_PROJECT_FACTS&&!window.DYB_PROJECT_FACTS.valid(text,input.project))return false;const numbers=String(text).match(/\d+(?:\.\d+)?/g)||[];const source=input.project+' '+JSON.stringify(context(input));if(numbers.some(n=>!source.includes(n)))return false;if(typeof text!=='string'||text.length<100||text.length>450||/<html|<!doctype|api key|gsk_/i.test(text))return false;return window.DYB_CRITIC_FEEDBACK.valid(text.slice(0,110),{project:input.project,answer:context(input).premise,disciplineId:input.disciplineId},window.DYB_DISCIPLINE_LANGUAGE)&&window.DYB_DISCIPLINE_LANGUAGE.valid(text,input.disciplineId)}
  function create({request}){let sequence=0,controller;return{cancel(){sequence++;controller?.abort()},async generate(input,{mode='ai'}={}){const id=++sequence;controller?.abort();controller=new AbortController();const owned=controller;let paragraphs=fallback(input),source='local';if(mode==='ai'){const timer=setTimeout(()=>owned.abort(),25000);try{const text=await request(prompt(input),{signal:owned.signal});if(valid(text,input)){paragraphs=text.trim().split(/\n\s*\n/);if(paragraphs.length===4)source='ai';else paragraphs=fallback(input)}}catch{}finally{clearTimeout(timer)}}return id===sequence?{paragraphs,source}:null}}}
  window.DYB_STATEMENT_WRITER={fallback,prompt,valid,create};
})();
