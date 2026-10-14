/* Measure every paragraph before drawing so shared defenses are never truncated. */
(() => {
  "use strict";
  function wrap(ctx, text, width) {
    const lines = [];
    for (const paragraph of String(text).split(/\r?\n/)) {
      if (!paragraph) { lines.push(""); continue; }
      let line = "";
      for (const char of Array.from(paragraph)) {
        if (line && ctx.measureText(line + char).width > width) {
          if (/[，。！？；：、）】”]/.test(char)) { lines.push(line + char); line = ""; continue; }
          const space = line.lastIndexOf(" ");
          if (space > line.length / 2 && char !== " ") {
            lines.push(line.slice(0, space));
            line = line.slice(space + 1) + char;
          } else { lines.push(line); line = char; }
        } else line += char;
      }
      lines.push(line);
    }
    return lines;
  }
  function draw(canvas, data) {
    const width = 1080;
    const padding = 96;
    const inner = width - padding * 2;
    const ink = "#252420", red = "#b83f31", paper = "#f1eadf";
    canvas.width = width;
    let ctx = canvas.getContext("2d");
    const plan = (text, font, lineHeight, availableWidth) => {
      ctx.font = font;
      const lines = wrap(ctx, text, availableWidth);
      return { lines, font, lineHeight, height: lines.length * lineHeight };
    };
    const project = plan(data.project, '700 28px Arial,"Microsoft YaHei",sans-serif', 40, inner - 48);
    const rank = plan(data.verdict.title, '900 34px Consolas,"Courier New",monospace', 46, inner - 48);
    const critique = plan(data.critique, '500 27px Arial,"Microsoft YaHei",sans-serif', 39, inner - 48);
    const defenseFont = data.defense.length > 1200 ? 20 : 22;
    const defense = plan(data.defense, '500 ' + defenseFont + 'px Arial,"Microsoft YaHei",sans-serif', defenseFont + 11, inner - 48);
    const committee=[...new Set((data.history||[]).map(row=>row.professor).filter(Boolean))];
    const signatures=committee.map(name=>plan(name,'italic 700 27px "KaiTi","STKaiti",Georgia,cursive',36,(inner-32)/2-24));
    const signatureRows=[];for(let i=0;i<signatures.length;i+=2)signatureRows.push(Math.max(signatures[i].height,signatures[i+1]?.height||0)+34);
    const committeeHeight=committee.length?70+signatureRows.reduce((sum,h)=>sum+h,0):0;
    const projectY = 342;
    const rankY = projectY + project.height + 88;
    const scoreY = rankY + rank.height + 128;
    const critiqueY = scoreY + 272;
    const defenseY = critiqueY + critique.height + 108;
    const defenseBottom = defenseY + 62 + defense.height;
    canvas.height = Math.max(1350, Math.ceil(defenseBottom + 320 + committeeHeight));
    ctx = canvas.getContext("2d");
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, canvas.height);
    ctx.fillStyle = "#252420";
    ctx.globalAlpha = 0.04;
    for (let y = 24; y < canvas.height; y += 34) ctx.fillRect(0, y, width, 1);
    ctx.globalAlpha = 1;
    // Stable paper grain: repeated exports of one result keep the same marks.
    let seed = 9187;
    const noise = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    ctx.fillStyle = "#77593d";
    for (let i=0;i<canvas.height*5;i++) {
      ctx.globalAlpha = 0.025 + noise()*0.045;
      ctx.fillRect(noise()*width,noise()*canvas.height,1+noise()*2,1+noise()*2);
    }
    ctx.globalAlpha=1;
    // Reuse only architectural margins and the panel from the user's original cover.
    const cover = document.querySelector('.image-cover img');
    if (cover?.complete && cover.naturalWidth) {
      ctx.save();ctx.globalAlpha=0.3;
      ctx.drawImage(cover,0,cover.naturalHeight*0.32,cover.naturalWidth*0.16,cover.naturalHeight*0.48,0,420,78,490);
      ctx.restore();
      const sceneY=canvas.height-254;
      ctx.drawImage(cover,cover.naturalWidth*0.2,cover.naturalHeight*0.64,cover.naturalWidth*0.62,cover.naturalHeight*0.31,padding,sceneY,inner,170);
    }
    ctx.strokeStyle = "#b8ac99";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 40, width - 96, canvas.height - 80);
    function text(value, font, x, y, color = ink) { ctx.font = font; ctx.fillStyle = color; ctx.fillText(value, x, y); }
    function pen(path,weight=3) {
      ctx.save();ctx.strokeStyle=red;ctx.lineWidth=weight;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();path();ctx.stroke();ctx.restore();
    }
    function circle(x,y,rx,ry) {
      pen(()=>{for(let i=0;i<=85;i++){const a=i/85*Math.PI*2;const px=x+Math.cos(a)*(rx+Math.sin(a*5)*2);const py=y+Math.sin(a)*(ry+Math.cos(a*3)*2);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)}});
      pen(()=>{ctx.ellipse(x+3,y-2,rx+4,ry+2,-0.025,0.2,Math.PI*1.83)},1.4);
    }
    function wave(x,y,length) {
      pen(()=>{ctx.moveTo(x,y);for(let dx=0;dx<=length;dx+=3)ctx.lineTo(x+dx,y+Math.sin(dx/12)*3+Math.sin(dx/47))},2.4);
    }
    function note(value,x,y,angle=-0.07,size=21) {
      ctx.save();ctx.translate(x,y);ctx.rotate(angle);text(value,'italic 700 '+size+'px "Comic Sans MS","KaiTi",cursive',0,0,red);ctx.restore();
    }
    function tape(label, y) {
      ctx.font = '700 21px Consolas,"Courier New",monospace';
      ctx.fillStyle = "#d7c29c";
      const tapeWidth=Math.min(inner,ctx.measureText(label).width+52);
      ctx.beginPath();ctx.moveTo(padding-5,y+3);ctx.lineTo(padding+tapeWidth,y-3);ctx.lineTo(padding+tapeWidth-7,y+15);ctx.lineTo(padding+tapeWidth+2,y+35);ctx.lineTo(padding+3,y+40);ctx.lineTo(padding-4,y+22);ctx.closePath();ctx.fill();
      text(label, '700 21px Consolas,"Courier New",monospace', padding + 14, y + 27);
    }
    function paragraph(layout, y, color = ink) {
      ctx.font = layout.font; ctx.fillStyle = color;
      layout.lines.forEach((line, i) => ctx.fillText(line, padding + 24, y + i * layout.lineHeight));
    }
    function box(y, height) {
      ctx.fillStyle = "#fffaf1"; ctx.fillRect(padding, y, inner, height);
      ctx.strokeStyle = "#b8ac99"; ctx.lineWidth = 1; ctx.strokeRect(padding, y, inner, height);
    }
    text("学术嘴替 / FINAL REVIEW SIMULATOR", '700 20px Consolas,"Courier New",monospace', padding, 86);
    text("DEFEND YOUR", '900 90px Arial,sans-serif', padding, 182);
    text("BULLSHIT", '900 110px Arial,sans-serif', padding, 284, red);
    ctx.strokeStyle = red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(padding, 302); ctx.lineTo(742, 292); ctx.stroke();
    ctx.save(); ctx.translate(856, 204); ctx.rotate(-0.09); ctx.strokeStyle = red; ctx.lineWidth = 4; ctx.strokeRect(-114,-45,228,100);
    text(data.verdict.passed ? "PASSED" : "FAILED", '900 43px Arial,sans-serif', -94, 7, red);
    text("WITH QUESTIONS", '700 15px Consolas,monospace', -86, 34, red); ctx.restore();
    // A crown and a loose marker underline, like annotations on a review board.
    pen(()=>{ctx.moveTo(680,112);ctx.lineTo(670,73);ctx.lineTo(690,86);ctx.lineTo(705,57);ctx.lineTo(719,87);ctx.lineTo(739,68);ctx.lineTo(737,107);ctx.lineTo(680,112)},4);
    wave(padding,311,600);
    note(data.verdict.passed?"居然讲过去了。":"没过，但很会讲。",754,318,-0.05,22);
    tape("PROJECT / " + (data.careerTitle || "学术嘴替"), projectY);
    paragraph(project, projectY + 70);
    box(rankY, rank.height + 70);
    text("ACADEMIC RANK AWARDED", '700 19px Consolas,monospace', padding + 24, rankY + 30, red);
    paragraph(rank, rankY + 68);
    circle(padding+inner/2,rankY+46+rank.height/2,inner/2+15,rank.height/2+14);
    note('批注：这也算一种学位？',padding+inner-310,rankY-13,0.025,20);
    const rows = [["CONCEPTUAL DEPTH",data.scores.depth,24],["ACADEMIC CONFIDENCE",data.scores.confidence,24],["ACTUAL SUBSTANCE",data.scores.substance,24],["COMMITTEE DISCOMFORT",data.scores.discomfort,20]];
    rows.forEach(([label,value,max], i) => {
      const y = scoreY + i * 58;
      text(label,'700 21px Consolas,monospace',padding,y);
      ctx.fillStyle = "#d9cfbf"; ctx.fillRect(526,y-22,300,23);
      ctx.fillStyle = i === 3 ? red : ink; ctx.fillRect(526,y-22,300*Math.max(0,Math.min(1,value/max)),23);
      text(String(value),'900 32px Consolas,monospace',854,y+3,i === 3 ? red : ink);
    });
    const hottest = data.scores.discomfort>=10 ? 3 : data.scores.substance<4 ? 2 : 1;
    circle(877,scoreY+hottest*58-10,42,29);
    note(hottest===3?'评委血压 ↑':hottest===2?'证据呢？':'自信先行！',696,scoreY+224,-0.055,23);
    pen(()=>{ctx.moveTo(905,scoreY+211);ctx.quadraticCurveTo(955,scoreY+190,937,scoreY+hottest*58+12);ctx.moveTo(937,scoreY+hottest*58+12);ctx.lineTo(927,scoreY+hottest*58+24);ctx.moveTo(937,scoreY+hottest*58+12);ctx.lineTo(949,scoreY+hottest*58+24)});
    tape("CRITIQUE EXCERPT",critiqueY);
    paragraph(critique,critiqueY + 72);
    ctx.font=critique.font;
    wave(padding+24,critiqueY+81,Math.min(inner-48,ctx.measureText(critique.lines[0]||'').width));
    note('教授说的，别问我。',padding+inner-280,defenseY-24,-0.025,20);
    box(defenseY, defense.height + 92);
    text("YOUR DEFENCE / 现场答辩全文",'700 21px Consolas,monospace',padding+24,defenseY+34,red);
    paragraph(defense,defenseY+74);
    // Mark only the margin: the full defense stays unobscured.
    pen(()=>{ctx.moveTo(padding+8,defenseY+63);ctx.lineTo(padding-12,defenseY+70);ctx.lineTo(padding-10,defenseBottom+18);ctx.lineTo(padding+9,defenseBottom+25)},2.5);
    note('你敢讲，我就敢存证。',padding+24,defenseBottom+65,-0.045,22);
    if(committee.length){
      const top=defenseBottom+106;
      text('REVIEWED BY / 本局评图席', '700 21px Consolas,monospace',padding,top,red);
      text('虚构教授 · 模拟签名', '500 17px Arial,sans-serif',padding+inner-220,top,'#81786d');
      let y=top+48;
      signatures.forEach((signature,i)=>{const x=padding+(i%2)*(inner+32)/2;ctx.save();ctx.translate(x,y);ctx.rotate(i%2?0.025:-0.025);ctx.font=signature.font;ctx.fillStyle=ink;signature.lines.forEach((line,j)=>ctx.fillText(line,0,j*signature.lineHeight));ctx.restore();ctx.strokeStyle=red;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y+signature.height-18);ctx.lineTo(x+(inner-32)/2-24,y+signature.height-22);ctx.stroke();if(i%2===1)y+=signatureRows[Math.floor(i/2)];});
    }
    text(data.url,'700 17px Consolas,monospace',padding,canvas.height-54);
    return { width, height:canvas.height, defenseLines:defense.lines, defenseFont, defenseBottom, footerY:canvas.height-54 };
  }
  function drawRecord(canvas,data){
    const width=1080,padding=96,inner=width-2*padding;canvas.width=width;
    let ctx=canvas.getContext('2d');const ink='#252420',red='#b83f31';
    const layout=(text,size=25)=>{ctx.font=size+'px Arial,"Microsoft YaHei",sans-serif';const lines=wrap(ctx,String(text||'（未记录）'),inner-48);return {lines,size,height:lines.length*(size+14)}};
    const project=layout(data.project,28);
    const rows=(data.history||[]).map((row,i)=>{
      const parts=[{label:'评委 / CRITIC',value:row.professor},{label:'评委的问题 / QUESTION',value:row.question},{label:'你的回答 / YOUR DEFENCE',value:row.answer},{label:'评委留下的评语 / CRITIQUE',value:row.response}];
      if(row.battle)parts.push({label:'限时追问 / BATTLE QUESTION',value:row.battle.question||'（早期记录未保存追问）'},{label:'你的补充回答 / BATTLE DEFENCE',value:row.battle.answer},{label:'追问评语 / BATTLE CRITIQUE',value:row.battle.response});
      const blocks=parts.map(part=>({...part,...layout(part.value,part.label.includes('CRITIQUE')?27:25)}));
      return {round:i+1,blocks,height:100+blocks.reduce((sum,b)=>sum+b.height+72,0)};
    });
    canvas.height=330+project.height+rows.reduce((sum,r)=>sum+r.height+40,0)+100;ctx=canvas.getContext('2d');ctx.fillStyle='#f1eadf';ctx.fillRect(0,0,width,canvas.height);
    ctx.strokeStyle='#b8ac99';ctx.strokeRect(48,40,width-96,canvas.height-80);
    const text=(value,font,x,y,color=ink)=>{ctx.font=font;ctx.fillStyle=color;ctx.fillText(value,x,y)};
    text('02 / THE DEFENCE TRANSCRIPT','700 23px Consolas,monospace',padding,100,red);
    text('每一句都有教授听见。','900 48px Arial,sans-serif',padding,180);
    let y=244;project.lines.forEach(line=>{text(line,'700 28px Arial,sans-serif',padding,y);y+=42});y+=50;
    const painted=[];
    rows.forEach(row=>{ctx.fillStyle='#fffaf1';ctx.fillRect(padding,y,inner,row.height);ctx.strokeStyle='#b8ac99';ctx.strokeRect(padding,y,inner,row.height);text('ROUND '+String(row.round).padStart(2,'0'),'900 30px Consolas,monospace',padding+24,y+50,red);let cursor=y+100;
      row.blocks.forEach(block=>{text(block.label,'700 19px Consolas,monospace',padding+24,cursor,red);cursor+=40;block.lines.forEach(line=>{text(line,block.size+'px Arial,"Microsoft YaHei",sans-serif',padding+24,cursor);painted.push(line);cursor+=block.size+14});cursor+=32});y+=row.height+40;
    });text(data.url,'700 17px Consolas,monospace',padding,canvas.height-54);
    return {width,height:canvas.height,rounds:rows.length,painted,footerY:canvas.height-54};
  }
  function combine(poster,record){const canvas=document.createElement('canvas');canvas.width=poster.width;canvas.height=poster.height+record.height;const ctx=canvas.getContext('2d');ctx.drawImage(poster,0,0);ctx.drawImage(record,0,poster.height);return canvas}
  window.DYB_SHARE_CARD = { draw, drawRecord, combine, wrap };
})();
