/* Community content pack contract v2.
   Add new objects to window.DYB_PACKS. Packs are data only:
   id, name, projects, topics, vocabulary, professors, strategies.
   No executable user pack code. Keep fictional names and avoid real institutions.
*/
window.DYB_PACKS = {
  architecture: {
    id: "architecture",
    name: "Architecture Pack / 建筑包体",
    projects: [
      "把三块石头堆起来",
      "在墙上开了一个洞",
      "把两个白色盒子旋转十五度",
      "在走廊里挂一块半透明的布",
      "把模型里的一面墙删掉",
      "在空地上画一个圆圈",
      "搭了一个不提供遮阳的亭子",
      "把一张长桌放在楼梯平台",
      "设计一个永远不会被打开的入口",
      "把所有动线都导向一个没有事件的房间"
    ],
    topics: [
      { id: "experience", label: "身体与感知", keywords: ["身体", "体验", "感知", "观看", "触觉", "行动", "观察", "人在", "使用者", "路径", "停留"], question: "参与者究竟经历了什么？" },
      { id: "form", label: "形式与构成", keywords: ["形式", "形态", "轮廓", "尺度", "结构", "比例", "几何", "体块", "材料", "边界", "构成"], question: "为什么必须是这种形式？" },
      { id: "power", label: "权力与公共性", keywords: ["权力", "公众", "公共", "公平", "使用权", "参与", "劳动", "社会", "阶级", "排除", "包含"], question: "谁被包含，又是谁被排除？" },
      { id: "evidence", label: "证据与验证", keywords: ["测试", "数据", "观察", "访谈", "反馈", "对照", "验证", "原型", "实验", "记录", "测量", "样本"], question: "你将如何证明这个观点？" },
      { id: "memory", label: "记忆与时间", keywords: ["记忆", "历史", "时间", "过去", "遗产", "痕迹", "地方", "身份", "保留", "延续"], question: "它与场地历史发生了什么关联？" }
    ],
    vocabulary: [
      "物质性",
      "边界的消解",
      "具身经验",
      "多义性的张力",
      "开放性的空间生产",
      "存在的阈限",
      "主体与客体的重组",
      "集体记忆",
      "非线性过程",
      "感知的再语境化",
      "制度性的空缺",
      "被延迟的公共性"
    ],
    professors: [
      {
        name: "PROF. PHENOMENOLOGY",
        moodBias: "experience",
        questions: [
          { text: "你不断提到身体，但这里的身体究竟是谁的身体？", topic: "experience", focus: "具体使用者" },
          { text: "假如无人观看，这个作品还有所谓的空间意义吗？", topic: "experience", focus: "感知条件" },
          { text: "你说的体验具体发生在什么时候、由什么触发？", topic: "evidence", focus: "可观察行为" }
        ]
      },
      {
        name: "PROF. FORMAL PURITY",
        moodBias: "form",
        questions: [
          { text: "为什么是这种形状？如果去掉一半，甚至全部去掉，会怎样？", topic: "form", focus: "形式必要性" },
          { text: "你的构成是否只是一个精致的图解，而非建筑？", topic: "form", focus: "形式与使用" },
          { text: "你怎么证明这个尺寸不是随意决定的？", topic: "evidence", focus: "尺度依据" }
        ]
      },
      {
        name: "PROF. CRITICAL THEORY",
        moodBias: "power",
        questions: [
          { text: "究竟是谁拥有定义这个空间意义的权力？", topic: "power", focus: "解释权" },
          { text: "你没有提到是谁完成了实际的劳动。这种消失是否恰恰是项目的问题？", topic: "power", focus: "隐形劳动" },
          { text: "项目声称具有公共性，那么不能参与的人在哪里？", topic: "power", focus: "排除机制" }
        ]
      }
    ],
    strategies: [
      {
        name: "现象学烟幕弹",
        description: "引用主体、感知与阈限，适合提升概念深度。",
        answer: "我们真正关注的不是物体，而是观看者在身体感知中不断生成的空间关系。这个关系既发生在观看路径中，也发生在使用者对边界的触觉判断里。",
        style: "jargon"
      },
      {
        name: "问题反转术",
        description: "把质疑转化为另一个问题，适合提高自信并制造轻微不适。",
        answer: "比起回答为什么如此，我们更想追问：是谁规定了这个问题必须以这种方式被回答？这个形式的意义正在于暴露提问本身的权力结构。",
        style: "deflect"
      },
      {
        name: "概念免疫术",
        description: "任何缺点都是被有意保留的矛盾。",
        answer: "这种看似未完成的关系其实是刻意保留的，它让项目始终处于不断协商的开放状态。未完成不是缺陷，而是空间被持续生产的证据。",
        style: "deflect"
      },
      {
        name: "拿出真正的证据",
        description: "引用材料、观察和参与者反馈，但会让委员会怀疑你太实证。",
        answer: "我们会通过原型测试，记录不同人在现场的行动路径，测量停留时间，并比较改动前后的使用反馈。",
        style: "evidence"
      },
      {
        name: "承认自己也不确定",
        description: "诚实到危险，可能被解读为激进自我反思。",
        answer: "我现在不能完全证明它成立。也许这个项目最重要的部分，正是它暴露了我无法把形式、经验和公共性稳定缝合起来的失败。",
        style: "honest"
      },
      {
        name: "删除设计本身",
        description: "把缺席说成方法，适合触发神秘赞许。",
        answer: "如果去掉它，项目反而更清楚：剩下的空缺迫使使用者意识到自己一直期待建筑替他们完成意义。删除不是退缩，而是把决定权还给现场。",
        style: "erase"
      }
    ]
  }
};


