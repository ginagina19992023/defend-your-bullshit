/* Immediate review-room reaction; closing always cancels animation work. */
(() => {
  function create(){
    const $=id=>document.getElementById(id);let timer=null,transition=null,callback=null,detailsCallback=null,full='';
    const paint=text=>{
      const root=$('reactionText');root.replaceChildren();
      const first=full.indexOf('\n');
      const second=full.indexOf('\n',first+1);
      const cut=full.slice(first+1).startsWith('你说「')&&second>=0?second+1:first+1;
      const context=document.createElement('span');context.className='reaction-context';context.textContent=text.slice(0,cut);root.append(context);
      const verdict=document.createElement('span');verdict.className='reaction-verdict';
      const content=text.slice(cut);const pattern=/(神秘赞许|神秘的赞许|无法反驳|激进反思|不稳定的伦理位置|委员会不安|质疑建筑本身|作品与观看的关系|功能存在的必要性|同情分|概念过载|令人担忧|真的有点意思)/g;
      let last=0;for(const match of content.matchAll(pattern)){verdict.append(document.createTextNode(content.slice(last,match.index)));const mark=document.createElement('em');mark.textContent=match[0];verdict.append(mark);last=match.index+match[0].length}verdict.append(document.createTextNode(content.slice(last)));root.append(verdict);
    };
    const stop=()=>{clearInterval(timer);clearTimeout(transition);timer=transition=null};
    function finish(details=false){stop();paint(full);const next=details?detailsCallback:callback;callback=detailsCallback=null;$('reactionDialog').close();if(next)next()}
    function thinking({from,name}){stop();callback=detailsCallback=null;$('reactionDetails').disabled=true;$('reactionFace').textContent=from;$('reactionName').textContent=name;$('reactionText').textContent='评委正在回想你刚才的论证……';$('reactionContinue').disabled=true;if(!$('reactionDialog').open)$('reactionDialog').showModal()}
    function resolve({to,text,onContinue,onDetails,continueLabel="进入下一问"}){
      full=text;callback=onContinue||null;detailsCallback=onDetails||null;$('reactionDetails').disabled=false;$('reactionContinue').textContent=continueLabel;$('reactionContinue').disabled=false;
      transition=setTimeout(()=>{$('reactionFace').classList.add('reaction-change');$('reactionFace').textContent=to},300);
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      $('reactionText').textContent='';let count=0;
      if(reduced)paint(text);
      else timer=setInterval(()=>{count+=2;paint(text.slice(0,count));if(count>=text.length){clearInterval(timer);timer=null}},24);
      $('reactionAccessible').textContent=text;
    }
    $('reactionContinue').addEventListener('click',()=>finish(false));
    $('reactionDetails').addEventListener('click',()=>finish(true));
    $('reactionDialog').addEventListener('cancel',event=>{event.preventDefault();if(!$('reactionContinue').disabled)finish(true)});
    $('reactionDialog').addEventListener('close',()=>{$('reactionFace').classList.remove('reaction-change');stop()});
    return {thinking,resolve};
  }
  window.DYB_REACTION={create};
})();
