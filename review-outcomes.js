/* One ending for every feasible set of unmet goals; discomfort never hides other deficits. */
(() => {
  const goals={depth:8,confidence:8,substance:4,minDiscomfort:4,maxDiscomfort:15};
  const labels={depth:'概念深度不足',confidence:'学术自信不足',substance:'实际依据不足',hot:'委员会过度不适',cold:'委员会毫无波澜'};
  const endings={
    depth:['这件事还没长出一个概念','项目交了，解释还在准备。教授知道你做了什么，但不知道为什么值得讨论。'],
    confidence:['概念到了，汇报人还没到','委员会还没反对，你已经替他们否定了自己。下次可以承认限制，但别把每句话都讲成撤回申请。'],
    substance:['参考文献很多，地基暂缺','教授已经听懂你的理论了，现在想知道：它落在哪一个可观察、可验证的决定上？'],
    hot:['委员会申请精神工伤','概念、语气和依据都够了，唯独没人愿意继续坐在这个房间里。项目需要一点降温，不能只靠更大的理论灭火。'],
    cold:['评委睡得很安详','各项材料都交齐了，委员会却找不到值得争论的一点。项目太礼貌，连反对意见都无处着陆。'],
    'depth+confidence':['一个还没敢出现的概念','你没讲清这个决定为什么重要，也没敢让它站在台上。教授建议先把一个判断说完整，再考虑把它说得宏大。'],
    'depth+substance':['既没想通，也没试过','概念没有形成，验证也还没开始。唯一完整的是展示材料边框，委员会暂时无法把边框授予学位。'],
    'depth+hot':['动静很大，概念很薄','全场都被你惊动了，但没人说得清被什么惊动。教授在寻找核心判断，你正在给音量寻找理论依据。'],
    'depth+cold':['安静得像尚未打开的文件','概念没展开，委员会也没产生疑问。这个项目目前最稳定的空间关系，是它和文件夹的关系。'],
    'confidence+substance':['证据没到，你也不敢保证','你一边说可能成立，一边拿不出可以检查的依据。教授愿意等下一次原型，暂时不接受用犹豫代替原型。'],
    'confidence+hot':['评委很生气，你先道歉','你的回答把教授推到了情绪边界，你却没能稳住自己的判断。请先把一句话说完，不要在论证中途申请退场。'],
    'confidence+cold':['双方礼貌地什么也没决定','你不敢坚持，教授也懒得反对。评图顺利结束了，项目没有顺利开始。'],
    'substance+hot':['吵醒全场，没带证据','你成功让委员会陷入争论，却没给任何一方一份可以检查的材料。理论烟雾很浓，验证方案还没交。'],
    'substance+cold':['温和地悬浮在现实之外','项目没有落地，也没有让教授感到危险。它像一朵经过排版的云：可以观看，暂时无法验收。'],
    'depth+confidence+substance':['展示材料先毕业了','概念、信心和依据都还在准备，只有排版已经完成终评。教授建议下一次让项目也一起到场。'],
    'depth+confidence+hot':['慌张地制造了一场理论事故','核心概念没站住，你的语气也在后退，委员会的不满却十分坚定。别急着补一位大师，先补一个能解释的决定。'],
    'depth+confidence+cold':['一场没有发生的答辩','你没提出清楚的概念，也没坚持任何判断。教授留下了礼貌的沉默，像给空白展示材料盖了一个空气章。'],
    'depth+substance+hot':['只有争议完成了设计','概念和依据都没达标，委员会的血压却提前完成了。这个项目目前唯一可验证的成果，是房间确实变得不安。'],
    'depth+substance+cold':['空白，但尚未成为留白','概念没有形成，证据也没有出现，教授还没找到值得追问的入口。空白可以是一种选择，前提是你先解释选择。'],
    'confidence+substance+hot':['一边点火，一边申请撤回','你没给出够用的依据，又没能稳住自己的立场，却成功触怒了教授。委员会无法判断该先救项目，还是先救这场汇报。'],
    'confidence+substance+cold':['没人反对，也没人相信','你和教授都保持了礼貌距离。依据不足，语气也不足以承担判断，项目暂时被放进“下次再说”的永久待办清单。'],
    'depth+confidence+substance+hot':['全员不适，项目缺席','概念、信心和依据都没有到场，争议却坐满了评图席。委员会建议先完成一个小决定，再考虑让全世界不舒服。'],
    'depth+confidence+substance+cold':['评图室里的待机模式','三项准备都没完成，委员会也没有被唤醒。教授合上笔记本：今天可以算设备测试，暂时不算答辩。']
  };
  function discomfort(a,{tooEmpirical,tooConceptual,tooHonest,tooAmbitious,eraseDesign},preference={}){
    let value=2+Math.min(2,Math.floor(a.evasions/2))+(tooEmpirical?1:0)+(tooConceptual?2:0)+(tooHonest?1:0)+(tooAmbitious?1:0)+(eraseDesign?2:0)-(a.onTopic?1:0)+Math.min(1,Math.max(0,preference.discomfort||0));
    if(a.onTopic&&a.evidence>0)value-=1;
    return value;
  }
  function verdict(scores,project,discipline="architecture"){
    const issues=[];for(const key of ['depth','confidence','substance'])if(scores[key]<goals[key])issues.push(key);
    if(scores.discomfort>goals.maxDiscomfort)issues.push('hot');else if(scores.discomfort<goals.minDiscomfort)issues.push('cold');
    if(!issues.length){
      const title=scores.discomfort>=12?'教授不满，但还是签了字':scores.substance>=10?'把荒谬做成了对照实验':scores.depth>=16&&scores.confidence>=16?'委员会宣布无法轻易否定':'附条件通过：下次还敢请你';
      return {passed:true,stamp:'PASSED WITH CONDITIONS',title,text:`你让「${project}」同时拥有了概念、汇报的底气和可检查的依据，也给委员会留下了恰好够讨论的争议。教授签字了，问题没有消失。`,issues:[],key:'passed'};
    }
    const key=issues.join('+'),[title,comment]=endings[key];
    const advice={architecture:'下一步请比较一个具体空间决定与实际使用。',art:'下一步请比较作品的呈现方式、观众观看与解读的变化。',startup:'下一步请比较功能、操作流程与用户实际完成任务的情况。'}[discipline]||'';
    return {passed:false,stamp:issues.length>1?'REVISIONS ON '+issues.length+' FRONTS':'REVISION REQUIRED',title,text:`「${project}」：${comment}${advice}\n本次待修改：${issues.map(issue=>labels[issue]).join('、')}。`,issues,key};
  }
  window.DYB_REVIEW_OUTCOMES={goals,endings,discomfort,verdict};
})();
