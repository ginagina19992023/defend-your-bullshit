/* DEFEND YOUR BULLSHIT — deterministic local simulation engine.
   Generation is structured satire, not AI. Scoring uses topic relevance,
   grounded evidence and rhetorical evasion; not raw answer length. */
(() => {
"use strict";
const $ = id => document.getElementById(id);
const keys = Object.keys(window.DYB_PACKS);
const random = arr => arr[Math.floor(Math.random()*arr.length)];
const clamp = (x,min,max) => Math.max(min,Math.min(max,x));
const pack = () => window.DYB_PACKS[$("pack").value];
const state = {project:"",statement:"",round:0,scores:{depth:0,confidence:0,substance:0,survival:0},chosen:0,question:null,history:[]};
function show(id){for(const x of ["setup","statement","defense","final"]) $(x).hidden=x!==id;window.scrollTo?.(0,0)}
function updateChoice(){document.querySelectorAll(".strategy").forEach((el,i)=>el.classList.toggle("selected",i===state.chosen))}
function addSelects(){
  for(const key of keys){const option=document.createElement("option");option.value=key;option.textContent=window.DYB_PACKS[key].name;$("pack").append(option)}
}
function statement(){
 const p=pack(),v=p.vocabulary,intensity=Number($("intensity").value),a=random(v),b=random(v.filter(x=>x!==a)),c=random(v.filter(x=>x!==a&&x!==b));
 const project=state.project;
 const first="本项目并不试图简单地"+project+"，而是将这一看似微不足道的操作视作一次关于"+a+"的空间实践。通过改变观看和行动的既定方式，作品试图重新审视主体与环境之间的关系。";
 const second="在这一过程中，"+project+"不再仅仅是一项物理动作，而逐渐被转译为一种围绕"+b+"展开的开放系统。材料、时间与参与者的介入共同塑造了作品中不断变化的意义。";
 const third="我们特别关注过程而非结果：随着形式被重复、修正和重新感知，原本稳定的空间界线变得难以确定。由此，"+c+"并非附着于形式之上的解释，而成为设计发生的条件。";
 const final="最终，真正需要讨论的并非项目是否完成，而是我们为什么仍旧假设空间必须被完成。作品试图将这个无法被轻易解决的问题留给每一个参与者。";
 state.statement=[first,second,...(intensity>=2?[third]:[]),...(intensity>=3?[final]:[])].join("\n\n");
 $("generated").textContent=state.statement;
 show("statement");
}
const countMatches=(text,terms)=>terms.reduce((count,term)=>count+(text.includes(term)?1:0),0);
function evaluate(answer,question,style){
 const p=pack(),topic=p.topics.find(t=>t.id===question.topic);
 const relevant=countMatches(answer,topic.keywords);
 const other=p.topics.filter(t=>t.id!==question.topic).reduce((n,t)=>n+countMatches(answer,t.keywords),0);
 const evidence=countMatches(answer,p.topics.find(t=>t.id==="evidence").keywords);
 const inflated=countMatches(answer,p.vocabulary.concat(["本体","范式","话语","解构","再语境化","辩证","主体性","开放性","后人类"]));
 const evasions=countMatches(answer,["不是","而是","追问","谁规定","无法回答","未完成","留白","开放","不在于","问题本身"]);
 const concrete=countMatches(answer,["因为","例如","通过","对比","记录","测试","测量","现场","使用者","厘米","米","小时","次","材料"]);
 const onTopic=relevant>0 || (question.topic==="evidence"&&evidence>0);
 const depth=clamp(1+Math.min(3,inflated)+Math.min(2,other>1?2:other)+Math.min(2,evasions),0,7);
 const confidence=clamp(1+Math.min(3,evasions)+Math.min(2,inflated)+Math.min(1,answer.length>70?1:0),0,7);
 const substance=clamp((onTopic?2:0)+Math.min(3,evidence)+Math.min(2,concrete)-(inflated>=3&&evidence===0?2:0)-(evasiveWithoutAnswer()?1:0),-2,7);
 function evasiveWithoutAnswer(){return evasions>=2&&!onTopic&&evidence===0}
 const survival=clamp(Math.round((depth+confidence+substance)/4)+(onTopic?1:-1),0,5);
 const reasons=[];
 if(onTopic)reasons.push("回答涉及教授质疑的「"+topic.label+"」");else reasons.push("没有正面回应「"+topic.label+"」这一问题");
 if(evidence>0)reasons.push("给出了可以验证的方式或证据");else if(inflated>=2)reasons.push("理论词汇很多，但缺乏检验依据");
 if(evasions>=2)reasons.push("成功使用问题反转或概念转移");
 if(style==="evidence")reasons.push("选择了较诚实的实证路线");
 return {depth,confidence,substance,survival,reason:reasons.join("；")+"。"};
}
function critique(){
 const p=pack(),prof=p.professors[state.round%p.professors.length];
 const question=prof.questions[state.round%prof.questions.length];
 state.question=question;
 $("roundLabel").textContent="ROUND "+(state.round+1)+" / 3";
 $("professorLabel").textContent=prof.name;
 $("question").textContent=question.text;
 $("strategies").replaceChildren();
 p.strategies.forEach((s,i)=>{
   const btn=document.createElement("button");btn.className="strategy";btn.type="button";
   const title=document.createElement("strong");title.textContent=s.name;
   const description=document.createElement("span");description.textContent=s.description;
   btn.append(title,description);btn.addEventListener("click",()=>{state.chosen=i;updateChoice()});
   $("strategies").append(btn);
 });
 state.chosen=0;updateChoice();$("customAnswer").value="";
 $("feedbackBlock").hidden=true;$("submitDefense").disabled=false;
 show("defense");
}
function submit(){
 const p=pack(),choice=p.strategies[state.chosen],custom=$("customAnswer").value.trim();
 const answer=custom||choice.answer;
 const grading=evaluate(answer,state.question,custom?"manual":choice.style);
 for(const key of Object.keys(state.scores))state.scores[key]+=grading[key];
 const response=grading.substance>=4?"你居然提供了可检验的回答。委员会对此表示不适。":grading.depth>=4?"这个回答非常复杂。教授不确定是否听懂，因此决定继续讨论。":"评图委员会认为你还有大量概念工作需要完成。";
 $("feedback").textContent=response+"\n\n"+grading.reason+"\n\nYOUR DEFENSE: "+answer;
 $("scoreChange").textContent="CONCEPT +"+grading.depth+"  CONFIDENCE +"+grading.confidence+"  SUBSTANCE "+(grading.substance>=0?"+":"")+grading.substance+"  SURVIVAL +"+grading.survival;
 state.history.push({question:state.question.text,answer,grading});
 $("feedbackBlock").hidden=false;$("submitDefense").disabled=true;
 $("nextRound").textContent=state.round===2?"FINAL VERDICT →":"NEXT CRITIQUE →";
}
function finish(){
 const s=state.scores;
 let title=s.substance>=12?"UNEXPECTEDLY COMPETENT DESIGNER":s.depth+s.confidence>=26?"MASTER OF STRATEGIC AMBIGUITY":s.survival>=7?"CERTIFIED CONCEPT PRODUCER":"UNRESOLVED SPATIAL PROPOSITION";
 $("rank").textContent=title;
 $("ending").textContent="你为「"+state.project+"」完成了三轮答辩。委员会一致认为：你的研究具有进一步展开的潜力，建议下学期继续修改。";
 $("scoreDepth").textContent=s.depth;$("scoreConfidence").textContent=s.confidence;$("scoreSubstance").textContent=s.substance;$("scoreSurvival").textContent=s.survival;
 show("final");
}
function copy(text){
 if(navigator.clipboard&&window.isSecureContext){navigator.clipboard.writeText(text).then(()=>alert("已复制到剪贴板")).catch(()=>prompt("请手动复制：",text))}
 else prompt("请手动复制：",text);
}
$("random").addEventListener("click",()=>{$("project").value=random(pack().projects)});
$("generate").addEventListener("click",()=>{state.project=$("project").value.trim()||random(pack().projects);statement()});
$("regenerate").addEventListener("click",statement);
$("copyStatement").addEventListener("click",()=>copy(state.statement));
$("beginReview").addEventListener("click",()=>{state.round=0;state.history=[];state.scores={depth:0,confidence:0,substance:0,survival:0};critique()});
$("submitDefense").addEventListener("click",submit);
$("nextRound").addEventListener("click",()=>{state.round++;if(state.round>=3)finish();else critique()});
$("restart").addEventListener("click",()=>show("setup"));
$("copyResult").addEventListener("click",()=>{
 const s=state.scores;copy("DEFEND YOUR BULLSHIT / FINAL REVIEW\n"+$("rank").textContent+"\nPROJECT: "+state.project+"\nCONCEPTUAL DEPTH: "+s.depth+"\nACADEMIC CONFIDENCE: "+s.confidence+"\nACTUAL SUBSTANCE: "+s.substance+"\nCRITIQUE SURVIVAL: "+s.survival+"\nhttps://ginagina19992023.github.io/defend-your-bullshit/");
});
addSelects();$("random").click();
})();