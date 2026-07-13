(()=>{
  const storeItems={
    market:[['Flour',8,'🌾'],['Eggs',6,'🥚'],['Milk',7,'🥛'],['Sugar',5,'🍚'],['Butter',9,'🧈'],['Honey',10,'🍯'],['Strawberries',12,'🍓'],['Apples',10,'🍎'],['Blueberries',13,'🫐'],['Peaches',12,'🍑'],['Lemons',9,'🍋'],['Chocolate',14,'🍫'],['Cocoa',12,'🟤'],['Cinnamon',8,'🧂'],['Vanilla',14,'🌼'],['Cream',10,'🥛'],['Yogurt',9,'🥣'],['Oats',7,'🌾'],['Nuts',13,'🥜'],['Caramel',15,'🍮'],['Tea Leaves',10,'🍃'],['Coffee Beans',12,'☕']],
    pets:[['White Rabbit',250,'🐇'],['Hamster',300,'🐹'],['Budgie',400,'🐦'],['Orange Cat',750,'🐈'],['Beagle',850,'🐕'],['Golden Retriever',1500,'🦮']],
    furniture:[['Wooden Chair',80,'🪑'],['Simple Rug',150,'🧶'],['Small Lamp',220,'💡'],['Tea Table',450,'🫖'],['Cottage Sofa',600,'🛋️'],['Fireplace',850,'🔥']],
    boutique:[['Floral Dress',180,'👗'],['Linen Overalls',165,'🥖'],['Cottage Boots',120,'🥾'],['Straw Hat',90,'👒'],['Ribbon Set',65,'🎀'],['Round Glasses',85,'👓']],
    gifts:[['Greeting Card',20,'💌'],['Wrapped Flowers',55,'💐'],['Stuffed Bear',90,'🧸'],['Cottage Candle',45,'🕯️'],['Picture Frame',70,'🖼️'],['Holiday Gift',120,'🎁']]
  };
  const titles={market:'Village Market',pets:'Cottage Pet Shop',furniture:'Furniture Showroom',boutique:'Cottage Boutique',gifts:'Petal & Parcel Gift Shop'};
  let basket=[],activeStore='market';

  function renderDragStore(kind=activeStore){
    activeStore=kind;
    const items=storeItems[kind];
    modal(`<div class="drag-shop"><div class="drag-shop-head"><div><h2>${titles[kind]}</h2><p>Coins: ${state.coins} · Drag or tap items into your basket.</p></div><span class="drag-tip">DRAG & DROP SHOPPING</span></div><div class="drag-store-layout"><div class="drag-store-stock">${items.map((item,index)=>`<button class="drag-product" draggable="true" data-store-item="${index}" data-store-kind="${kind}"><span class="product-icon">${item[2]}</span><b>${item[0]}</b><small>${kind==='pets'?'Adoption profile':'In stock'}</small><span>◉ ${item[1]}</span></button>`).join('')}</div><aside class="shop-basket" data-shop-basket><h3>${kind==='pets'?'Adoption basket':'Shopping basket'}</h3><div data-basket-lines>${basket.length?basket.map((entry,index)=>`<div class="basket-line"><span>${entry.item[2]}</span><b>${entry.item[0]}</b><small>◉ ${entry.item[1]}</small><button data-remove-basket="${index}" aria-label="Remove">×</button></div>`).join(''):'<div class="basket-empty">Drag a product here<br>or tap one to add it.</div>'}</div><div class="basket-total"><b>Total</b><b>◉ ${basket.reduce((sum,x)=>sum+x.item[1],0)}</b></div><button class="store-checkout" data-store-checkout ${basket.length?'':'disabled'}>${kind==='pets'?'Complete adoption':'Buy basket'}</button></aside></div></div>`);
  }

  function addItem(kind,index){
    if(kind!==activeStore){basket=[];activeStore=kind}
    basket.push({kind,item:storeItems[kind][index]});
    renderDragStore(kind);
  }

  function checkout(){
    const total=basket.reduce((sum,x)=>sum+x.item[1],0);
    if(!basket.length)return;
    if(state.coins<total){toast('Not enough coins for this basket');return}
    state.coins-=total;
    basket.forEach(({kind,item})=>{
      if(kind==='market')state.inventory[item[0]]=(state.inventory[item[0]]||0)+5;
      else if(kind==='pets')state.pet={name:item[0],happiness:50,icon:item[2]};
      else if(kind==='furniture'){state.furniture.push(item[0]);state.decor++}
      else state.inventory[item[0]]=(state.inventory[item[0]]||0)+1;
    });
    const count=basket.length;basket=[];updateHUD();save();document.getElementById('modal-wrap').hidden=true;toast(`${count} item${count===1?'':'s'} collected`);
  }

  document.addEventListener('dragstart',event=>{const item=event.target.closest('[data-store-item]');if(item)event.dataTransfer.setData('application/x-honeybell-item',`${item.dataset.storeKind}|${item.dataset.storeItem}`)});
  document.addEventListener('dragover',event=>{const basketEl=event.target.closest('[data-shop-basket]');if(basketEl){event.preventDefault();basketEl.classList.add('dragover')}});
  document.addEventListener('dragleave',event=>event.target.closest('[data-shop-basket]')?.classList.remove('dragover'));
  document.addEventListener('drop',event=>{const basketEl=event.target.closest('[data-shop-basket]');if(!basketEl)return;event.preventDefault();const data=event.dataTransfer.getData('application/x-honeybell-item').split('|');basketEl.classList.remove('dragover');if(data.length===2)addItem(data[0],Number(data[1]))});
  document.addEventListener('click',event=>{const item=event.target.closest('[data-store-item]');if(item){addItem(item.dataset.storeKind,Number(item.dataset.storeItem));return}const remove=event.target.closest('[data-remove-basket]');if(remove){basket.splice(Number(remove.dataset.removeBasket),1);renderDragStore();return}if(event.target.closest('[data-store-checkout]'))checkout()});

  const storeInteract=interactPhysical;
  interactPhysical=function(el){
    if(current==='shops'){
      const kind=currentTab==='Market'?'market':currentTab==='Pet shop'?'pets':currentTab==='Furniture'?'furniture':'boutique';
      basket=[];renderDragStore(kind);return;
    }
    if(current==='giftshop'){basket=[];renderDragStore('gifts');return}
    storeInteract(el);
  };
})();
