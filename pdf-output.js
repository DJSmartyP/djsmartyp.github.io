(function(root){
'use strict';
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const clean=s=>String(s??'').replace(/[\u2010-\u2015]/g,'-').replace(/[\u2018\u2019]/g,"'").replace(/[\u201c\u201d]/g,'"').replace(/[^\x20-\x7e£]/g,'');
async function create({state,result,type='menu'},options={}){
 const lib=options.lib||root.PDFLib;if(!lib)throw Error('PDF tools could not load. Refresh and try again.');
 const {PDFDocument,StandardFonts,rgb}=lib,pdf=await PDFDocument.create();
 const regular=await pdf.embedFont(StandardFonts.Helvetica),bold=await pdf.embedFont(StandardFonts.HelveticaBold),play=await pdf.embedFont(StandardFonts.HelveticaBoldOblique);
 const purple=rgb(73/255,23/255,117/255),yellow=rgb(1,.81,.05),white=rgb(1,1,1),ink=rgb(.18,.13,.23),pale=rgb(.97,.95,.99),rose=rgb(1,.85,.87),mint=rgb(.77,.91,.78);
 const W=595.28,H=841.89,M=36,cash=p=>'£'+(p/100).toFixed(2);
 const wrap=(value,font,size,width)=>{const lines=[];let line='';for(const word of clean(value).split(/\s+/)){if(!word)continue;const next=line?line+' '+word:word;if(font.widthOfTextAtSize(next,size)>width&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);return lines;};
 const write=(page,value,x,y,size=11,color=ink,font=regular)=>page.drawText(clean(value),{x,y,size,color,font});
 const writeLines=(page,value,x,y,width,size=11,color=ink,font=regular,leading=size*1.25)=>{for(const line of wrap(value,font,size,width)){write(page,line,x,y,size,color,font);y-=leading;}return y;};
 const fit=(page,value,x,y,width,size,min,color,font)=>{while(font.widthOfTextAtSize(clean(value),size)>width&&size>min)size-=.5;return writeLines(page,value,x,y,width,size,color,font,size*1.15);};
 let logo;if(type==='shopping')try{const bytes=options.logoBytes||await fetch(new URL('assets/jag-logo-white.png',document.baseURI)).then(r=>{if(!r.ok)throw Error();return r.arrayBuffer();});logo=await pdf.embedPng(bytes);}catch{throw Error('JAG logo could not load. Refresh and try again.');}
 const date=()=>new Date(state.weekDate+'T12:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
 const sessions=state.session==='both'?['breakfast','after']:[state.session];
 async function menu(){
  for(const session of sessions){
   const isBreakfast=session==='breakfast',asset=isBreakfast?'menu-template-breakfast.png':'menu-template-after-school.png';
   let template;try{const bytes=(isBreakfast?options.breakfastTemplateBytes:options.afterTemplateBytes)||await fetch(new URL('assets/'+asset+'?v=2',document.baseURI)).then(r=>{if(!r.ok)throw Error();return r.arrayBuffer();});template=await pdf.embedPng(bytes);}catch{throw Error('Menu template could not load. Refresh and try again.');}
   const p=pdf.addPage([W,H]);p.drawImage(template,{x:0,y:0,width:W,height:H});
   fit(p,state.club,40,H-149,286,16,10,white,bold);
   fit(p,date(),355,H-149,195,15,10,white,bold);
   for(let i=0;i<5;i++){
    const day=result.days.find(item=>item.index===i&&item.session===session);
    const desc=!day||!day.count?'Club closed':day.recipe+' + '+day.fruit;
    const baseline=H-(464+i*194+87)/2;
    fit(p,desc,145,baseline,355,16,11,ink,bold);
   }
  }
 }
 function shopping(){
  let p=pdf.addPage([W,H]),y=H-171;
  function header(page,continued=false){page.drawRectangle({x:0,y:H-143,width:W,height:143,color:purple});page.drawImage(logo,{x:37,y:H-123,width:68,height:76});write(page,'JUNIOR ADVENTURES GROUP',140,H-39,8,yellow,bold);fit(page,continued?'Shopping list (continued)':'Shopping list',140,H-75,W-170,26,18,white,play);fit(page,state.club,140,H-101,W-170,14,10,white,bold);write(page,'Week commencing '+date(),140,H-119,9,white);page.drawRectangle({x:0,y:H-150,width:W,height:7,color:yellow});}
  function footer(page){page.drawRectangle({x:0,y:0,width:W,height:34,color:purple});write(page,'JAG Snack Planner  |  Staff shopping copy',M,12,8,white);}
  header(p);p.drawRectangle({x:M,y:y-70,width:W-2*M,height:73,color:pale});
  write(p,'WEEKLY SHOP',M+14,y-18,9,purple,bold);write(p,cash(result.total),M+14,y-45,21,purple,bold);
  write(p,'PERIOD FORECAST',M+190,y-18,9,purple,bold);write(p,cash(result.projection),M+190,y-45,18,purple,bold);
  write(p,`${result.weeks} weeks  |  ${cash(result.balance)} left`,M+358,y-37,9,purple,bold);y-=91;
  write(p,`Food ${cash(result.food)}   |   Delivery / collection ${cash(result.delivery)}   |   Small-order charge ${cash(result.surcharge)}`,M,y,9,ink);y-=28;
  let lastGroup='';const rows=result.rows.filter(row=>row.packs>0);
  for(const row of rows){
   const groupChanged=row.group!==lastGroup;
   if(y<(groupChanged?115:94)){footer(p);p=pdf.addPage([W,H]);header(p,true);y=H-174;lastGroup='';}
   if(row.group!==lastGroup){write(p,row.group.toUpperCase(),M,y,10,purple,bold);p.drawRectangle({x:M,y:y-8,width:W-2*M,height:2,color:yellow});y-=27;lastGroup=row.group;}
   p.drawRectangle({x:M,y:y-1,width:10,height:10,borderColor:purple,borderWidth:1});
   const nameLines=wrap(row.name,bold,10,W-230);nameLines.forEach((line,i)=>write(p,line,M+18,y-i*12,10,ink,bold));
   write(p,cash(row.total),W-M-66,y,10,purple,bold);
   const detail=`${row.packs} x ${row.pack}${row.stock?`  |  Have ${row.stock} ${row.unit}`:''}`;
   y=writeLines(p,detail,M+18,y-nameLines.length*12-2,W-2*M-40,8,ink,regular,10)-13;
  }
  if(!rows.length){write(p,'Usable stock covers this week. No packs to buy.',M,y,11,ink);y-=30;}
  const notes=[`Budget ${cash(result.budget)} across ${result.weeks} weeks. Forecast repeats this weekly shop with fresh full packs and fees each week.`,`Prices researched 22 October 2026. Some are planning allowances. Check current prices, pack sizes, availability and delivery charges before ordering.`,`Ingredient exclusions do not confirm allergen suitability. Check labels, dietary records, storage and use-by dates.${state.excluded?.length?' Excluded: '+state.excluded.map(id=>root.JAGCatalogue.products[id]?.name||id).join(', ')+'.':''}`];
  for(const note of notes){if(y<90){footer(p);p=pdf.addPage([W,H]);header(p,true);y=H-180;}y=writeLines(p,note,M,y,W-2*M,8,ink,regular,11)-8;}
  footer(p);
 }
 if(type==='shopping')shopping();else await menu();
 pdf.setTitle(state.club+(type==='shopping'?' - Shopping list':' - Weekly snack menu'));pdf.setAuthor('JAG Snack Planner');
 return pdf.save();
}
root.JAGPDF={create};if(typeof module!=='undefined')module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
