/* Copy belongs to the selected discipline, not to a global architecture template. */
(() => {
  const profiles={
    architecture:{name:'建筑评图',object:'建筑方案',practice:'空间实践',people:'使用者',method:'比较改动前后的路径、尺度和使用方式',material:'材料与构造',removal:'建筑本身'},
    art:{name:'艺术讲评',object:'艺术作品',practice:'艺术实践',people:'观众',method:'比较呈现方式改变前后的观看、停留和解读',material:'媒介与呈现方式',removal:'作品与观看的关系'},
    startup:{name:'产品设计评审',object:'产品方案',practice:'产品实验',people:'用户',method:'比较不同功能和操作流程下的任务完成情况',material:'功能与操作流程',removal:'这个功能存在的必要性'}
  };
  const profile=id=>profiles[id]||profiles.architecture;
  function feedback(id,tag,index,project){
    const p=profile(id),subject='「'+project+'」';
    const lines={
      tooEmpirical:[`你终于为${subject}提出了可检查的判断。评委有点不习惯：${p.object}竟然准备接受现实的检验。`,`你为${subject}提供了证据。评委追问这些结果能否支持概念；听到不能后，又要求你暂时不要修改概念。`],
      tooConceptual:[`概念已经把${subject}包围了。评委现在想看${p.object}本身，而不是再看一层术语保护膜。`,`${subject}的依据仍有缺口。委员会先将缺口命名为张力，随后要求你证明这份张力不是缺口。`],
      tooHonest:[`你承认${subject}还不能证明自己的判断。评委决定把这种不确定叫作激进反思，但仍在等一个具体的验证办法。`,`你承认${subject}尚未成立。教授认为这种诚实值得肯定，但建议下次不要在评图时使用。`],
      tooAmbitious:[`你试图让${subject}同时解释太多事情。评委建议先把${p.material}中的一个决定说清，世界可以下周再拯救。`,`${subject}的论证野心已经超过当前材料。奇怪的是，这让它更像研究，也更像一份尚未完成的申请。`],
      eraseDesign:[`你把删减本身作为${subject}的论证。评委怀疑你真的开始质疑${p.removal}，并对此产生神秘赞许。`,`当${subject}最显眼的部分被取消，剩下的${p.material}反而需要解释。教授短暂沉默：少了一点，不代表自动多了一层意义。`],
      evasive:[`你没有说清${subject}的核心决定，却成功移动了问题的位置。评委暂时无法证明这是错误的。`,`这个回答绕开了${subject}的具体限制，又制造了一个更大的问题。评委想请你先返回原题。`],
      balanced:[`你把${subject}的概念与${p.material}连了起来。评委若有所思：这个项目可能真的有点意思，但下一步必须让${p.people}的实际反馈参与判断。`,`${subject}既没有彻底悬空，也没有被一句“有用”结束讨论。评委已经找到一个可以继续追问的具体关系。`],
      weak:[`评委要求你把${subject}讲得更清楚，同时提醒你：如果讲得太清楚，它可能只剩下普通的${p.object}。`,`目前的回答还不足以说明${p.people}会如何面对${subject}。项目已经有标题，论证还需要一个入口。`]
    };
    const list=lines[tag]||lines.weak;return list[index%list.length];
  }
  function reasons(id,project){const p=profile(id);return [
    `教授想起自己曾被否定的同类${p.practice}，决定给这次论证一点同情分。`,
    `评委把「${project}」尚未解释的限制理解为一种刻意保留的矛盾。`,
    `一位教授听见了自己喜欢的词，于是暂时不追问它是什么意思。`,
    `你的停顿被理解为对${p.object}边界的审慎判断。`,
    `教授觉得「${project}」适合成为一个讨论案例，所以愿意再听一句。`,
    `教授把${p.material}中的一个漏洞理解为制度性空缺，并要求你保留它。`
  ]}
  function statement(id,project,[a,b,c],variant){const p=profile(id);const scripts=[
    [`「${project}」不只是一个待验收的${p.object}，而是一项围绕「${a}」展开的${p.practice}。我们先把题目中的决定放回${p.people}实际面对它的条件中，再讨论概念。`,
      `方法上，我们计划${p.method}，记录${p.people}的反馈，再用「${b}」组织这些差异。现在提出的是观察办法，而不是已经获得的结果。`,
      `「${c}」不是替${p.object}免除责任的术语。它需要解释${p.material}的哪一个选择被改变，以及这个改变让谁获得或失去什么。`,
      `项目的完成不是解释的终点。我们希望让${p.people}对${p.object}的不同判断，成为下一次修改的条件。`],
    [`与其宣布「${project}」已经成立，我们愿意先问：它为什么值得借「${a}」被重新讨论？${p.object}不能只靠标题保证意义。`,
      `我们从${p.people}实际面对${p.material}的一次具体行动开始，计划${p.method}，让「${b}」留下可以检查的线索。`,
      `如果${p.people}的反馈与设想相反，「${c}」也必须接受修改。概念可以解释差异，不能取消差异。`,
      `这不是一份拒绝批评的声明，而是一项保留了失败条件的${p.practice}。项目可以继续，结论暂时不急着毕业。`],
    [`「${project}」把一个熟悉的判断推向了不熟悉的条件。我们用「${a}」解释这种改变，而不是替荒谬找一个听起来正常的别名。`,
      `具体来说，我们计划${p.method}，把${p.people}的不同反馈放在一起讨论。「${b}」必须能解释这个具体比较。`,
      `对${p.material}的每一次修改，都可能让「${c}」的前提失效。因此${p.object}需要允许误读、拒绝和反例。`,
      `我们希望保留的不是唯一正确的解释，而是一个能让${p.people}继续提出问题的${p.object}。`]
  ];return scripts[variant%scripts.length]}
  function drafts(id,{project,question,strategy}){
    if(id==='architecture'||!profiles[id])return null;
    const p=profile(id),title='「'+project+'」',q='「'+question.slice(0,70)+'」';
    const art=id==='art';
    const motif=art?(/播放|声音|致辞/.test(project)?'重复与声音的关系':/相框|标签/.test(project)?'被呈现的边界与缺席的内容':/纸箱|藏/.test(project)?'可见与被遮蔽的条件':'作品的呈现与观看关系'):'功能、操作和用户判断之间的关系';
    const scripts={
      jargon:[`对${title}，我想从${art?'观众如何察觉'+motif:'用户如何理解并实际操作这个方案'}开始。您问${q}，我会先观察${p.people}在哪一步停下、继续或拒绝，再讨论体验为什么改变。现象学不是让${p.people}负责感动，是让解释先对一次具体行动负责。`, `在${title}里，${motif}不能只由我的说明决定。我希望${p.method}，看${p.people}的判断是否真的发生变化，再回应${q}。如果没有差异，至少理论终于遇到一个不肯配合它的对象。`],
      deflect:[`对${title}和${q}，还需要问是谁制定了评价${p.object}的标准。我会先回应${p.material}的一个具体限制，再让被这些标准忽略的${p.people}给出反馈。不是每一次反问都叫批判，至少这一次要能指出规则改变了谁的处境。`,`关于${title}，我不想用更大的概念把${q}盖住。我想比较两种评价方式，看它们各自遗漏了什么。${p.people}并不欠我们一个正确反应，评审标准也不应该提前替他们反应。`],
      evidence:[`对于${title}和${q}，我会先${p.method}，记录${p.people}的反馈，也保留不符合设想的结果。${art?'一次小规模试展':'一次最小可用原型测试'}可以帮助我们判断，但现在我没有已经验证成功的数据。证据不负责让项目体面，证据负责让结论来得晚一点。`,`针对${title}，我会把${q}转成一个可以失败的假设：${p.people}出现什么行为，才支持这个决定？先做${art?'呈现条件的对照':'流程和功能的对照'}，再讨论反馈。我们暂时不把掌声或口头喜欢算作验证。`],
      honest:[`我承认${title}现在还不能完全回答${q}。关于${motif}，我能说明的是当前的选择，不能替${p.people}提前宣布结果。我会通过${art?'试展与观看反馈':'原型与用户反馈'}缩小这个不确定性。诚实不是撤回${p.object}，只是暂时撤回它自动成立的许可证。`,`对${title}，我目前没有一个让${q}立即闭嘴的答案。我可以明确${p.material}中的一个限制，再${p.method}。下一次汇报要带回修改依据，不能只带回更熟练的“不确定”。`],
      erase:[`如果删减${title}中最显眼的那一步，我们应该比较${motif}还剩下什么，再回应${q}。${art?'取消一层呈现，不等于取消观众的观看':'删除一个功能，不等于删除用户原来的需求'}。我会比较删减前后的反馈；东西变少可以是判断，不能自动算成思想变多。`,`我想先从${title}里拿掉那个最急于解释自己的部分，再看${p.people}如何面对剩下的${p.material}。${q}需要这个比较，而不是一句“留白”。如果剩下的关系站不住，删减也得接受批评，不能享受免答待遇。`],
      balanced:[`对${title}，我先回应${q}中的具体限制，再讨论${motif}。下一步计划${p.method}，记录${p.people}的不同反馈。概念可以给${p.object}一个方向，但验证应该保留让它转弯的权利。`,`关于${title}，我不想只在概念与证据之间各放一句话。我们需要说明${p.material}的一个选择如何影响${p.people}，再用对照回应${q}。${p.object}可以荒谬，判断它的方法至少得知道自己在检查什么。`]
    };return scripts[strategy.style]||scripts.balanced;
  }
  const forbidden=id=>id==='art'?/建筑本身|结构承载力|构造节点|住户|建筑评图教授/:id==='startup'?/建筑本身|构造节点|场地历史|展厅|试展|撤展|策展/:null;
  function valid(text,id){const pattern=forbidden(id);return !pattern||!pattern.test(text)}
  window.DYB_DISCIPLINE_LANGUAGE={profiles,profile,feedback,reasons,statement,drafts,valid};
})();
