/* Reject introduced measurements without requiring verbatim project titles. */
(()=>{
  const digits={'零':0,'〇':0,'一':1,'二':2,'两':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9};
  function number(raw){if(/^\d/.test(raw))return Number(raw);if(raw.includes('点')){const [whole,fraction]=raw.split('点');return number(whole)+Number('0.'+[...fraction].map(c=>digits[c]).join(''))}let total=0,section=0,current=0;for(const c of raw){if(c in digits)current=digits[c];else{const scale={十:10,百:100,千:1000,万:10000}[c];if(!scale)return raw;if(scale===10000){total+=(section+current)*scale;section=0}else section+=(current||1)*scale;current=0}}return total+section+current}
  function measurements(text){return [...String(text||'').matchAll(/(\d+(?:\.\d+)?|[零〇一二两三四五六七八九十百千万]+(?:点[零〇一二三四五六七八九]+)?)(毫米|厘米|千米|公里|米|%|％|分钟|小时|秒|年|度|mm\b|cm\b|km\b|m\b|°)/gi)].map(m=>number(m[1])+':'+({'％':'%',mm:'毫米',cm:'厘米',km:'千米','公里':'千米',m:'米','°':'度'}[m[2].toLowerCase()]||m[2]))}
  function percentages(text){return [...String(text||'').matchAll(/百分之(\d+(?:\.\d+)?|[零〇一二两三四五六七八九十百千万]+(?:点[零〇一二三四五六七八九]+)?)/g)].map(m=>number(m[1])+':%')}
  function valid(text,source){const allowed=new Set([...measurements(source),...percentages(source)]);return [...measurements(text),...percentages(text)].every(value=>allowed.has(value))}
  window.DYB_PROJECT_FACTS={measurements,valid};
})();
