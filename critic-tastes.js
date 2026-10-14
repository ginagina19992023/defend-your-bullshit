/* Extra, disclosed reactions to the player's actual argumentative approach. */
(() => {
  const profiles={
    concept:{summary:'研究兴趣：概念与项目之间的关系',likes:['jargon'],facets:['form','experience','memory'],warning:'只报数据，不解释概念'},
    experience:{summary:'研究兴趣：身体感知、记忆与时间',likes:['jargon'],facets:['experience','memory'],warning:'换一个概念回避体验'},
    memory:{summary:'研究兴趣：记忆、痕迹和时间',likes:['jargon','honest'],facets:['memory','experience'],warning:'用新概念跳过记忆与依据'},
    evidence:{summary:'研究兴趣：证据、测试与可验证性',likes:['evidence','balanced'],facets:['evidence','form','experience'],warning:'只谈抽象概念，或反问来回避依据'},
    form:{summary:'研究兴趣：形式与构成的依据',likes:['balanced','evidence'],facets:['form','evidence'],warning:'把形式问题换成另一套概念'},
    power:{summary:'研究兴趣：规则、权力与公共性',likes:['deflect','balanced'],facets:['power'],warning:'反问却不说明具体权力关系'},
    absence:{summary:'研究兴趣：缺席、删减与未完成',likes:['erase','honest'],facets:['form','memory'],warning:'删除之后仍然拒绝解释'}
  };
  function profile({bias,topic}){return profiles[bias]||profiles[bias==='nostalgia'?'memory':bias==='erase'?'absence':topic]||profiles.form}
  const describe=context=>{const p=profile(context);const domain={art:{concept:'作品概念与呈现的关系',experience:'观看、感知与时间',memory:'作品记录、私人记忆与展后延续',evidence:'试展、过程记录与观众反馈',form:'媒介、呈现与观看条件',power:'作者与参与者的解释权',absence:'缺席、撤除与观看'},startup:{concept:'产品概念与实际需求',experience:'用户体验、需求与操作',memory:'迭代、使用习惯与时间',evidence:'用户测试、反馈与指标',form:'功能、流程与必要性',power:'规则、风险与用户权利',absence:'删减功能与替代方案'}}[context.disciplineId];const key=Object.keys(profiles).find(key=>profiles[key]===p);return {...p,summary:domain?'研究兴趣：'+domain[key]:p.summary,rules:'只有回答触及本轮问题、并实际采用偏爱的解释方式才加分。合拍：自信 +1、概念或实质 +1、不适 -1。回避：实质 -1、不适 +2。'};};
  function evaluate({bias,topic,style,analysis:a,answer}){
    const p=profile({bias,topic});const delta={depth:0,confidence:0,substance:0,discomfort:0};
    const inferred=[];
    if(a.inflated>0||/现象学|身体|感知|具身|体验/.test(answer))inferred.push('jargon');
    if(a.evidence>0)inferred.push('evidence');
    if(a.evidence>0&&a.inflated>0)inferred.push('balanced');
    if(a.honest>0)inferred.push('honest');
    if(a.erase>0)inferred.push('erase');
    if(a.evasions>0&&topic==='power')inferred.push('deflect');
    const approaches=style==='manual'||style==='battle'?inferred:[style].filter(s=>inferred.includes(s));
    const explicitDodge=/换一个概念|换个概念|不必回答|不用回答|拒绝解释|无需解释/.test(answer);
    const dodge=explicitDodge||(style==='deflect'&&!(topic==='power'&&a.onTopic)&&(!a.onTopic||!p.likes.includes('deflect')))||((style==='manual'||style==='battle')&&a.evasions>=2&&!a.onTopic);
    const emptyTheory=bias==='evidence'&&a.inflated>=3&&a.evidence===0;
    if(dodge||emptyTheory){delta.substance=-1;delta.discomfort=2;return {delta,kind:'angry',reason:emptyTheory?'触怒偏好：评委要依据，你仍只堆概念。额外实质 -1、不适 +2。':'触怒偏好：换概念或反问，没有把评委追问的点说清楚。额外实质 -1、不适 +2。'}}
    if(a.onTopic&&p.facets.includes(topic)&&approaches.some(s=>p.likes.includes(s))){
      delta.confidence=1;delta.discomfort=-1;
      if(approaches.includes('evidence')||approaches.includes('balanced'))delta.substance=1;else delta.depth=1;
      return {delta,kind:'pleased',reason:'命中评委偏好：这次解释既回应了问题，也采用了他偏爱的论证方式。额外'+(delta.depth?'概念 +1':'实质 +1')+'、自信 +1、不适 -1。'};
    }
    return {delta,kind:'neutral',reason:''};
  }
  window.DYB_CRITIC_TASTES={describe,evaluate};
})();
