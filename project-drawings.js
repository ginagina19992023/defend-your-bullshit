/* Six authored architectural diagrams. Vector lines stay legible on mobile and offline. */
(() => {
  const items=[
    {id:'shadow-museum',project:'设计一座只允许影子进入的美术馆',view:'平面图 / PLAN',note:'身体在门外，影子获得参观资格。',drawing:`
      <path d="M235 88H575V295H235V218M235 165V88" stroke-width="7"/>
      <path d="M345 88V150M345 205V295M460 88V210" stroke-width="4"/>
      <path d="M115 240L255 194L510 118" stroke="#b83f31" stroke-dasharray="6 7"/>
      <path d="M253 198L345 173L358 189L267 217Z" fill="#252420" opacity=".16" stroke="none"/>
      <circle cx="130" cy="218" r="9"/><path d="M130 229V257M113 240H147M130 257L118 275M130 257L142 275"/>
      <circle cx="95" cy="100" r="20" stroke="#b83f31"/><path d="M95 65V53M95 135V147M60 100H48M130 100H142M70 75L61 66M120 75L129 66" stroke="#b83f31"/>
      <path d="M238 164L195 135M235 219L203 246" stroke="#b83f31"/><text x="143" y="120">身体止步</text><text x="368" y="246">仅接待影子</text><text x="266" y="326">门缝宽度：一个概念</text>
      <ellipse cx="405" cy="194" rx="193" ry="123" stroke="#b83f31" stroke-dasharray="3 9"/>
    `},
    {id:'raised-plaza',project:'把公共广场抬高三厘米，让所有人必须绕路',view:'轴侧示意 / AXON',note:'高度只差三厘米，公共性绕了一大圈。',drawing:`
      <path d="M178 160L448 74L609 177L336 264Z" fill="#e6dcc9"/>
      <path d="M178 160V191L336 295L609 208V177M336 264V295"/>
      <path d="M178 191L336 295L609 208" stroke-width="3"/>
      <path d="M100 229L148 265L326 335L650 231L646 155L514 66" stroke="#b83f31" stroke-dasharray="7 6"/>
      <path d="M519 65L536 65M519 65L526 80" stroke="#b83f31"/>
      <path d="M622 174H648M622 208H648M642 174V208" stroke="#b83f31"/><text x="652" y="198">3 cm</text>
      <path d="M285 191L365 166L409 193L330 220Z" stroke-dasharray="3 5"/>
      <text x="300" y="145">公共广场</text><text x="153" y="329">合法动线：绕行</text><text x="419" y="294">不提供坡道</text>
    `},
    {id:'never-bus',project:'为一辆永远不会到站的公交车设计候车亭',view:'轴侧示意 / AXON',note:'座位、屋顶和站牌俱全，唯独没有到站时间。',drawing:`
      <path d="M171 172L393 101L530 180L308 253Z" fill="#e6dcc9"/>
      <path d="M186 178V291M309 246V338M510 183V286M393 113V228" stroke-width="4"/>
      <path d="M213 257L387 202L440 236L266 291Z" fill="#e6dcc9"/><path d="M220 258V290M269 291V317M437 237V268"/>
      <path d="M570 157V302M551 157H601V210H551Z"/><text x="557" y="187" font-size="16">∞</text>
      <path d="M80 332L619 157M116 361L659 189" stroke="#81786d"/><path d="M151 335L240 306M315 282L404 253M478 230L568 201" stroke="#81786d" stroke-dasharray="10 8"/>
      <text x="190" y="116">等待是一种建筑材料</text><text x="463" y="335">下一班：永不</text>
      <path d="M553 340Q530 353 490 348" stroke="#b83f31"/>
    `},
    {id:'toilet-axis',project:'把厕所入口设计成三百米长的纪念性轴线',view:'平面图 / PLAN',note:'功能只有一间厕所，仪式感足够撑满整个场地。',drawing:`
      <path d="M90 178H558V146H650V254H558V222H90" stroke-width="5"/>
      <path d="M557 178V195M557 222V208M576 146V179M612 146V179M576 179H612M632 211V234H650"/>
      <path d="M105 200H616" stroke="#b83f31" stroke-dasharray="8 8"/><path d="M616 200L603 191M616 200L603 209" stroke="#b83f31"/>
      <path d="M90 107V128M558 107V128M90 117H558" stroke="#81786d"/><path d="M90 117L99 112M558 117L549 122" stroke="#81786d"/>
      <text x="294" y="101">300 m</text><text x="89" y="262">入口</text><text x="587" y="241">WC</text><text x="181" y="293">请在抵达前完成自我反思</text>
      <ellipse cx="602" cy="199" rx="65" ry="69" stroke="#b83f31"/>
      <text x="75" y="82">北 ↑</text>
    `},
    {id:'same-bank-bridge',project:'建一座两端都连接同一岸的桥',view:'轴侧示意 / AXON',note:'跨越了很多结构问题，没有跨过这条河。',drawing:`
      <path d="M445 67L650 164L440 345L235 249Z" fill="#dce3df" stroke="#81786d"/>
      <path d="M472 106Q511 140 553 146M410 160Q449 192 491 199M345 216Q386 247 430 251M299 258Q338 287 374 292" stroke="#9caaa4"/>
      <path d="M180 202L298 101L409 154L351 203L309 183L236 246Z" fill="#e6dcc9" stroke-width="4"/>
      <path d="M180 202V230L236 274V246M409 154V182L351 231V203M236 274L309 211L351 231L409 182"/>
      <path d="M203 207L298 126L379 164L351 187L309 162L228 233" stroke="#b83f31" stroke-dasharray="7 5"/>
      <text x="100" y="290">出发岸 = 抵达岸</text><text x="487" y="268">河仍然在旁边</text><text x="164" y="82">跨越 / 未遂</text>
    `},
    {id:'wall-view-tower',project:'建一座所有窗户都朝向同一堵墙的观景塔',view:'轴侧示意 / AXON',note:'每层都有全景窗，每层都看见同一堵墙。',drawing:`
      <path d="M178 123L278 90L349 132V299L248 334L178 291Z" fill="#e6dcc9"/>
      <path d="M178 123L248 165L349 132M248 165V334"/>
      <path d="M263 175L329 153V180L263 202ZM263 223L329 201V228L263 250ZM263 272L329 250V277L263 299Z" fill="#f1eadf"/>
      <path d="M440 73L467 87V309L440 295Z" fill="#d8cbb7" stroke-width="4"/>
      <path d="M329 166L440 121M329 214L440 173M329 264L440 228" stroke="#b83f31" stroke-dasharray="7 6"/>
      <path d="M437 122L424 121M437 122L430 134M437 174L424 173M437 174L430 186M437 229L424 228M437 229L430 241" stroke="#b83f31"/>
      <text x="107" y="363">观景塔</text><text x="487" y="194">风景：墙</text><text x="83" y="69">把视野留给想象</text>
    `}
  ];
  function svg(item){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 400" role="img"><title>${item.project} — ${item.view}</title><desc>${item.note}</desc><defs><pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#d5cbbc" stroke-width=".5" opacity=".45"/></pattern></defs><rect width="720" height="400" fill="#f5efe3"/><rect x="20" y="20" width="680" height="360" fill="url(#grid)" stroke="#c8bcaa"/><g fill="none" stroke="#252420" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${item.drawing}</g><style>text{font-family:Georgia,"Songti SC",serif;font-size:19px;fill:#252420;stroke:none}</style></svg>`}
  const find=project=>items.find(item=>item.project===String(project).trim());
  function render(element,project,discipline){
    if(!element)return;const item=discipline==='architecture'?find(project):null;element.replaceChildren();element.hidden=!item;if(!item)return;
    const image=document.createElement('img');image.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg(item));image.alt=item.project+'。'+item.note;image.width=720;image.height=400;
    const caption=document.createElement('figcaption');const type=document.createElement('strong');type.textContent=item.view;const note=document.createElement('span');note.textContent=item.note;caption.append(type,note);element.append(image,caption);element.dataset.project=item.id;
  }
  window.DYB_PROJECT_DRAWINGS={items,find,svg,render};
})();
