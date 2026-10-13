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
    const projectY = 342;
    const rankY = projectY + project.height + 88;
    const scoreY = rankY + rank.height + 128;
    const critiqueY = scoreY + 272;
    const defenseY = critiqueY + critique.height + 108;
    const defenseBottom = defenseY + 62 + defense.height;
    canvas.height = Math.max(1350, Math.ceil(defenseBottom + 320));
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
    text(data.url,'700 17px Consolas,monospace',padding,canvas.height-54);
    return { width, height:canvas.height, defenseLines:defense.lines, defenseFont, defenseBottom, footerY:canvas.height-54 };
  }
  window.DYB_SHARE_CARD = { draw, wrap };
})();