window.DYB_PACKS.architecture.strategies.push({
  name: "替客户讲清楚", description: "概念与证据一起讲，给评委一个可以验证的下一步。",
  answer: "这不是单纯的形式操作，而是通过材料、公众与使用者的路径建立具身经验。我们记录三位使用者的反馈，对比原型测试前后的停留时间。", style: "balanced"
});
window.DYB_PACKS.art = {
  id: "art", name: "Art Pack / 当代艺术", practice: "艺术实践",
  projects: ["在展厅放一个空相框", "把开幕致辞循环播放八小时", "让观众给一块石头写评价", "展出所有没有入选的作品标签", "把作品藏在撤展后的纸箱里"],
  vocabulary: ["观看的政治", "主体性的悬置", "档案的缝隙", "参与式关系", "物质性", "制度性的空缺", "可见性", "作者的退场", "感知的再语境化", "多义性的张力"],
  topics: [
    { id: "experience", label: "观众与体验", keywords: ["观众", "观看", "参与", "感知", "体验", "身体", "停留", "使用者"], question: "观众实际经历了什么？" },
    { id: "form", label: "媒介与形式", keywords: ["媒介", "形式", "材料", "声音", "图像", "装置", "边界", "尺度"], question: "为什么选择这个媒介？" },
    { id: "power", label: "机构与公共性", keywords: ["机构", "公众", "公共", "权力", "作者", "劳动", "参与", "排除"], question: "谁被允许进入这件作品？" },
    { id: "evidence", label: "过程与证据", keywords: ["记录", "测试", "访谈", "观察", "反馈", "对照", "验证", "原型", "实验", "数据"], question: "作品产生的变化在哪里？" },
    { id: "memory", label: "档案与时间", keywords: ["档案", "时间", "历史", "记忆", "过去", "保留", "痕迹", "撤展"], question: "撤展后留下什么？" }
  ],
  professors: [
    { name: "CURATOR OF ABSENCE", moodBias: "form", questions: [{ text: "作品不在场，为什么还需要占用展厅？", topic: "form" }, { text: "空相框和一个没布完的展有什么区别？", topic: "evidence" }] },
    { name: "PARTICIPATION CRITIC", moodBias: "experience", questions: [{ text: "观众是在参与，还是在替你完成劳动？", topic: "power" }, { text: "不想参与的人还算观众吗？", topic: "experience" }] },
    { name: "ARCHIVE INSPECTOR", moodBias: "memory", questions: [{ text: "你留下的档案能证明什么，而不只是证明你举办过展览？", topic: "evidence" }, { text: "撤展之后，这个过程会进入谁的记忆？", topic: "memory" }] }
  ],
  strategies: [
    { name: "让过程成为作品", description: "回应观众行为，同时保留概念。", answer: "这不是单纯的形式展示，而是让公众与观众参与材料和观看的政治。我们记录观看路径与停留时间，对照原型测试和观众反馈，保留一个可观察的过程。", style: "balanced" },
    { name: "作者退场", description: "把作品的缺席解释为方法。", answer: "我们删除作者的解释，把空缺和缺席交给公众。作者的退场并不是失败，而是主体性的悬置与制度性的空缺。", style: "erase" },
    { name: "拿出观众反馈", description: "用展场观察回答质疑。", answer: "我们通过访谈和现场观察记录观众行动，测试不同材料的呈现方式，对照反馈后修改形式。", style: "evidence" },
    { name: "把机构也放进作品", description: "让质疑指向策展制度。", answer: "这不是作品是否完整的问题，而是谁规定作者必须提供结论。我们追问机构的权力、可见性与观看的政治。", style: "deflect" }
  ]
};
window.DYB_PACKS.startup = {
  id: "startup", name: "Startup Pack / 产品创业", practice: "产品实验",
  projects: ["给待办事项再加一层待办事项", "做一个提醒你关闭提醒的应用", "把普通表格包装成智能平台", "出售尚未被验证的效率承诺", "把排队改名为社区协作"],
  vocabulary: ["增长飞轮", "网络效应", "价值闭环", "用户心智", "平台生态", "产品范式", "非线性过程", "需求的再语境化", "主体与客体的重组", "开放性"],
  topics: [
    { id: "experience", label: "用户与需求", keywords: ["用户", "使用者", "需求", "体验", "行为", "路径", "停留", "痛点"], question: "用户真正需要什么？" },
    { id: "form", label: "产品与设计", keywords: ["产品", "功能", "界面", "形式", "流程", "结构", "设计", "边界"], question: "为什么必须是这个产品？" },
    { id: "power", label: "平台与分配", keywords: ["平台", "公平", "公众", "权力", "劳动", "分配", "参与", "排除"], question: "谁获利，谁承担成本？" },
    { id: "evidence", label: "验证与指标", keywords: ["测试", "数据", "观察", "访谈", "反馈", "对照", "验证", "原型", "实验", "记录", "测量", "样本"], question: "验证指标在哪里？" },
    { id: "memory", label: "迭代与时间", keywords: ["时间", "历史", "过去", "迭代", "保留", "延续", "版本", "周期"], question: "此前迭代改变了什么？" }
  ],
  professors: [
    { name: "GROWTH EVANGELIST", moodBias: "form", questions: [{ text: "为什么这不是一个普通表格？", topic: "form" }, { text: "你说网络效应，第一批用户从哪里来？", topic: "experience" }] },
    { name: "METRIC INQUISITOR", moodBias: "evidence", questions: [{ text: "把增长故事先放下，能给我一个对照测试吗？", topic: "evidence" }, { text: "使用者留下来是因为有用，还是因为关不掉提醒？", topic: "experience" }] },
    { name: "PLATFORM SKEPTIC", moodBias: "power", questions: [{ text: "你节省的时间，是不是变成了别人的无偿劳动？", topic: "power" }, { text: "上个版本的失败为什么在这份演示里消失了？", topic: "memory" }] }
  ],
  strategies: [
    { name: "把闭环讲实一点", description: "从用户路径连接验证与概念。", answer: "这不是增加一个形式，而是围绕公众和使用者的需求建立价值闭环。我们记录用户路径与停留时间，通过原型测试、对照实验和反馈验证下一版产品。", style: "balanced" },
    { name: "飞轮先飞起来", description: "用增长概念保护尚未成立的产品。", answer: "我们真正关注的不是功能，而是网络效应、增长飞轮与平台生态。这个非线性过程需要开放性，数据不能过早定义它。", style: "jargon" },
    { name: "先承认指标不好看", description: "以失败记录换一点信任。", answer: "我承认目前还不确定。我们记录失败，观察用户反馈，对照测试过去两个版本，再决定保留哪些产品功能。", style: "honest" },
    { name: "要求一个小实验", description: "用证据回应投资质疑。", answer: "通过原型测试记录用户行为，测量停留时间，对照不同流程的反馈与数据，验证需求是否存在。", style: "evidence" }
  ]
};
