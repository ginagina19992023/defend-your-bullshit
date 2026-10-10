/* Community content pack contract v1. Add new objects to window.DYB_PACKS.
   Each pack needs: id, name, projects, topics (id,label,keywords,question),
   vocabulary, professors (name, questions:[{text,topic,focus}]),
   strategies:[{name,description,answer,style}].
   topic and style are used by game.js for scoring. No executable user pack code.
*/
window.DYB_PACKS = {
 architecture:{
  id:"architecture",name:"Architecture / 建筑学院",
  projects:["把三块石头堆起来","在墙上开了一个洞","把两个白色盒子旋转十五度","在走廊里挂一块半透明的布","把模型里的一面墙删掉","在空地上画一个圆圈","搭了一个不提供遮阳的亭子","把一张长桌放在楼梯平台"],
  topics:[
   {id:"experience",label:"身体与感知",keywords:["身体","体验","感知","观看","触觉","行动","观察","人在","使用者"],question:"参与者究竟经历了什么？"},
   {id:"form",label:"形式与构成",keywords:["形式","形态","轮廓","尺度","结构","比例","几何","体块","材料"],question:"为什么必须是这种形式？"},
   {id:"power",label:"权力与公共性",keywords:["权力","公众","公共","公平","使用权","参与","劳动","社会","阶级"],question:"谁被包含，又是谁被排除？"},
   {id:"evidence",label:"证据与验证",keywords:["测试","数据","观察","访谈","反馈","对照","验证","原型","实验","记录"],question:"你将如何证明这个观点？"},
   {id:"memory",label:"记忆与时间",keywords:["记忆","历史","时间","过去","遗产","痕迹","地方","身份"],question:"它与场地历史发生了什么关联？"}
  ],
  vocabulary:["物质性","边界的消解","具身经验","多义性的张力","开放性的空间生产","存在的阈限","主体与客体的重组","集体记忆","非线性过程","感知的再语境化"],
  professors:[
   {name:"PROF. PHENOMENOLOGY",questions:[{text:"你不断提到身体，但这里的身体究竟是谁的身体？",topic:"experience",focus:"具体使用者"},{text:"假如无人观看，这个作品还有所谓的空间意义吗？",topic:"experience",focus:"感知条件"},{text:"你说的体验具体发生在什么时候、由什么触发？",topic:"evidence",focus:"可观察的行为"}]},
   {name:"PROF. FORMAL PURITY",questions:[{text:"为什么是这种形状？如果去掉一半，甚至全部去掉，会怎样？",topic:"form",focus:"形式的必要性"},{text:"你的构成是否只是一个精致的图解，而非建筑？",topic:"form",focus:"形式与使用"},{text:"你怎么证明这个尺寸不是随意决定的？",topic:"evidence",focus:"尺度依据"}]},
   {name:"PROF. CRITICAL THEORY",questions:[{text:"究竟是谁拥有定义这个空间意义的权力？",topic:"power",focus:"解释权"},{text:"你没有提到是谁完成了实际的劳动。这种消失是否恰恰是项目的问题？",topic:"power",focus:"隐形劳动"},{text:"项目声称具有公共性，那么不能参与的人在哪里？",topic:"power",focus:"排除机制"}]}
  ],
  strategies:[
   {name:"现象学烟幕弹",description:"引用主体、感知与阈限",answer:"我们真正关注的不是物体，而是观看者在身体感知中不断生成的空间关系。",style:"jargon"},
   {name:"问题反转术",description:"把质疑转化为另一个问题",answer:"比起回答为什么如此，我们更想追问：是谁规定了这个问题必须以这种方式被回答？",style:"deflect"},
   {name:"概念免疫术",description:"任何缺点都是被有意保留的矛盾",answer:"这种看似未完成的关系其实是刻意保留的，它让项目始终处于不断协商的开放状态。",style:"deflect"},
   {name:"拿出真正的证据",description:"引用材料、观察和参与者反馈",answer:"我们会通过原型测试，记录不同人在现场的行动路径，并比较改动前后的使用情况。",style:"evidence"}
  ]
 }
};