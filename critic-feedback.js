/* AI comments change the narration, never the rule-engine score. */
(()=>{
  function prompt({discipline,object,project,question,answer,interest,reason,tags=[]}){
    return [
      '用中文写虚构教授的第三人称评图反应。两句，35–65字，含标点最多85字，只输出正文。',
      '写一次具体的反应或要求，口气可以平常，要求却让人感到不对劲。教授听到学生的某个判断后可以认真接纳、抓住一个词不放、当场改口、要求补交反而使问题更荒唐的依据。不要每次都存在危机。',
      '辛辣来自对这次论证具体的误读、矛盾或过度认可，不是骂人或泛泛总结偷换概念。不把每轮都写成维护权威、制度秩序或保护职业资格。',
      '兴趣受到回应时可沿其偏好认真认可荒唐判断；触怒时可停在不喜欢的具体词或方法上。仍按实际判定写，不把回避说成已证实，也不编造奖励、教授私史或额外游戏规则。',
      '本学科：'+discipline+'；评论对象：'+object,'本次项目：'+project,'教授问题：'+question,'学生回答：'+answer,'教授兴趣：'+interest,'本地判定：'+tags.join('、')+'；'+reason,
      '不复述回答开头，只可短引关键词。不要说教，不以值得深入研究结束。不写段子、拟人包袱，不用歧视或人身贬损，不捏造尺寸或与项目无关的场景。',
      '输出前检查长度，最多85字；超长就删转述与总结，不显示检查过程。'
    ].join('\n');
  }

  function valid(text,{project,answer,disciplineId},language){
    if(window.DYB_PROJECT_FACTS&&!window.DYB_PROJECT_FACTS.valid(text,project+' '+answer))return false;
    if(typeof text!=='string'||text.length<18||text.length>110||/<html|<!doctype|unauthorized|api key|gsk_/i.test(text))return false;
    if(language&&!language.valid(text,disciplineId))return false;
    // Short comments need a concrete lexical link, not a mandatory sixteen-character quotation.
    const terms=String(project+' '+answer).match(/[\u4e00-\u9fff]+/g)||[];
    const common=new Set(['这个','项目','我们','可以','如果','一种','是否','因此','问题','这里','不是','的是','才能','没有','需要','进行','通过','实际','认为','解释','判断','关系','教授','回答']);
    const anchors=new Set();for(const term of terms)for(let i=0;i<term.length-1;i++){const piece=term.slice(i,i+2);if(!common.has(piece))anchors.add(piece)}
    return [...anchors].filter(term=>text.includes(term)).length>=2;
  }
  window.DYB_CRITIC_FEEDBACK={prompt,valid};
})();
