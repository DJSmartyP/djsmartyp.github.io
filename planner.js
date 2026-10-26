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
  if(!catalogue.fruitIds.includes(day.fruit))throw new Error('Choose an approved fruit.');
  ingredients[day.fruit]=1;
  if(count>0&&Object.keys(ingredients).some(id=>excluded.has(id)))throw new Error('This menu contains an excluded food. Choose another menu.');
  if(catalogue.limitedWeeklyIds.some(id=>ingredients[id]&&schedule.filter(item=>item.count>0&&catalogue.recipes[item.recipe]?.ingredients[id]).length>2))throw new Error('Jam and honey may each be used on no more than two club sessions per week.');
  for(const [id,amount] of Object.entries(ingredients)){
   const perChild=catalogue.condimentIds.includes(id)?Math.min(amount*scale,state.session==='both'?5:10):amount*scale;
   needs[id]=(needs[id]||0)+perChild*count;
  }
  days.push({index,session:day.session,count,recipe:recipe.name,fruit:catalogue.products[day.fruit].name});
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
function generate(state){
 const budget=cents(clamp(state.budget,0,100000));
 const weeks=Math.floor(clamp(state.weeks,1,52,4));
 if(!budget)throw new Error('Enter a period budget before generating a plan.');
 const excluded=new Set(state.excluded||[]);
 const fruits=catalogue.fruitIds.filter(id=>!excluded.has(id));
 if(!fruits.length)throw new Error('Allow at least one fruit to generate a plan.');
 const slots=[];
 const primary=state.session==='breakfast'?'breakfast':'after';
 for(let index=0;index<5;index++){
  slots.push({session:primary,index,count:Math.floor(clamp(state.days?.[index]?.count,0,1000))});
  if(state.session==='both')slots.push({session:'breakfast',index,count:Math.floor(clamp(state.breakfastDays?.[index]?.count,0,1000))});
 }
 if(!slots.some(slot=>slot.count))throw new Error('Enter children for at least one open club day.');
 const options={};
 for(const session of new Set(slots.filter(slot=>slot.count).map(slot=>slot.session))){
  options[session]=Object.entries(catalogue.recipes)
   .filter(([,recipe])=>recipe.session===session&&!Object.keys(recipe.ingredients).some(id=>excluded.has(id)))
   .flatMap(([id,recipe])=>fruits.map(fruit=>({id,recipe,fruit,family:Object.keys(recipe.ingredients).find(food=>!['bread','pitta','wraps','milk','spread','carrot','cucumber','pepper'].includes(food))||'toast'})));
  if(!options[session].length)throw new Error(`No approved ${session==='after'?'after-school':'breakfast'} menu remains with these exclusions.`);
 }
 const scale=clamp(state.portionPercent,50,200,100)/100;
 const extra=1+clamp(state.buffer,0,30)/100;
 const unitCost=needs=>Object.entries(needs).reduce((sum,[id,need])=>{
  if(!need)return sum;
  const product=catalogue.products[id],custom=state.products?.[id]||{};
  const size=clamp(custom.size??product.size,.01,100000,product.size);
  const stock=clamp(custom.stock,0,100000);
  const price=cents(clamp(custom.price??product.price,0,1000,product.price));
  return sum+Math.ceil(Math.max(0,(need*extra-stock)/size-1e-9))*price;
 },0);
 const seed={needs:{},plan:[],recipes:{},families:{},fruits:{},limited:{},lastRecipe:'',lastFruit:'',penalty:0,cost:0};
 let cheap=[seed],varied=[seed];
 for(const slot of slots){
  if(!slot.count){
   const close=beam=>beam.map(item=>({...item,plan:[...item.plan,{...slot,recipe:'',fruit:''}]}));
   cheap=close(cheap);varied=close(varied);continue;
  }
  const expand=beam=>{
   const next=[];
   for(const item of beam)for(const option of options[slot.session]){
    const limitedId=catalogue.limitedWeeklyIds.find(id=>option.recipe.ingredients[id]);
    if(limitedId&&(item.limited[limitedId]||0)>=2)continue;
    const needs={...item.needs};
    for(const [id,amount] of Object.entries(option.recipe.ingredients)){
     const perChild=catalogue.condimentIds.includes(id)?Math.min(amount*scale,state.session==='both'?5:10):amount*scale;
     needs[id]=(needs[id]||0)+perChild*slot.count;
    }
    needs[option.fruit]=(needs[option.fruit]||0)+scale*slot.count;
    const cost=unitCost(needs);
    const repeats=item.recipes[option.id]||0,fruitRepeats=item.fruits[option.fruit]||0;
    const penalty=item.penalty+repeats*35+fruitRepeats*12+(item.lastRecipe===option.id?180:0)+(item.lastFruit===option.fruit?70:0);
    next.push({needs,plan:[...item.plan,{...slot,recipe:option.id,fruit:option.fruit}],recipes:{...item.recipes,[option.id]:repeats+1},families:{...item.families,[option.family]:(item.families[option.family]||0)+1},fruits:{...item.fruits,[option.fruit]:fruitRepeats+1},limited:limitedId?{...item.limited,[limitedId]:(item.limited[limitedId]||0)+1}:item.limited,lastRecipe:option.id,lastFruit:option.fruit,penalty,cost});
   }
   return next;
  };
  const candidates=expand([...new Set([...cheap,...varied])]);
  if(!candidates.length)return {status:'over',weeklyCap:budget/weeks};
  cheap=[...candidates].sort((a,b)=>a.cost-b.cost||a.penalty-b.penalty).slice(0,35);
  const varietyCost=item=>item.cost+item.penalty-Object.keys(item.recipes).length*250-Object.keys(item.families).length*450-Object.keys(item.fruits).length*100;
  varied=[...candidates].sort((a,b)=>varietyCost(a)-varietyCost(b)||a.cost-b.cost).slice(0,35);
 }
 let best=null,cheapest=null;
 for(const candidate of new Set([...cheap,...varied])){
  const days=state.days.map((day,index)=>({...day,...candidate.plan.find(p=>p.index===index&&p.session===primary)}));
  const breakfastDays=state.session==='both'?state.breakfastDays.map((day,index)=>({...day,...candidate.plan.find(p=>p.index===index&&p.session==='breakfast')})):state.breakfastDays;
  const result=calculate({...state,days,breakfastDays});
  if(!cheapest||result.total<cheapest.result.total)cheapest={days,breakfastDays,result};
  if(result.projection>budget)continue;
  const distinct=Object.keys(candidate.recipes).length;
  const fruitKinds=Object.keys(candidate.fruits).length;
  const score=Object.keys(candidate.families).length*900+distinct*250+fruitKinds*150-candidate.penalty-result.total/10;
  if(!best||score>best.score)best={status:'ok',days,breakfastDays,result,score};
 }
 if(!best)return {status:'over',weeklyCap:budget/weeks,cheapest:cheapest?.result};
 const quality=plan=>{
  const active=plan.filter(day=>day.count);
  const families=new Set(),recipes=new Set(),fruits=new Set(),veg=new Set();
  for(const day of active){
   const recipe=catalogue.recipes[day.recipe];
   families.add(Object.keys(recipe.ingredients).find(id=>!['bread','pitta','wraps','milk','spread','carrot','cucumber','pepper'].includes(id))||'toast');
   recipes.add(day.recipe);fruits.add(day.fruit);
   for(const id of ['carrot','cucumber','pepper','cherryTomatoes','sweetcorn','avocado','spinach'])if(recipe.ingredients[id])veg.add(id);
  }
  let repeats=0;
  for(let i=1;i<active.length;i++){if(active[i].recipe===active[i-1].recipe)repeats+=2;if(active[i].fruit===active[i-1].fruit)repeats++;}
  return families.size*1100+recipes.size*260+fruits.size*200+veg.size*100-repeats*120;
 };
 let score=quality([...best.days,...(state.session==='both'?best.breakfastDays:[])]);
 for(let round=0;round<3;round++){
  let improved=false;
  for(const slot of slots.filter(item=>item.count)){
   for(const option of options[slot.session]){
    const days=best.days.map(day=>({...day})),breakfastDays=(best.breakfastDays||[]).map(day=>({...day}));
    const target=slot.session==='breakfast'&&state.session==='both'?breakfastDays:days;
    target[slot.index].recipe=option.id;target[slot.index].fruit=option.fruit;
    const q=quality([...days,...(state.session==='both'?breakfastDays:[])]);
    if(q<=score)continue;
    let result;try{result=calculate({...state,days,breakfastDays});}catch{continue;}
    if(result.projection>budget)continue;
    best={status:'ok',days,breakfastDays,result,score:q};score=q;improved=true;
   }
  }
  if(!improved)break;
 }
 return best;
}
const API={calculate,generate};root.JAGPlanner=API;if(typeof module!=='undefined')module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
