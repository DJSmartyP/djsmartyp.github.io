(function(root){
const search = q => 'https://www.tesco.com/groceries/en-GB/search?query='+encodeURIComponent(q);
const products = {
 bread: {name:'Wholemeal sliced bread',pack:'800g loaf, about 20 slices',size:20,unit:'slices',price:.75,checked:true,url:'https://www.tesco.com/shop/en-GB/products/299425783',group:'Bread & cereals'},
 pitta: {name:'Wholemeal pitta bread',pack:'6 pittas',size:6,unit:'pittas',price:.80,url:search('wholemeal pitta'),group:'Bread & cereals'},
 wraps: {name:'Wholemeal tortilla wraps',pack:'8 wraps',size:8,unit:'wraps',price:1.20,url:search('wholemeal tortilla wraps'),group:'Bread & cereals'},
 oats: {name:'Plain porridge oats',pack:'1kg',size:1000,unit:'g',price:1.30,url:search('porridge oats 1kg'),group:'Bread & cereals'},
 flakes: {name:'Low/no added sugar corn flakes',pack:'500g',size:500,unit:'g',price:.95,url:search('corn flakes 500g'),group:'Bread & cereals'},
 milk: {name:'Semi-skimmed milk',pack:'4 pints / 2,272ml',size:2272,unit:'ml',price:1.65,checked:true,url:'https://www.tesco.com/shop/en-GB/products/254656543',group:'Chilled & fillings'},
 spread: {name:'Light margarine / spread',pack:'500g',size:500,unit:'g',price:1.50,url:search('light spread 500g'),group:'Chilled & fillings'},
 chicken: {name:'Tesco roast chicken slices',pack:'180g',size:180,unit:'g',price:3.75,checked:true,url:'https://www.tesco.com/shop/en-GB/products/295014849',group:'Chilled & fillings'},
 cheese: {name:'Grated cheddar cheese',pack:'400g',size:400,unit:'g',price:2.50,url:search('grated cheddar 400g'),group:'Chilled & fillings'},
 hummus: {name:'Houmous',pack:'200g',size:200,unit:'g',price:1.30,checked:true,availability:'Reference product was out of stock when researched; choose an equivalent and update price.',url:'https://www.tesco.com/groceries/en-GB/products/260083981',group:'Chilled & fillings'},
 banana: {name:'Small bananas',pack:'6 pack',size:6,unit:'bananas',price:.75,checked:true,url:'https://www.tesco.com/shop/en-GB/browse/groceries-and-essentials/fresh-food/fresh-fruit/bananas',group:'Fruit & vegetables'},
 apple: {name:'Small apples',pack:'6 pack',size:6,unit:'apples',price:1.70,url:search('apples 6 pack'),group:'Fruit & vegetables'},
 satsuma: {name:'Satsumas / easy peelers',pack:'600g, estimate 8 fruit',size:8,unit:'fruit',price:1.50,url:search('easy peelers 600g'),group:'Fruit & vegetables'},
 carrot: {name:'Carrots',pack:'1kg',size:1000,unit:'g',price:.69,checked:true,url:'https://www.tesco.com/shop/en-GB/products/305953125',group:'Fruit & vegetables'},
 cucumber: {name:'Cucumber',pack:'1 cucumber, estimate 300g usable',size:300,unit:'g',price:.99,checked:true,url:'https://www.tesco.com/shop/en-GB/products/253558972',group:'Fruit & vegetables'},
 pepper: {name:'Mixed peppers',pack:'3 pack, estimate 450g usable',size:450,unit:'g',price:1.65,url:search('mixed peppers 3 pack'),group:'Fruit & vegetables'}
};
// The supplied JAG sheet is an ingredient approval list, not a priced product list.
// These additional pack sizes and prices are editable planning allowances.
Object.assign(products, {
 ham:{name:'Ham slices',pack:'150g',size:150,unit:'g',price:2.50,url:search('ham slices 150g'),group:'Proteins & alternatives'},
 quornHam:{name:'Quorn ham slices',pack:'150g',size:150,unit:'g',price:2.75,url:search('Quorn ham slices'),group:'Proteins & alternatives'},
 veganSmokyHam:{name:'Quorn vegan smoky ham-free slices',pack:'150g',size:150,unit:'g',price:2.75,url:search('vegan smoky ham free slices'),group:'Proteins & alternatives'},
 veganChicken:{name:'Quorn vegan chicken-free slices',pack:'150g',size:150,unit:'g',price:2.75,url:search('vegan chicken free slices'),group:'Proteins & alternatives'},
 tuna:{name:'Canned tuna',pack:'145g drained',size:145,unit:'g',price:1.30,url:search('canned tuna 145g'),group:'Proteins & alternatives'},
 chickpeas:{name:'Chickpeas for mashing',pack:'240g drained',size:240,unit:'g',price:.65,url:search('chickpeas tin'),group:'Proteins & alternatives'},
 plantTuna:{name:'Plant-based tuna',pack:'100g',size:100,unit:'g',price:2.50,url:search('plant based tuna'),group:'Proteins & alternatives'},
 yogurt:{name:'Lower/no added sugar yoghurt',pack:'500g',size:500,unit:'g',price:1.60,url:search('no added sugar plain yogurt 500g'),group:'Dairy & alternatives'},
 greekYogurt:{name:'Greek yoghurt',pack:'500g',size:500,unit:'g',price:1.75,url:search('greek yogurt 500g'),group:'Dairy & alternatives'},
 fromage:{name:'Plain lower-fat fromage frais',pack:'500g',size:500,unit:'g',price:1.80,url:search('plain fromage frais 500g'),group:'Dairy & alternatives'},
 plantYogurt:{name:'Soya/coconut-based yoghurt',pack:'400g',size:400,unit:'g',price:2.00,url:search('soya coconut yogurt 400g'),group:'Dairy & alternatives'},
 cheeseSlices:{name:'Cheddar cheese slices',pack:'200g',size:200,unit:'g',price:2.25,url:search('cheddar cheese slices 200g'),group:'Dairy & alternatives'},
 dairyFreeCheeseSlices:{name:'Dairy-free cheese slices',pack:'200g',size:200,unit:'g',price:2.50,url:search('dairy free cheese slices'),group:'Dairy & alternatives'},
 dairyFreeCheese:{name:'Dairy-free grated cheese',pack:'200g',size:200,unit:'g',price:2.50,url:search('dairy free grated cheese'),group:'Dairy & alternatives'},
 soyMilk:{name:'Calcium-fortified soya milk',pack:'1 litre',size:1000,unit:'ml',price:1.50,url:search('calcium fortified soya milk 1l'),group:'Dairy & alternatives'},
 oatMilk:{name:'Calcium-fortified oat milk',pack:'1 litre',size:1000,unit:'ml',price:1.50,url:search('calcium fortified oat milk 1l'),group:'Dairy & alternatives'},
 tzatziki:{name:'Tzatziki',pack:'200g',size:200,unit:'g',price:1.60,url:search('tzatziki 200g'),group:'Spreads & dips'},
 lightMayo:{name:'Light mayonnaise',pack:'400g',size:400,unit:'g',price:1.80,url:search('light mayonnaise 400g'),group:'Spreads & dips'},
 veganMayo:{name:'Vegan mayonnaise',pack:'250g',size:250,unit:'g',price:2.00,url:search('vegan mayonnaise'),group:'Spreads & dips'},
 tomatoPuree:{name:'Tomato purée',pack:'200g',size:200,unit:'g',price:.65,url:search('tomato puree 200g'),group:'Spreads & dips'},
 cheeseSpread:{name:'Cheese spread',pack:'200g',size:200,unit:'g',price:1.65,url:search('cheese spread 200g'),group:'Spreads & dips'},
 dairyFreeCheeseSpread:{name:'Dairy-free cheese spread',pack:'200g',size:200,unit:'g',price:2.25,url:search('dairy free cheese spread'),group:'Spreads & dips'},
 dairyFreeSpread:{name:'Dairy-free buttery spread',pack:'500g',size:500,unit:'g',price:2.00,url:search('dairy free buttery spread'),group:'Spreads & dips'},
 cucumberYogurtDip:{name:'Soya/coconut yoghurt & cucumber dip',pack:'400g yoghurt',size:400,unit:'g',price:2.00,url:search('soya plain yogurt'),group:'Spreads & dips'},
 jam:{name:'Low-sugar jam',pack:'340g',size:340,unit:'g',price:1.50,url:search('low sugar jam'),group:'Spreads & dips'},
 honey:{name:'Honey',pack:'340g',size:340,unit:'g',price:2.50,url:search('honey 340g'),group:'Spreads & dips'},
 riceCrispies:{name:'Rice crispies',pack:'500g',size:500,unit:'g',price:1.50,url:search('rice crispies 500g'),group:'Bread & cereals'},
 weetabix:{name:'Weetabix',pack:'24 biscuits',size:24,unit:'biscuits',price:3.00,url:search('Weetabix 24'),group:'Bread & cereals'},
 shreddedWheat:{name:'Shredded wheat',pack:'16 biscuits',size:16,unit:'biscuits',price:2.75,url:search('shredded wheat'),group:'Bread & cereals'},
 glutenFreeCereal:{name:'Gluten-free low/no sugar cereal',pack:'400g',size:400,unit:'g',price:2.50,url:search('gluten free low sugar cereal'),group:'Bread & cereals'},
 muffins:{name:'Wholemeal muffins',pack:'4 muffins',size:4,unit:'muffins',price:1.50,url:search('wholemeal breakfast muffins'),group:'Bread & cereals'},
 naan:{name:'Wholemeal naan bread',pack:'4 naan',size:4,unit:'naan',price:1.75,url:search('wholemeal naan bread'),group:'Bread & cereals'},
 bagels:{name:'Wholemeal bagels',pack:'5 bagels',size:5,unit:'bagels',price:1.60,url:search('wholemeal bagels'),group:'Bread & cereals'},
 maltLoaf:{name:'Malt loaf',pack:'10 slices',size:10,unit:'slices',price:1.50,url:search('malt loaf'),group:'Bread & cereals'},
 fruitBread:{name:'Fruit bread',pack:'10 slices',size:10,unit:'slices',price:1.70,url:search('fruit bread'),group:'Bread & cereals'},
 glutenFreeBread:{name:'Gluten-free sliced bread',pack:'12 slices',size:12,unit:'slices',price:2.50,url:search('gluten free sliced bread'),group:'Bread & cereals'},
 grapes:{name:'Grapes',pack:'500g, about 10 portions',size:10,unit:'portions',price:2.00,url:search('grapes 500g'),group:'Fruit & vegetables'},
 plums:{name:'Plums',pack:'6 pack',size:6,unit:'plums',price:1.75,url:search('plums 6 pack'),group:'Fruit & vegetables'},
 orange:{name:'Oranges',pack:'6 pack',size:6,unit:'oranges',price:1.75,url:search('oranges 6 pack'),group:'Fruit & vegetables'},
 melon:{name:'Melon',pack:'1 melon, about 8 portions',size:8,unit:'portions',price:2.00,url:search('melon'),group:'Fruit & vegetables'},
 pear:{name:'Pears',pack:'6 pack',size:6,unit:'pears',price:1.75,url:search('pears 6 pack'),group:'Fruit & vegetables'},
 clementine:{name:'Clementines',pack:'8 fruit',size:8,unit:'fruit',price:1.75,url:search('clementines'),group:'Fruit & vegetables'},
 strawberry:{name:'Strawberries, fresh or frozen',pack:'400g, about 8 portions',size:8,unit:'portions',price:2.50,url:search('strawberries 400g'),group:'Fruit & vegetables'},
 pineapple:{name:'Pineapple',pack:'1 fruit, about 8 portions',size:8,unit:'portions',price:2.00,url:search('pineapple'),group:'Fruit & vegetables'},
 mango:{name:'Mango',pack:'1 fruit, about 5 portions',size:5,unit:'portions',price:1.50,url:search('mango'),group:'Fruit & vegetables'},
 peach:{name:'Peaches',pack:'6 pack',size:6,unit:'peaches',price:2.00,url:search('peaches'),group:'Fruit & vegetables'},
 blueberry:{name:'Blueberries',pack:'150g, about 5 portions',size:5,unit:'portions',price:2.00,url:search('blueberries 150g'),group:'Fruit & vegetables'},
 blackberry:{name:'Blackberries, fresh or frozen',pack:'300g, about 8 portions',size:8,unit:'portions',price:2.50,url:search('blackberries 300g'),group:'Fruit & vegetables'},
 raspberry:{name:'Raspberries, fresh or frozen',pack:'300g, about 8 portions',size:8,unit:'portions',price:2.50,url:search('raspberries 300g'),group:'Fruit & vegetables'},
 cherryTomatoes:{name:'Cherry tomatoes',pack:'300g',size:300,unit:'g',price:1.30,url:search('cherry tomatoes 300g'),group:'Fruit & vegetables'},
 sweetcorn:{name:'Sweetcorn',pack:'340g drained',size:340,unit:'g',price:.85,url:search('sweetcorn tin'),group:'Fruit & vegetables'},
 avocado:{name:'Avocado',pack:'2 fruit, about 250g usable',size:250,unit:'g',price:1.80,url:search('avocado 2 pack'),group:'Fruit & vegetables'},
 spinach:{name:'Spinach',pack:'240g',size:240,unit:'g',price:1.50,url:search('spinach 240g'),group:'Fruit & vegetables'}
});
const recipes = {
 toast: {name:'Toast',session:'breakfast',ingredients:{bread:2,spread:5}},
 dryToast: {name:'Plain toast',session:'breakfast',ingredients:{bread:2}},
 cerealOnly: {name:'Corn flakes',session:'breakfast',ingredients:{flakes:25,milk:150}},
 porridgeOnly: {name:'Porridge',session:'breakfast',ingredients:{oats:25,milk:150}},
 cereal: {name:'Corn flakes & toast',session:'breakfast',ingredients:{flakes:25,milk:150,bread:1,spread:5}},
 porridge: {name:'Porridge & toast',session:'breakfast',ingredients:{oats:25,milk:150,bread:1,spread:5}},
 chickenSandwich: {name:'Chicken sandwiches & crunch sticks',session:'after',ingredients:{bread:2,chicken:25,carrot:20,cucumber:20}},
 cheesePitta: {name:'Cheese pitta pockets & crunch sticks',session:'after',ingredients:{pitta:.5,cheese:20,carrot:20,cucumber:20}},
 hummusWrap: {name:'Houmous wraps & pepper sticks',session:'after',ingredients:{wraps:.5,hummus:10,carrot:20,pepper:20}},
 chickenWrap: {name:'Chicken wraps & crunch sticks',session:'after',ingredients:{wraps:.5,chicken:25,carrot:20,cucumber:20}},
 cheeseToast: {name:'Cheese toast bites & crunch sticks',session:'after',ingredients:{bread:2,cheese:20,carrot:20,cucumber:20}},
 hummusPitta: {name:'Pitta strips, houmous & vegetables',session:'after',ingredients:{pitta:.5,hummus:10,carrot:20,cucumber:20}}
};
for(const [key,base] of Object.entries({sandwich:{bread:2},pitta:{pitta:.5},wrap:{wraps:.5}})){
 for(const [f,portion] of [['chicken',25],['cheese',20],['hummus',10]]){
  for(const [v,portionV] of [['carrot',40],['cucumber',40],['pepper',40]]){
   recipes[key+'_'+f+'_'+v]={name:products[f].name.replace('Tesco roast ','')+' '+key+' with '+products[v].name.toLowerCase(),session:'after',ingredients:{...base,[f]:portion,[v]:portionV}};
  }
 }
}
for(const [id,label] of Object.entries({ham:'Ham',quornHam:'Quorn ham',veganSmokyHam:'Vegan smoky ham-free',veganChicken:'Vegan chicken-free',tuna:'Tuna',chickpeas:'Mashed chickpea',plantTuna:'Plant-based tuna',cheeseSlices:'Cheddar cheese slice',dairyFreeCheeseSlices:'Dairy-free cheese slice',dairyFreeCheese:'Dairy-free grated cheese'})){
 recipes[id+'Sandwich']={name:label+' sandwich with cucumber',session:'after',ingredients:{bread:2,[id]:25,cucumber:35}};
}
for(const [id,label] of Object.entries({riceCrispies:'Rice crispies',weetabix:'Weetabix',shreddedWheat:'Shredded wheat',glutenFreeCereal:'Gluten-free cereal'})){
 recipes[id+'Bowl']={name:label+' with milk',session:'breakfast',ingredients:{[id]:id==='weetabix'||id==='shreddedWheat'?2:25,milk:150}};
}
for(const [id,label] of Object.entries({soyMilk:'soya milk',oatMilk:'oat milk'})){
 recipes[id+'Cereal']={name:'Corn flakes with '+label,session:'breakfast',ingredients:{flakes:25,[id]:150}};
}
for(const [id,label] of Object.entries({yogurt:'Yoghurt',greekYogurt:'Greek yoghurt',fromage:'Fromage frais',plantYogurt:'Plant-based yoghurt'})){
 recipes[id+'Bowl']={name:label+' bowl',session:'breakfast',ingredients:{[id]:100,oats:20}};
}
for(const [id,label] of Object.entries({muffins:'Muffin',naan:'Naan',bagels:'Bagel',maltLoaf:'Malt loaf',fruitBread:'Fruit bread',glutenFreeBread:'Gluten-free toast'})){
 recipes[id+'Breakfast']={name:label+' with spread',session:'breakfast',ingredients:{[id]:id==='maltLoaf'||id==='fruitBread'||id==='glutenFreeBread'?2:1,spread:5}};
}
recipes.dairyFreeSpreadToast={name:'Toast with dairy-free spread',session:'breakfast',ingredients:{bread:2,dairyFreeSpread:5}};
recipes.jamToast={name:'Toast with low-sugar jam',session:'breakfast',ingredients:{bread:2,jam:5}};
recipes.honeyToast={name:'Toast with honey',session:'breakfast',ingredients:{bread:2,honey:5}};
recipes.tzatzikiPitta={name:'Pitta and vegetable sticks with tzatziki',session:'after',ingredients:{pitta:.5,carrot:30,tzatziki:10}};
recipes.cucumberYogurtPitta={name:'Pitta and vegetable sticks with yoghurt dip',session:'after',ingredients:{pitta:.5,carrot:30,cucumber:5,cucumberYogurtDip:10}};
recipes.lightMayoSandwich={name:'Cheese and cucumber sandwich with light mayo',session:'after',ingredients:{bread:2,cheeseSlices:20,cucumber:20,lightMayo:5}};
recipes.veganMayoSandwich={name:'Chickpea and cucumber sandwich with vegan mayo',session:'after',ingredients:{bread:2,chickpeas:30,cucumber:20,veganMayo:5}};
recipes.tomatoPitta={name:'Tomato and cheese pitta pizza',session:'after',ingredients:{pitta:.5,tomatoPuree:5,cheese:20}};
recipes.cheeseSpreadSandwich={name:'Cheese spread and cucumber sandwich',session:'after',ingredients:{bread:2,cheeseSpread:15,cucumber:20}};
recipes.dairyFreeCheeseSpreadSandwich={name:'Dairy-free cheese spread sandwich',session:'after',ingredients:{bread:2,dairyFreeCheeseSpread:15,cucumber:20}};
for(const [id,label] of Object.entries({cherryTomatoes:'cherry tomatoes',sweetcorn:'sweetcorn',avocado:'avocado',spinach:'spinach'})){
 recipes[id+'Pitta']={name:'Houmous pitta with '+label,session:'after',ingredients:{pitta:.5,hummus:10,[id]:35}};
}
const fruitIds=['banana','apple','satsuma','grapes','plums','orange','melon','pear','clementine','strawberry','pineapple','mango','peach','blueberry','blackberry','raspberry'];
const condimentIds=['hummus','spread','tzatziki','lightMayo','veganMayo','tomatoPuree','cheeseSpread','dairyFreeCheeseSpread','dairyFreeSpread','cucumberYogurtDip','jam','honey'];
const limitedWeeklyIds=['jam','honey'];
const API={products,recipes,fruitIds,condimentIds,limitedWeeklyIds,researched:'2026-10-22',feeSource:'https://www.tesco.com/help/pages/online-grocery-faqs/delivery-and-collection-basics/minimum-order-value'};
root.JAGCatalogue=API;if(typeof module!=='undefined')module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
