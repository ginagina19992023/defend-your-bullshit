/* Long-press voice entry. Audio stays local; speech support is detected honestly. */
(() => {
  function create({canStart,onBegin,onTranscript,onFinish,onStatus}){
    const $=id=>document.getElementById(id);let stream=null,recorder=null,recognition=null,chunks=[],transcript='',timer=null,started=0,epoch=0,url=null,recording=false,finishing=false;
    const Speech=window.SpeechRecognition||window.webkitSpeechRecognition;
    function release(){if(stream)stream.getTracks().forEach(track=>track.stop());stream=null;clearInterval(timer);timer=null;}
    function reset(){epoch++;recording=false;finishing=false;if(recognition){recognition.abort();recognition=null}if(recorder&&recorder.state!=='inactive'){recorder.onstop=null;recorder.stop()}recorder=null;release();$('normalVoiceBar').hidden=true;if(url)URL.revokeObjectURL(url);url=null;$('normalVoiceAudio').hidden=true;$('normalVoiceAudio').removeAttribute('src');}
    async function start(){
      if(recording||finishing||!canStart())return;const id=++epoch;
      if(!navigator.mediaDevices?.getUserMedia){onStatus('当前浏览器无法开启麦克风，请用手机键盘的语音输入。');return}
      onStatus('正在请求麦克风授权…');
      try{
        const acquired=await navigator.mediaDevices.getUserMedia({audio:true});
        if(id!==epoch||!canStart()){acquired.getTracks().forEach(track=>track.stop());return}
        stream=acquired;chunks=[];transcript='';recording=true;finishing=false;
        if(url)URL.revokeObjectURL(url);url=null;$('normalVoiceAudio').hidden=true;
        onBegin();$('normalVoiceBar').hidden=false;started=Date.now();$('normalVoiceTime').textContent='00:00';
        timer=setInterval(()=>{const elapsed=Math.floor((Date.now()-started)/1000);$('normalVoiceTime').textContent=String(Math.floor(elapsed/60)).padStart(2,'0')+':'+String(elapsed%60).padStart(2,'0');if(elapsed>=120)stop(false)},250);
        if(window.MediaRecorder){
          const mime=['audio/mp4','audio/webm'].find(type=>MediaRecorder.isTypeSupported?.(type));recorder=new MediaRecorder(stream,mime?{mimeType:mime}:{});
          recorder.ondataavailable=event=>{if(id===epoch&&event.data?.size)chunks.push(event.data)};
          recorder.onstop=()=>{if(id!==epoch)return;if(chunks.length){const blob=new Blob(chunks,{type:recorder.mimeType||chunks[0].type});url=URL.createObjectURL(blob);$('normalVoiceAudio').src=url;$('normalVoiceAudio').hidden=false}};
          recorder.start();
        }
        if(Speech){
          const speech=new Speech();recognition=speech;speech.lang='zh-CN';speech.continuous=true;speech.interimResults=true;
          speech.onresult=event=>{if(id!==epoch||(!recording&&!finishing))return;transcript=Array.from(event.results).map(result=>result[0].transcript).join('');onTranscript(transcript)};
          speech.onerror=()=>{if(id===epoch)onStatus('识别暂时不可用，录音仍会保存；结束后可用键盘麦克风补充文字。')};
          speech.onend=()=>{if(id!==epoch)return;if(finishing){finishing=false;complete()}else if(recording){onStatus('语音识别已暂停，录音仍在继续。结束后检查转写内容。')}};
          try{speech.start();onStatus('正在录制，点结束后检查转写文字。')}catch(_){recognition=null;onStatus('已开始录音，但这个浏览器无法自动转写。')}
        }else onStatus('已开始录音。这个浏览器不支持自动转写，结束后请用键盘麦克风补充文字。');
      }catch(error){if(id!==epoch)return;const begun=recording;release();recording=false;if(begun)onFinish('',{cancelled:true});$('normalVoiceBar').hidden=true;onStatus(error?.name==='NotAllowedError'?'没有获得麦克风授权，请允许后重试，或使用键盘麦克风。':'未能开启录音，可以直接输入回答。')}
    }
    function complete(){clearTimeout(timer);timer=null;$('normalVoiceBar').hidden=true;onFinish(transcript,{transcribed:!!transcript,supported:!!Speech})}
    function stop(cancelled){
      if(!recording)return;recording=false;release();
      if(recorder&&recorder.state!=='inactive')recorder.stop();
      if(cancelled){epoch++;if(recognition)recognition.abort();recognition=null;finishing=false;$('normalVoiceBar').hidden=true;onFinish('',{cancelled:true});return}
      if(recognition){finishing=true;onStatus('录制结束，正在整理转写文字…');try{recognition.stop()}catch(_){finishing=false;complete()}if(finishing)timer=setTimeout(()=>{if(finishing){finishing=false;recognition?.abort();complete()}},1500)}else complete();
    }
    function bind(button){
      let hold=null,activated=false;button.addEventListener('pointerdown',event=>{if(event.button!==0)return;event.preventDefault();activated=false;hold=setTimeout(()=>{activated=true;start()},350)});
      const clear=()=>{clearTimeout(hold);hold=null};button.addEventListener('pointerup',clear);button.addEventListener('pointercancel',clear);button.addEventListener('pointerleave',clear);button.addEventListener('contextmenu',event=>event.preventDefault());
      button.addEventListener('keydown',event=>{if(event.key===' '||event.key==='Enter'){event.preventDefault();activated=true;start()}});
      button.addEventListener('click',()=>{if(!recording&&!activated)onStatus('长按这个按钮开始录音；说完点击录制条里的结束。');activated=false});
    }
    $('normalVoiceFinish').addEventListener('click',()=>stop(false));$('normalVoiceCancel').addEventListener('click',()=>stop(true));document.addEventListener('visibilitychange',()=>{if(document.hidden&&recording)stop(false)});window.addEventListener('pagehide',reset);
    return {bind,reset};
  }
  window.DYB_NORMAL_VOICE={create};
})();
