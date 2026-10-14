/* Authored question banks; selection uses discipline, project, critic and recent history. */
(() => {
  'use strict';
  const banks = {
    architecture: {
      experience: `人在这里的第一步会走向哪里？你如何知道？|如果使用者不按你画的动线走，项目还成立吗？|你设计的是观看的图像，还是可以停留的地方？|身体接触材料时，和远处观看有什么不同？|轮椅使用者会经历同样的路径吗？|如果没有人坐下，这张长椅的公共性体现在哪里？|使用者抱怨这里不舒服，你会修改还是坚持？|雨天、夜晚和拥挤时，空间体验会怎样改变？`,
      form: `为什么要旋转这个体块，而不是改变入口位置？|这面墙删掉后，你失去的究竟是结构还是边界？|洞的大小由什么决定？再大一倍会怎样？|这三块石头的排列存在不能互换的理由吗？|亭子不遮阳，你保留屋顶的依据是什么？|模型很好看，构造节点如何实现？|如果结构工程师要求加一根柱子，你的概念会崩溃吗？|把材料换成最便宜的做法，你还剩下什么核心判断？`,
      power: `谁能使用这个空间，谁只能从旁边经过？|谁负责维护你所谓自然生长的部分？|把长椅放到屋顶，是开放公共空间还是提高进入门槛？|你说共享，具体是谁有权拒绝别人的使用？|这条走廊原来的使用者同意你的改造吗？|如果管理者把这里锁起来，项目还有意义吗？|住户要求拆掉作品，你会如何回应？|业主愿意建设，却要求禁止某类人进入，你接不接受？`,
      evidence: `你说改变了停留时间，具体记录了多久？|你的尺度选择来自人体数据还是模型比例？|除了照片，你有什么证据说明空间真的被使用？|如果对照测试显示改造前更好，你会如何解释？|你访问的三个人能代表哪些人，又不能代表谁？|现场观察和你的效果图在哪一点发生冲突？|评委现在要求看一个失败的原型，你能说明它教会了你什么吗？|施工预算削减一半，哪一项验证必须保留？`,
      memory: `场地原来的痕迹具体改变了哪个设计决定？|这面旧墙是历史证据，还是你喜欢的纹理？|地方居民讲的历史和档案不同，你相信哪一种？|拆掉原有建筑后，你如何谈保留记忆？|你说临时，具体多久之后会被拆除？|材料老化后，空间会更接近还是远离你的设想？|十年后没人记得你的概念，项目还能被理解吗？|一位居民指出你引用的故事不属于这里，你会如何修正？`
    },
    art: {
      experience: `观众进入展厅后，第一件可以做的事是什么？|观众不读策展文字，作品还能发生吗？|观看、触摸和参与，哪一种行为不可被替代？|观众拒绝互动时，作品把他放在什么位置？|你期待观众感动，但他们只想拍照，你如何回应？|同一位观众第二次来，会经历什么不同？|一位观众完全误读作品，这算失败还是作品的一部分？|观众中途离场，你能指出他错过了什么吗？`,
      form: `为什么必须是影像，而不是一段文字？|空相框与尚未布完的展览，区别在哪里？|你的材料是在表达，还是替概念制造气氛？|把作品缩小成桌面大小，核心关系还成立吗？|装置的摆放由观看路径还是展厅尺寸决定？|这段循环影像为什么不能提前结束？|策展人要求换一个展厅，你必须保留什么？|如果声光设备全部失效，这件作品还存在吗？`,
      power: `参与者是否知道自己的行为会被作为作品展示？|观众是在参与创作，还是替你完成无偿劳动？|谁有权撤回一段已经进入作品的私人故事？|这件作品在批判谁，而被批判的人能回应吗？|门票、地点和开放时间排除了哪些观众？|社区提供了材料，署名却只有你，这合理吗？|赞助方要求删去最尖锐的一段，你怎么选？|被拍摄者当场反对展出，你准备如何处理？`,
      evidence: `你如何区分观众反馈和你希望听到的赞美？|你说改变了认知，有什么可观察的迹象？|过程档案证明了什么，而不只是证明你办过活动？|哪一次试展真正改变了你的作品？|有没有一个反例让你怀疑自己的解释？|你引用的研究，支持的是作品的哪一个判断？|评委只允许你展示一份过程材料，你选什么？|如果访谈结果与你的立场相反，你会把它放进展览吗？`,
      memory: `撤展以后，作品留下的是物、档案还是关系？|私人记忆被放进公共展厅，会发生什么改变？|你在替谁保存故事，又替谁删掉细节？|档案中的缺失，是研究限制还是你的创作选择？|作品需要重复展出，还是只能发生一次？|旧照片离开原来的语境后，你如何避免消费他人的怀旧？|故事的讲述者要求修改档案，你如何回应？|十年后只剩一张展览照片，作品会被怎样误读？`
    },
    startup: {
      experience: `第一位用户为什么要今天开始用，而不是继续用表格？|用户第一次打开产品，需要完成多少步？|你解决的是用户自己的问题，还是你替他定义的问题？|用户关闭通知后，产品还会提供价值吗？|不熟悉技术的人会卡在哪一步？|用户第二天回来，是因为需要还是因为奖励？|用户只使用了你最不重视的功能，你会如何调整？|一位真实用户说这个需求根本不存在，你会怎么验证？`,
      form: `为什么必须做一个平台，而不是一种服务？|这个功能与一个普通表格有什么不可替代的区别？|界面上的这个按钮为什么必须存在？|你用复杂流程解决问题，还是重新制造了问题？|去掉 AI 以后，产品还剩什么价值？|自动化在哪一步应该交还人的判断？|开发周期只剩一周，哪一个功能可以证明核心价值？|竞争对手明天免费提供同样功能，你靠什么继续？`,
      power: `你节省的时间，是不是转成了别人的无偿劳动？|谁承担算法判断错误的后果？|用户能拒绝授权，而不被排除在基本服务之外吗？|平台、商家和用户发生冲突时，你优先保护谁？|你所谓的增长，是否依赖让用户更难退出？|数据是谁创造的，收益又归谁？|投资人要求提高抽成，你如何向最脆弱的用户解释？|如果用户集体要求导出数据离开，你会提供什么？`,
      evidence: `你说需求很强，访谈中有多少人愿意实际付钱？|留存是按哪一个行为计算的？|有没有做过不使用这个功能的对照测试？|增长来自产品价值，还是一次广告投放？|样本里是否只有你的朋友和同行？|你如何区分用户满意和用户暂时无法替换？|下个月只能验证一个假设，你优先验证什么？|如果最重要的指标连续下降，你承认哪一个判断错了？`,
      memory: `上一个版本失败的原因，在这次路演中哪里体现了？|你保留了旧用户的哪些习惯，又打断了哪些？|团队过去的经验是否正在限制你理解新用户？|早期承诺与现在的商业模式冲突，你如何解释？|数据迁移会丢掉用户积累的哪些内容？|如果公司停止运营，用户已经投入的时间如何被保护？|老用户指责你背弃最初的承诺，你如何回应？|三年以后，这个产品应该留下什么，而不仅是一组增长曲线？`
    }
  };
  const followUps = {
    experience:`你能描述一个具体的人在具体时刻会做什么吗？|如果参与者完全不按预期行动，你会改变什么？|你把自己的体验当作所有人的体验了吗？|这个变化是你观察到的，还是你设想出来的？|有人不愿参与时，你的判断还能成立吗？|如果只能保留一次真实体验，你选哪一次？`,
    form:`你最不能放弃的那个决定是什么，为什么？|换一种做法能达到同样结果吗？|请解释形式与功能之间的具体联系。|你是在为一个必要决定辩护，还是为已经做完的结果找理由？|如果删掉最显眼的部分，概念还存在吗？|请用一个具体关系解释，不要再引入新的术语。`,
    power:`你的选择具体让谁获得了决定权？|谁承担这个决定的代价？|如果被排除的人就在现场，你会怎样回应？|谁有权改变你设定的规则？|你能指出一个利益冲突，而不是只说大家都受益吗？|假如权力关系没有改变，你还会把这称作进步吗？`,
    evidence:`哪一条证据直接支持你刚才的判断？|有什么结果出现时，你会承认自己错了？|你如何区分观察事实和对事实的解释？|如果明天就要验证，你会先测什么？|有没有一份与你的说法相反的反馈？|你愿意用什么具体结果承担这个结论？`,
    memory:`时间具体改变了你的哪个决定？|你保留的是事情本身，还是对事情的某一种讲法？|谁的记忆还没有被放进讨论？|如果这段过去并不存在，你的结论会变吗？|项目结束后，什么值得继续保留？|现在的使用者能重新解释你保留的痕迹吗？`
  };
  const entries=[];
  for(const [pack,topics] of Object.entries(banks))for(const [topic,text] of Object.entries(topics))text.split('|').forEach((text,i)=>entries.push({id:`${pack}-${topic}-${i}`,pack,topic,text,dramatic:i>=6}));
  for(const [topic,text] of Object.entries(followUps))text.split('|').forEach((text,i)=>entries.push({id:`followup-${topic}-${i}`,pack:'any',topic,text,followup:true,dramatic:i>=4}));
  const clusters=[['椅','坐','停留'],['洞','墙','边界','入口'],['石头','材料','排列'],['屋顶','亭','遮阳'],['旋转','体块','形式'],['走廊','路径','动线'],['记忆','历史','旧','档案'],['影像','照片','观看'],['参与','观众','互动'],['数据','用户','授权'],['增长','留存','指标'],['AI','自动化','判断']];
  function create({storage,random=()=>Math.random()}={}){
    let recent=[];const used=new Set();let usedTopics=[];
    try{storage=storage||window.localStorage;const saved=JSON.parse(storage.getItem('dyb-questions-v1')||'[]');if(Array.isArray(saved))recent=saved.filter(id=>typeof id==='string').slice(-60)}catch(_){}
    function reset(){used.clear();usedTopics=[]}
    function pick({pack,project='',topic='form',round=0,answer='',stage='normal',forceTopic=false,scores={}}){
      let pool=entries.filter(e=>(e.pack===pack||(stage==='battle'&&e.pack==='any'))&&(!(stage==='battle'||forceTopic)||e.topic===topic)&&!used.has(e.id));
      const fresh=pool.filter(e=>!recent.includes(e.id));if(fresh.length)pool=fresh;
      if(!pool.length)pool=entries.filter(e=>e.pack===pack);
      const context=project+' '+answer;
      const weighted=pool.map(e=>{
        let weight=e.topic===topic?5:1;
        if(stage==='normal'&&usedTopics.includes(e.topic))weight*=0.3;
        for(const cluster of clusters)if(cluster.some(term=>context.includes(term))&&cluster.some(term=>e.text.includes(term)))weight+=6;
        if(e.dramatic&&(round>=1||(scores.discomfort||0)>=8))weight+=3;
        if(e.followup&&answer)weight+=4;
        return {entry:e,weight};
      });
      let roll=random()*weighted.reduce((n,e)=>n+e.weight,0);let chosen=weighted[weighted.length-1].entry;
      for(const item of weighted){roll-=item.weight;if(roll<0){chosen=item.entry;break}}
      used.add(chosen.id);usedTopics.push(chosen.topic);recent.push(chosen.id);recent=recent.slice(-60);
      try{storage.setItem('dyb-questions-v1',JSON.stringify(recent))}catch(_){}
      return {...chosen};
    }
    return {pick,reset};
  }
  window.DYB_QUESTIONS={create,entries};
})();
