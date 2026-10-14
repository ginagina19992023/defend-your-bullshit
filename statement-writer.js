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
    '为学术嘴替游戏写开场概念陈述，不是教授点评，不是回应某个问题。中文四段，每段一至两句，总计180至260字，不写标题或Markdown。',
    '这是代汇报游戏里的黑色幽默陈述，不是一本认真讨论设计伦理的论文。说话者需要替客户保住一个荒唐项目。目标不是把项目解释为正常好设计，而是让缺陷获得一种听起来正式、实际上让项目更加反常的存在理由。',
    '让论证落在人物的利益与反常规则上：到底为了保住项目，谁必须继续等待、无法完成或不能验证？只选本题实际支持的一项；不要把所有项目都套成等待或验证。语气平静，内容可以冷酷、自利、矛盾，不在结尾主动纠正自己的荒谬。不靠歧视或段子取得效果。',
    '唯一核心：从项目最荒谬的微小细节出发，说明它具体改变什么，再把这一变化赋予过分重大的学术意义。用连续因果链一本正经地过度阐释，不编笑话。',
    '在可理解的论证之后，再跨过一小步：将本题的代价、限制或缺陷升级为项目成立的必要条件，而不是停在有道理的分析。结论要比前提配得上的意义更绝对一点，但沿用同一条因果链，只越界一次，不引入无关项目的数字或设定。',
    '不要用正常常识消解夸张：不必先说明物理上并不妨碍、实际上可以跨过、只是一个比喻。把本题细节认真宣称为心理或制度上无法越过的巨大障碍，是允许且需要的写法。夸大其精神重量，而不是补造另一个数值。直接进入这种反常体验，不在末尾收回。',
    '第一段抓住题目已经给出的具体数字、材料、动作或限制；没有数字就从动作或限制出发，绝对不能编造数值、承诺指标、说明书页码或产品功能；第二段扩大它改变的关系；第三段推向学科的重要概念；第四段落在这个细节引发的学术追问。四段必须围绕同一个细节，不东拼西凑术语。',
    '不复述项目标题，不随机插入术语，不强制介绍测试计划。不写段子、拟人、包袱、金句、抖机灵和反转收尾。不把物体写成办护照、入职、签收。',
    '学科：'+input.disciplineId,'当前项目：'+input.project,
    input.disciplineId==='startup'?'产品包的玩家站在荒谬产品的辩护立场：抓住产品想维持的利益，与用户真正想完成的事情之间的冲突。不要默认检讨缺陷或许诺以后测试；把这个利益冲突重新论证为产品成立的条件。未经验证的提效工具重点是为何阻止用户验证，不是如何尽快验证。其他题目沿自身矛盾，不能全部套阻止验证。':'',
    '实际操作：'+c.premise,'具体体验：'+c.experience,'本题的意义放大路径：'+c.magnification,'过程与时间：'+c.time,
    '这些是本题素材，不逐字拼接，重写为流畅的论证。不要借用其他项目的数字或物体，不伪造研究结果。题目给定的尺寸不变，但精神、感知和意义上的夸大不受物理尺度限制；题目没有的中心场地、施工材料、设备和既有测试不得补造。',
    '自定义题目没有匹配案例时，从题目本身寻找独特的细节，不只说“这个介入”，不得捏造项目设定。',
    '本次版本：'+input.variant+'，换一个起笔角度，保持论证核心。只输出四段正文，用空行分隔。'].join('\n')}
  function valid(text,input){if(window.DYB_PROJECT_FACTS&&!window.DYB_PROJECT_FACTS.valid(text,input.project))return false;const numbers=String(text).match(/\d+(?:\.\d+)?/g)||[];const source=input.project+' '+JSON.stringify(context(input));if(numbers.some(n=>!source.includes(n)))return false;if(typeof text!=='string'||text.length<100||text.length>450||/<html|<!doctype|api key|gsk_/i.test(text))return false;return window.DYB_CRITIC_FEEDBACK.valid(text.slice(0,110),{project:input.project,answer:context(input).premise,disciplineId:input.disciplineId},window.DYB_DISCIPLINE_LANGUAGE)&&window.DYB_DISCIPLINE_LANGUAGE.valid(text,input.disciplineId)}
  function create({request}){let sequence=0,controller;return{cancel(){sequence++;controller?.abort()},async generate(input,{mode='ai'}={}){const id=++sequence;controller?.abort();controller=new AbortController();const owned=controller;let paragraphs=fallback(input),source='local';if(mode==='ai'){const timer=setTimeout(()=>owned.abort(),25000);try{const text=await request(prompt(input),{signal:owned.signal});if(valid(text,input)){paragraphs=text.trim().split(/\n\s*\n/);if(paragraphs.length===4)source='ai';else paragraphs=fallback(input)}}catch{}finally{clearTimeout(timer)}}return id===sequence?{paragraphs,source}:null}}}
  window.DYB_STATEMENT_WRITER={fallback,prompt,valid,create};
})();
