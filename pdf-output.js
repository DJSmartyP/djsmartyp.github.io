(function(root){
'use strict';
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const clean=s=>String(s??'').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[^\x20-\x7e£]/g,'');
async function create({state,result},options={}){
 const lib=options.lib||root.PDFLib;if(!lib)throw new Error('PDF tools could not load. Refresh the page and try again.');
 const {PDFDocument,StandardFonts,rgb}=lib,pdf=await PDFDocument.create();
 const regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold);
 const purple=rgb(74/255,19/255,117/255),yellow=rgb(1,.796,0),ink=rgb(.17,.13,.22),muted=rgb(.38,.34,.42),light=rgb(.96,.94,.98),white=rgb(1,1,1);
 const width=595.28,height=841.89,margin=32,content=width-64;
 const cash=p=>'£'+(p/100).toFixed(2);
 const wrap=(text,font,size,maxWidth)=>{const lines=[];let line='';for(const word of clean(text).split(/\s+/)){if(!word)continue;const next=line?line+' '+word:word;if(font.widthOfTextAtSize(next,size)>maxWidth&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
 function text(page,value,x,y,size=11,color=ink,font=regular){page.drawText(clean(value),{x,y,size,color,font});}
 function lines(page,value,x,y,maxWidth,size=11,color=ink,font=regular,leading=size*1.3){const ls=wrap(value,font,size,maxWidth);ls.forEach((l,i)=>text(page,l,x,y-i*leading,size,color,font));return y-ls.length*leading;}
 function fit(page,value,x,y,maxWidth,size=20,min=12,color=white,font=bold){let n=size;while(font.widthOfTextAtSize(clean(value),n)>maxWidth&&n>min)n-=.5;return lines(page,value,x,y,maxWidth,n,color,font,n*1.15);}
 let logo;
 try{const bytes=options.logoBytes||await fetch(new URL('assets/jag-logo.png',document.baseURI)).then(r=>{if(!r.ok)throw new Error('Logo missing');return r.arrayBuffer();});logo=await pdf.embedPng(bytes);}catch{throw new Error('The JAG logo could not load. Refresh the page before downloading.');}
 function date(){const d=new Date(state.weekDate+'T12:00:00');return d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});}
 function header(page,title,subtitle){page.drawRectangle({x:0,y:height-157,width,height:157,color:purple});page.drawCircle({x:40,y:height-31,size:95,color:white});page.drawImage(logo,{x:17,y:height-106,width:77,height:86.24});text(page,'JUNIOR ADVENTURES GROUP',137,height-30,8,yellow,bold);fit(page,title,137,height-68,width-167,27,18);const siteEnd=fit(page,state.club,137,height-99,width-167,15,10);text(page,subtitle,137,Math.min(height-126,siteEnd-8),9,white);page.drawRectangle({x:0,y:height-165,width,height:8,color:yellow});}
 function footer(page,label){page.drawRectangle({x:0,y:0,width,height:44,color:purple});text(page,label,margin,25,8,white);text(page,'JAG Snack Planner',width-126,25,8,yellow,bold);}
 pdf.setTitle(state.club+' - Weekly Snack Menu');pdf.setAuthor('JAG Snack Planner');pdf.setSubject('Club snack menu and staff shopping estimate');
 const board=pdf.addPage([width,height]);const both=state.pdfVariant==='both',only=state.pdfVariant==='breakfast'?'breakfast':'after';
 header(board,'Our weekly menu',`Week commencing ${date()}  |  ${both?'Breakfast + after school':only==='breakfast'?'Breakfast club':'After-school club'}`);
 const top=height-195,rowHeight=both?103:101;
 for(let i=0;i<5;i++){
  const y=top-i*rowHeight;
  board.drawRectangle({x:margin,y:y-rowHeight+11,width:content,height:rowHeight-7,color:i%2===0?light:rgb(.994,.99,1)});
  board.drawRectangle({x:margin,y:y-rowHeight+11,width:5,height:rowHeight-7,color:yellow});
  text(board,DAYS[i].toUpperCase(),margin+16,y-12,11,purple,bold);
  let lineY=y-34;
  for(const session of (both?['breakfast','after']:[only])){
   const day=result.days.find(d=>d.index===i&&d.session===session);
   const label=session==='breakfast'?'BREAKFAST':'AFTER SCHOOL';
   text(board,label,margin+16,lineY,8,purple,bold);
   const desc=!day||day.count===0?'Club closed':`${day.recipe} + ${day.fruit.toLowerCase()}`;
   lines(board,desc,margin+108,lineY,content-130,both?10:12,ink,regular,both?12:15);
   lineY-=33;
  }
 }
 const bottom=top-5*rowHeight;
 text(board,'GOOD FOOD. HAPPY ADVENTURES.',margin,bottom-4,13,purple,bold);
 lines(board,'Please speak to the club team about ingredients and dietary needs. Menus may change with availability. Water is available throughout the session.',margin,bottom-24,content,9,muted,regular,12);
 footer(board,'Weekly club menu - for your noticeboard');
 if(state.includeStaff){
  const page=pdf.addPage([width,height]);header(page,'Shopping & budget',`STAFF COPY  |  Week commencing ${date()}`);let y=height-194;
  const costs=[['Food',result.food],['Delivery / collection',result.delivery],['Small-order charge',result.surcharge],['Weekly total',result.total]];
  costs.forEach(([label,value],i)=>{const x=margin+(i%2)*(content/2),cy=y-Math.floor(i/2)*31;text(page,label,x,cy,9,muted);text(page,cash(value),x+165,cy,11,purple,bold);});y-=65;
  if(state.budget!=='')y=lines(page,`Budget ${cash(result.budget)} for ${result.weeks} weeks. Weekly allowance ${cash(result.weeklyBudget)}. Forecast ${cash(result.projection)}. ${cash(Math.abs(result.balance))} ${result.balance<0?'over budget':'remaining'}.`,margin,y,content,9,ink,regular,12)-7;
  y=lines(page,'Forecast repeats this week, full packs and one order fee each week. No leftover carry-forward.',margin,y,content,8,muted,regular,11)-13;
  text(page,'SHOPPING LIST',margin,y,10,purple,bold);y-=21;
  const gap=18,colWidth=(content-gap)/2,half=Math.ceil(result.rows.length/2),startY=y;
  result.rows.forEach((r,i)=>{
   const col=i<half?0:1,row=i%half,x=margin+col*(colWidth+gap),cy=startY-row*44;
   page.drawRectangle({x,y:cy-1,width:7,height:7,borderColor:muted,borderWidth:.6});
   lines(page,r.name,x+13,cy,colWidth-64,9,ink,bold,10);text(page,cash(r.total),x+colWidth-39,cy,9,purple,bold);
   const pack=`${r.packs} x ${r.pack}${r.size!==root.JAGCatalogue.products[r.id].size?`; ${r.size} ${r.unit}/pack override`:''}${r.stock?`; stock ${r.stock} ${r.unit}`:''}`;
   lines(page,pack,x+13,cy-12,colWidth-13,7.5,muted,regular,9);
   text(page,r.customPrice?'Your price':r.checked?'Tesco reference':'Planning allowance',x+13,cy-32,7,purple);
  });
  y=startY-half*44-3;
  let notes='Prices researched 22 October 2026. Some are allowances; no live prices or Clubcard offers. Confirm prices, pack yields, availability, chilled use-by dates and slot fees. Houmous reference may need an equivalent. ';
  notes+='Ingredient exclusions do not certify allergen suitability. Check labels and dietary records. Portions are estimates. Condiments are capped at 10g per planned day, or 5g per session for combined clubs; account for school-day consumption. ';
  if(state.session==='both'&&state.pdfVariant!=='both')notes+='Staff costs cover both sessions even if the noticeboard shows one. ';
  if(state.excluded.length)notes+='Excluded: '+state.excluded.map(id=>root.JAGCatalogue.products[id].name).join(', ')+'.';
  const noteLines=wrap(notes,regular,7.5,content);
  if(y-noteLines.length*10<60){const extra=pdf.addPage([width,height]);header(extra,'Staff planning notes',`Week commencing ${date()}`);lines(extra,notes,margin,height-194,content,9,muted,regular,13);footer(extra,'Staff planning copy - do not use as a dietary record');}
  else lines(page,notes,margin,y,content,7.5,muted,regular,10);
  footer(page,'Staff planning copy - do not use as a dietary record');
 }

 return pdf.save();
}
root.JAGPDF={create};if(typeof module!=='undefined')module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
