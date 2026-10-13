/* Casual sessions and opt-in career membership are separate from the economy. */
(() => {
  const key = 'dyb-play-v1';
  function create({storage} = {}) {
    let state={version:1,mode:'simple',invitation:'unseen',history:[],sequence:0};
    let persistent=true;
    try { storage=storage||window.localStorage; const saved=JSON.parse(storage.getItem(key)||'null');
      if(saved?.version===1 && ['simple','career'].includes(saved.mode) && Array.isArray(saved.history)) state={...state,...saved};
    } catch (_) { persistent=false; }
    const copy=value=>JSON.parse(JSON.stringify(value));
    function save(){try{storage.setItem(key,JSON.stringify(state))}catch(_){persistent=false}}
    function snapshot(){return {...copy(state),persistent}}
    function record(result){const entry={...copy(result),id:++state.sequence,date:new Date().toISOString()};state.history.unshift(entry);if(state.invitation==='unseen')state.invitation='pending';save();return entry}
    function choose(join){if(state.invitation!=='pending')return false;state.invitation=join?'accepted':'declined';state.mode=join?'career':'simple';save();return true}
    function mode(value){if(value==='career'&&state.invitation!=='accepted')return false;if(!['simple','career'].includes(value))return false;state.mode=value;save();return true}
    return {snapshot,record,choose,mode};
  }
  window.DYB_PLAY={create,key};
})();
