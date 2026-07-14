(()=>{
  const ingredientInfo={Flour:[8,'🌾'],Eggs:[6,'🥚'],Milk:[7,'🥛'],Sugar:[5,'🍚'],Butter:[9,'🧈'],Honey:[10,'🍯'],Strawberries:[12,'🍓'],Apples:[10,'🍎'],Blueberries:[13,'🫐'],Peaches:[12,'🍑'],Lemons:[9,'🍋'],Chocolate:[14,'🍫'],Cocoa:[12,'🟤'],Cinnamon:[8,'🧂'],Vanilla:[14,'🌼'],Cream:[10,'🥛'],Yogurt:[9,'🥣'],Oats:[7,'🌾'],Nuts:[13,'🥜'],Caramel:[15,'🍮'],'Tea Leaves':[10,'🍃'],'Coffee Beans':[12,'☕']};
  const aisles={
    'Fresh produce':['Strawberries','Apples','Blueberries','Peaches','Lemons'],
    'Milk and eggs':['Eggs','Milk','Butter','Cream','Yogurt'],
    'Flour and sugar':['Flour','Sugar','Oats'],
    'Chocolate':['Chocolate','Cocoa','Caramel','Vanilla'],
    'Tea and coffee':['Tea Leaves','Coffee Beans','Honey','Cinnamon'],
    'Frozen foods':['Strawberries','Blueberries','Cream','Yogurt'],
    'Bakery supplies':['Nuts','Cinnamon','Vanilla','Caramel'],
    'Cleaning supplies':[],
    'Decorations':[]
  };
  state.marketCart=Array.isArray(state.marketCart)?state.marketCart:[];
  let activeAisle='Fresh produce',scanReady=false;
  const total=()=>state.marketCart.reduce((sum,item)=>sum+item.price,0);
  function updateCartHud(){const count=document.querySelector('[data-market-cart-count]'),cost=document.querySelector('[data-market-cart-total]');if(count)count.textContent=state.marketCart.length;if(cost)cost.textContent=total()}
  function renderAisle(name){
    activeAisle=name;const names=aisles[name]||[];
    modal(`<div class="drag-shop"><div class="drag-shop-head market-section-note"><div><h2>${name}</h2><p>Only ingredients stocked in this market section are shown.</p></div><span class="drag-tip">CART: ${state.marketCart.length}</span></div><div class="drag-store-layout"><div class="drag-store-stock">${names.length?names.map(ingredient=>{const [price,icon]=ingredientInfo[ingredient];return `<button class="drag-product" draggable="true" data-market-item="${ingredient}"><span class="product-icon">${icon}</span><b>${ingredient}</b><small>${name}</small><span>◉ ${price}</span></button>`}).join(''):'<div class="market-no-items">This aisle has household goods,<br>but no bakery ingredients.</div>'}</div><aside class="shop-basket" data-market-basket><h3>Market cart</h3>${state.marketCart.length?state.marketCart.map((item,index)=>`<div class="basket-line"><span>${item.icon}</span><b>${item.name}</b><small>◉ ${item.price}</small><button data-market-remove="${index}" aria-label="Remove">×</button></div>`).join(''):'<div class="basket-empty">Drag or tap ingredients<br>to place them in the cart.</div>'}<div class="basket-total"><b>Saved for checkout</b><b>◉ ${total()}</b></div><button class="market-return" data-market-close>Keep shopping in the store</button></aside></div></div>`);
  }
  function addIngredient(name){const [price,icon]=ingredientInfo[name];state.marketCart.push({name,price,icon});save();renderAisle(activeAisle);updateCartHud()}
  function showCart(){modal(`<div class="market-scan-panel"><h2>Your market cart</h2><p class="sub">Items stay in your cart until you walk to the checkout counter.</p><div class="market-checkout-list">${state.marketCart.length?state.marketCart.map((item,index)=>`<div class="market-checkout-row"><span>${item.icon}</span><b>${item.name}</b><span>◉ ${item.price}</span><button data-market-remove="${index}">×</button></div>`).join(''):'<div class="basket-empty">Your cart is empty.</div>'}</div><div class="basket-total"><b>Cart total</b><b>◉ ${total()}</b></div><button class="market-return" data-market-close>Return to aisles</button></div>`)}
  function showCheckout(){
    if(!state.marketCart.length){toast('Your market cart is empty');return}
    scanReady=false;modal(`<div class="market-scan-panel"><h2>Market checkout</h2><p>${state.marketCart.length} items · Total ◉ ${total()}</p><div class="market-checkout-list">${state.marketCart.map(item=>`<div class="market-checkout-row"><span>${item.icon}</span><b>${item.name}</b><span>◉ ${item.price}</span></div>`).join('')}</div><div class="checkout-progress" data-market-progress><i></i></div><button class="store-checkout" data-market-scan>Load groceries onto the checkout</button><button class="market-return" data-market-close>Return without paying</button></div>`)
  }
  function beginScan(){const button=document.querySelector('[data-market-scan]'),progress=document.querySelector('[data-market-progress]');if(!button||scanReady)return;button.disabled=true;button.textContent='Scanning and packing… 10 seconds';progress?.classList.add('running');setTimeout(()=>{const live=document.querySelector('[data-market-scan]');if(live){scanReady=true;live.disabled=false;live.textContent='Finish and pay';live.dataset.marketFinish='true';delete live.dataset.marketScan}},10000)}
  function finishCheckout(){const cost=total();if(state.coins<cost){toast('Not enough coins for these groceries');return}state.coins-=cost;state.marketCart.forEach(item=>state.inventory[item.name]=(state.inventory[item.name]||0)+5);const count=state.marketCart.length;state.marketCart=[];scanReady=false;updateHUD();save();document.getElementById('modal-wrap').hidden=true;updateCartHud();toast(`${count} groceries purchased and packed`)}

  document.addEventListener('dragstart',event=>{const product=event.target.closest('[data-market-item]');if(product)event.dataTransfer.setData('application/x-market-ingredient',product.dataset.marketItem)});
  document.addEventListener('dragover',event=>{const basket=event.target.closest('[data-market-basket]');if(basket){event.preventDefault();basket.classList.add('dragover')}});
  document.addEventListener('dragleave',event=>event.target.closest('[data-market-basket]')?.classList.remove('dragover'));
  document.addEventListener('drop',event=>{const basket=event.target.closest('[data-market-basket]');if(!basket)return;event.preventDefault();basket.classList.remove('dragover');const name=event.dataTransfer.getData('application/x-market-ingredient');if(ingredientInfo[name])addIngredient(name)});
  document.addEventListener('click',event=>{const product=event.target.closest('[data-market-item]');if(product){addIngredient(product.dataset.marketItem);return}const remove=event.target.closest('[data-market-remove]');if(remove){state.marketCart.splice(Number(remove.dataset.marketRemove),1);save();document.querySelector('.drag-shop')?renderAisle(activeAisle):showCart();return}if(event.target.closest('[data-market-close]'))document.getElementById('modal-wrap').hidden=true;if(event.target.closest('[data-market-scan]'))beginScan();if(event.target.closest('[data-market-finish]'))finishCheckout()});

  const marketRender=renderRoom;renderRoom=function(){marketRender();if(current==='shops'&&currentTab==='Market')document.querySelector('.physical-shell')?.insertAdjacentHTML('beforeend',`<aside class="market-cart-hud">🛒 <b data-market-cart-count>${state.marketCart.length}</b> items · ◉ <span data-market-cart-total>${total()}</span><br><small>Pay only at the checkout counter</small></aside>`)};
  const marketInteract=interactPhysical;interactPhysical=function(el){if(current==='shops'&&currentTab==='Market'){const name=el.querySelector('.object-name')?.textContent.trim(),action=el.dataset.actionName;if(action==='Checkout'){showCheckout();return}if(name==='Shopping carts'){showCart();return}renderAisle(name);return}marketInteract(el)};
})();
