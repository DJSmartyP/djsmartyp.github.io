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
 cheese: {name:'Mild cheddar cheese',pack:'400g',size:400,unit:'g',price:2.50,url:search('mild cheddar 400g'),group:'Chilled & fillings'},
 hummus: {name:'Houmous',pack:'200g',size:200,unit:'g',price:1.30,checked:true,availability:'Reference product was out of stock when researched; choose an equivalent and update price.',url:'https://www.tesco.com/groceries/en-GB/products/260083981',group:'Chilled & fillings'},
 banana: {name:'Small bananas',pack:'6 pack',size:6,unit:'bananas',price:.75,checked:true,url:'https://www.tesco.com/shop/en-GB/browse/groceries-and-essentials/fresh-food/fresh-fruit/bananas',group:'Fruit & vegetables'},
 apple: {name:'Small apples',pack:'6 pack',size:6,unit:'apples',price:1.70,url:search('apples 6 pack'),group:'Fruit & vegetables'},
 satsuma: {name:'Satsumas / easy peelers',pack:'600g, estimate 8 fruit',size:8,unit:'fruit',price:1.50,url:search('easy peelers 600g'),group:'Fruit & vegetables'},
 carrot: {name:'Carrots',pack:'1kg',size:1000,unit:'g',price:.69,checked:true,url:'https://www.tesco.com/shop/en-GB/products/305953125',group:'Fruit & vegetables'},
 cucumber: {name:'Cucumber',pack:'1 cucumber, estimate 300g usable',size:300,unit:'g',price:.99,checked:true,url:'https://www.tesco.com/shop/en-GB/products/253558972',group:'Fruit & vegetables'},
 pepper: {name:'Mixed peppers',pack:'3 pack, estimate 450g usable',size:450,unit:'g',price:1.65,url:search('mixed peppers 3 pack'),group:'Fruit & vegetables'}
};
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
const API={products,recipes,researched:'2026-10-22',feeSource:'https://www.tesco.com/help/pages/online-grocery-faqs/delivery-and-collection-basics/minimum-order-value'};
root.JAGCatalogue=API;if(typeof module!=='undefined')module.exports=API;
})(typeof globalThis!=='undefined'?globalThis:this);
