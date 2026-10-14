/* Immediate review-room reaction; closing always cancels animation work. */
(() => {
  function create(){
    const $=id=>document.getElementById(id);let timer=null,transition=null,callback=null,full='';
    const stop=()=>{clearInterval(timer);clearTimeout(transition);timer=transition=null};
    function finish(){stop();$('reactionText').textContent=full;const next=callback;callback=null;$('reactionDialog').close();if(next)next()}
    function thinking({from,name}){stop();callback=null;$('reactionFace').textContent=from;$('reactionName').textContent=name;$('reactionText').textContent='评委正在回想你刚才的论证……';$('reactionContinue').disabled=true;if(!$('reactionDialog').open)$('reactionDialog').showModal()}
    function resolve({to,text,onContinue}){
      full=text;callback=onContinue||null;$('reactionContinue').disabled=false;
      transition=setTimeout(()=>{$('reactionFace').classList.add('reaction-change');$('reactionFace').textContent=to},300);
      const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      $('reactionText').textContent='';let count=0;
      if(reduced)$('reactionText').textContent=text;
      else timer=setInterval(()=>{count+=2;$('reactionText').textContent=text.slice(0,count);if(count>=text.length){clearInterval(timer);timer=null}},24);
      $('reactionAccessible').textContent=text;
    }
    $('reactionContinue').addEventListener('click',finish);
    $('reactionDialog').addEventListener('cancel',event=>{event.preventDefault();if(!$('reactionContinue').disabled)finish()});
    $('reactionDialog').addEventListener('close',()=>{$('reactionFace').classList.remove('reaction-change');stop()});
    return {thinking,resolve};
  }
  window.DYB_REACTION={create};
})();
