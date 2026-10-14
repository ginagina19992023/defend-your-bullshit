/* Authenticated POST transport. No legacy text-in-URL generation. */
(() => {
  class AIError extends Error{constructor(message,code){super(message);this.code=code}}
  function create({fetchImpl=(...args)=>fetch(...args),getConfig=()=>window.DYB_AI_CONFIG||{}}={}){
    async function request(prompt,{signal}={}){
      const config=getConfig();const endpoint=String(config.endpoint||'').trim(),key=String(config.appKey||'').trim();
      if(!endpoint&&!key)throw new AIError('在线 AI 尚未连接，请在可选设置配置授权或服务地址','NOT_CONFIGURED');
      if(!endpoint&&!/^pk_[A-Za-z0-9_-]+$/.test(key))throw new AIError('这里仅接受公开应用 key（pk_）；私密 key 必须放在服务端','INVALID_KEY');
      if(endpoint){let url;try{url=new URL(endpoint)}catch(_){throw new AIError('服务地址不是有效的网址','INVALID_ENDPOINT')}if(url.protocol!=='https:')throw new AIError('在线服务地址必须使用 HTTPS','INVALID_ENDPOINT');if(url.username||url.password||url.search||url.hash)throw new AIError('服务地址不能包含账号、密码或密钥参数','INVALID_ENDPOINT')}
      const url=endpoint||'https://gen.pollinations.ai/v1/chat/completions';
      const headers={'Content-Type':'application/json'};if(!endpoint)headers.Authorization='Bearer '+key;
      const body=endpoint?{prompt,model:config.model||'openai'}:{model:config.model||'openai',messages:[{role:'user',content:prompt}],max_tokens:700,temperature:0.9,stream:false};
      let response;
      for(let attempt=0;attempt<2;attempt++){
        try{response=await fetchImpl(url,{method:'POST',headers,body:JSON.stringify(body),signal,credentials:'omit',redirect:'error',referrerPolicy:'no-referrer'})}catch(error){if(signal?.aborted||error.name==='AbortError')throw error;throw new AIError('在线服务未能连接，可能是网络或跨域访问受限','NETWORK')}
        if(![502,503,504].includes(response.status)||attempt===1)break;
        await response.body?.cancel();
      }
      if(!response.ok){const messages={400:'在线请求或模型参数不受支持',401:'接口授权无效或尚未配置',402:'接口额度不足，需要检查账户额度',403:'当前授权没有模型访问权限',404:'服务地址或模型不存在，请检查在线配置',429:'接口请求过多，请稍后重试',500:'在线服务内部错误',502:'在线服务暂时不可用',503:'在线服务暂时不可用',504:'在线服务响应超时'};throw new AIError(messages[response.status]||'在线接口暂时失败','HTTP_'+response.status)}
      let data;try{data=await response.json()}catch(_){throw new AIError('在线服务返回格式不正确','INVALID_RESPONSE')}
      const text=typeof data.text==='string'?data.text:data.choices?.[0]?.message?.content;
      if(typeof text!=='string'||!text.trim()||text.length>12000||/<html|<!doctype/i.test(text))throw new AIError('在线服务未返回有效文字','INVALID_RESPONSE');
      return text.trim();
    }
    return {request};
  }
  window.DYB_AI_CLIENT={create,AIError};
})();
