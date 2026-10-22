(function(root){
const catalogue=typeof module!=='undefined'?require('./catalogue.js'):root.JAGCatalogue;
const finite=(value,fallback=0)=>Number.isFinite(Number(value))?Number(value):fallback;
const clamp=(value,min,max,fallback=0)=>Math.min(max,Math.max(min,finite(value,fallback)));
const cents=value=>Math.round(value*100);
function calculate(state){
 const needs={},days=[];let children=0;
 const excluded=new Set(state.excluded||[]);
 const scale=clamp(state.portionPercent,50,200,100)/100;
 const schedule=(state.days||[]).slice(0,5).map((day,index)=>({...day,index,session:state.session==='both'?'after':state.session}));
 if(state.session==='both')schedule.push(...(state.breakfastDays||[]).slice(0,5).map((day,index)=>({...day,index,session:'breakfast'})));
 for(const day of schedule){
  const index=day.index;
  const count=Math.floor(clamp(day.count,0,1000));
  if(count===0){days.push({index,session:day.session,count:0,recipe:'Club closed',fruit:''});continue;}
  const recipe=catalogue.recipes[day.recipe];
  if(!recipe||recipe.session!==day.session)throw new Error('Choose a menu for the selected club.');
  children+=count;
  const ingredients={...recipe.ingredients};
  if(state.vegetarian&&ingredients.chicken){delete ingredients.chicken;ingredients.cheese=20;}
  if(!['banana','apple','satsuma'].includes(day.fruit))throw new Error('Choose an approved fruit.');
  ingredients[day.fruit]=1;
  if(count>0&&Object.keys(ingredients).some(id=>excluded.has(id)))throw new Error('This menu contains an excluded food. Choose another menu.');
  for(const [id,amount] of Object.entries(ingredients)){
   const perChild=['hummus','spread'].includes(id)?Math.min(amount*scale,state.session==='both'?5:10):amount*scale;
   needs[id]=(needs[id]||0)+perChild*count;
  }
  days.push({index,session:day.session,count,recipe:recipe.name.replace(/^Chicken/,state.vegetarian?'Cheese':'Chicken'),fruit:catalogue.products[day.fruit].name});
 }
 const extra=1+clamp(state.buffer,0,30)/100;
 const rows=Object.entries(needs).filter(([,n])=>n>0).map(([id,amount])=>{
  const p=catalogue.products[id],custom=state.products?.[id]||{};
  const size=clamp(custom.size??p.size,.01,100000,p.size);
  const price=cents(clamp(custom.price??p.price,0,1000,p.price));
  const stock=clamp(custom.stock,0,100000);
  const required=amount*extra, buy=Math.max(0,required-stock);
  const packs=Math.ceil(Math.max(0,buy/size-1e-9));
  return {id,...p,size,price,stock,required,packs,total:packs*price,leftover:stock+packs*size-required,customPrice:custom.price!=null};
 }).sort((a,b)=>a.group.localeCompare(b.group)||a.name.localeCompare(b.name));
 const food=rows.reduce((s,r)=>s+r.total,0);
 const online=['delivery','collect'].includes(state.method);
 const hasOrder=food>0;
 const delivery=online&&hasOrder?cents(clamp(state.deliveryFee,0,100)):0;
 const threshold=cents(clamp(state.threshold,0,1000,state.method==='collect'?25:50));
 const surcharge=online&&hasOrder&&food<threshold?cents(clamp(state.smallFee,0,100)):0;
 const total=food+delivery+surcharge;
 const weeks=Math.floor(clamp(state.weeks,1,52,4));
 const budget=cents(clamp(state.budget,0,100000));
 return {rows,days,children,food,delivery,surcharge,total,weeks,budget,weeklyBudget:budget/weeks,projection:total*weeks,balance:budget-total*weeks,threshold};
}
const API={calculate};root.JAGPlanner=API;if(typeof module!=='undefined')module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
