/* Deploy on a Workers Free account. GROQ_API_KEY is a server secret, never a static asset.
   Keep the Groq account on Free Plan: this worker does not enroll or upgrade any plan. */
const FREE_MODELS=new Set(['openai/gpt-oss-120b','openai/gpt-oss-20b','qwen/qwen3.8-27b']);
export function createHandler({fetchImpl=fetch,now=()=>Date.now()}={}){
  const visits=new Map();
  return async function handle(request,env={}){
    const allowed=env.ALLOWED_ORIGIN||'https://ginagina19992023.github.io';
    const headers={'Access-Control-Allow-Origin':allowed,'Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Vary':'Origin','Cache-Control':'no-store','Content-Type':'application/json; charset=utf-8'};
    const result=(status,body)=>new Response(JSON.stringify(body),{status,headers});
    if(request.headers.get('Origin')!==allowed)return result(403,{error:'ORIGIN_NOT_ALLOWED'});
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
    if(request.method!=='POST')return result(405,{error:'METHOD_NOT_ALLOWED'});
    if(!env.GROQ_API_KEY)return result(503,{error:'AI_NOT_CONFIGURED'});
    const model=env.GROQ_MODEL||'openai/gpt-oss-120b';
    if(!FREE_MODELS.has(model))return result(503,{error:'UNSUPPORTED_MODEL'});
    // An instance-local guard reduces repeated taps; provider Free Plan limits remain authoritative.
    const ip=request.headers.get('CF-Connecting-IP')||'unknown',minute=Math.floor(now()/60000);
    const previous=visits.get(ip);const count=previous?.minute===minute?previous.count:0;
    if(count>=6)return result(429,{error:'RATE_LIMITED'});
    if(visits.size>10000)visits.clear();visits.set(ip,{minute,count:count+1});
    if(Number(request.headers.get('Content-Length')||0)>60000)return result(413,{error:'PROMPT_TOO_LARGE'});
    let data;try{data=await request.json()}catch(_){return result(400,{error:'INVALID_JSON'})}
    if(typeof data.prompt!=='string'||!data.prompt.trim()||data.prompt.length>12000)return result(400,{error:'INVALID_PROMPT'});
    const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),22000);
    try{
      const upstream=await fetchImpl('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','User-Agent':'academic-mouthpiece/1.0',Authorization:'Bearer '+env.GROQ_API_KEY},body:JSON.stringify({model,messages:[{role:'user',content:data.prompt}],max_completion_tokens:2200,reasoning_effort:'low',temperature:0.9,stream:false}),signal:controller.signal});
      if(!upstream.ok)return result(upstream.status>=400&&upstream.status<600?upstream.status:502,{error:'UPSTREAM_'+upstream.status});
      const body=await upstream.json();const text=body.choices?.[0]?.message?.content;
      if(typeof text!=='string'||!text.trim())return result(502,{error:'EMPTY_COMPLETION'});
      return result(200,{text:text.trim()});
    }catch(error){return result(error.name==='AbortError'?504:502,{error:error.name==='AbortError'?'UPSTREAM_TIMEOUT':'UPSTREAM_UNAVAILABLE'})}finally{clearTimeout(timeout)}
  };
}
const handle=createHandler();export default{fetch:handle};
