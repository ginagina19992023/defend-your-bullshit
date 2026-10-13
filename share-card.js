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
    const scoreY = rankY + rank.height + 98;
    const critiqueY = scoreY + 272;
    const defenseY = critiqueY + critique.height + 108;
    const defenseBottom = defenseY + 62 + defense.height;
    canvas.height = Math.max(1350, Math.ceil(defenseBottom + 120));
    ctx = canvas.getContext("2d");
    ctx.fillStyle = paper;
    ctx.fillRect(0, 0, width, canvas.height);
    ctx.fillStyle = "#252420";
    ctx.globalAlpha = 0.04;
    for (let y = 24; y < canvas.height; y += 34) ctx.fillRect(0, y, width, 1);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = "#b8ac99";
    ctx.lineWidth = 2;
    ctx.strokeRect(48, 40, width - 96, canvas.height - 80);
    function text(value, font, x, y, color = ink) { ctx.font = font; ctx.fillStyle = color; ctx.fillText(value, x, y); }
    function tape(label, y) {
      ctx.font = '700 21px Consolas,"Courier New",monospace';
      ctx.fillStyle = "#d7c29c";
      ctx.fillRect(padding, y, Math.min(inner, ctx.measureText(label).width + 80), 38);
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
    text("SAY IT FOR ME CLUB / FINAL REPORT", '700 20px Consolas,"Courier New",monospace', padding, 86);
    text("DEFEND YOUR", '900 90px Arial,sans-serif', padding, 182);
    text("BULLSHIT", '900 110px Arial,sans-serif', padding, 284, red);
    ctx.strokeStyle = red; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(padding, 302); ctx.lineTo(742, 292); ctx.stroke();
    ctx.save(); ctx.translate(856, 204); ctx.rotate(-0.09); ctx.strokeStyle = red; ctx.lineWidth = 4; ctx.strokeRect(-114,-45,228,100);
    text(data.verdict.passed ? "PASSED" : "FAILED", '900 43px Arial,sans-serif', -94, 7, red);
    text("WITH QUESTIONS", '700 15px Consolas,monospace', -86, 34, red); ctx.restore();
    tape("PROJECT / " + (data.careerTitle || "学术嘴替"), projectY);
    paragraph(project, projectY + 70);
    box(rankY, rank.height + 70);
    text("ACADEMIC RANK AWARDED", '700 19px Consolas,monospace', padding + 24, rankY + 30, red);
    paragraph(rank, rankY + 68);
    const rows = [["CONCEPTUAL DEPTH",data.scores.depth,24],["ACADEMIC CONFIDENCE",data.scores.confidence,24],["ACTUAL SUBSTANCE",data.scores.substance,24],["COMMITTEE DISCOMFORT",data.scores.discomfort,20]];
    rows.forEach(([label,value,max], i) => {
      const y = scoreY + i * 58;
      text(label,'700 21px Consolas,monospace',padding,y);
      ctx.fillStyle = "#d9cfbf"; ctx.fillRect(526,y-22,300,23);
      ctx.fillStyle = i === 3 ? red : ink; ctx.fillRect(526,y-22,300*Math.max(0,Math.min(1,value/max)),23);
      text(String(value),'900 32px Consolas,monospace',854,y+3,i === 3 ? red : ink);
    });
    tape("CRITIQUE EXCERPT",critiqueY);
    paragraph(critique,critiqueY + 72);
    box(defenseY, defense.height + 92);
    text("YOUR DEFENCE / 现场答辩全文",'700 21px Consolas,monospace',padding+24,defenseY+34,red);
    paragraph(defense,defenseY+74);
    text(data.url,'700 17px Consolas,monospace',padding,canvas.height-54);
    return { width, height:canvas.height, defenseLines:defense.lines, defenseFont, defenseBottom, footerY:canvas.height-54 };
  }
  window.DYB_SHARE_CARD = { draw, wrap };
})();
