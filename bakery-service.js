(() => {
  const orderFoods=['White Bread','Croissant','Strawberry Cake','Cookies','Latte','Peach Tea','Berry Smoothie','Apple Pie','Blueberry Muffins','Cinnamon Rolls','Lemon Cupcakes','Chocolate Cake','Oat Honey Cookies','Hot Chocolate','Vanilla Frappe','Peach Smoothie','Spiced Apple Cider','Caramel Latte'];
  state.pendingOrder=state.pendingOrder||null;
  state.stockQuality=state.stockQuality||{};

  function qualityLabel(score){return score>=94?'Masterpiece':score>=84?'Excellent':score>=70?'Lovely':score>=55?'Good':'Rustic'}
  function nextQuality(item,consume=false){const queue=state.stockQuality[item]||[];return queue.length?(consume?queue.shift():queue[0]):60}
  function activeTab(name){document.querySelectorAll('#room-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab===name))}
  function newOrder(){const guest=state.npcs[Math.floor(Math.random()*state.npcs.length)];state.pendingOrder={guest:guest.name,item:orderFoods[Math.floor(Math.random()*orderFoods.length)],status:'arriving'};save()}
  function startCounterShift(){if(!state.shift.active)state.shift={active:true,served:0,earned:0,rating:5};if(!state.pendingOrder)newOrder();state.minute=Math.max(state.minute,480);save();renderRoom()}
  function goToRoom(name){currentTab=name;renderTabs();renderRoom();activeTab(name)}
  function serveOrder(){
    const order=state.pendingOrder;if(!order)return;
    if((state.stock[order.item]||0)<1){toast(`Cook ${order.item} in the kitchen first`);return}
    state.stock[order.item]--;
    const quality=nextQuality(order.item,true),base=55+Math.floor(Math.random()*46),pay=Math.round(base*(.72+quality/145));
    state.coins+=pay;state.shift.earned+=pay;state.shift.served++;state.shift.rating=Math.max(1,Math.min(5,(state.shift.rating||5)+(quality-65)/180));state.minute+=20;updateHUD();save();
    document.querySelector('.service-customer')?.classList.add('leaving');
    toast(`${order.guest} loved the ${qualityLabel(quality).toLowerCase()} ${order.item} · +${pay} coins`);
    setTimeout(()=>{state.pendingOrder=null;newOrder();if(current==='bakery'&&currentTab==='Café')renderRoom()},900);
  }
  function closeCounterShift(){state.shift.active=false;state.pendingOrder=null;save();toast(`Bakery closed · ${state.shift.served} customers served`);renderRoom()}

  function renderServiceLayer(){
    const shell=document.querySelector('.physical-shell');if(!shell||current!=='bakery'||!state.shift.active)return;
    if(!state.pendingOrder)newOrder();
    if(currentTab==='Café'){
      const currentOrder=state.pendingOrder,available=state.stock[currentOrder.item]||0,quality=nextQuality(currentOrder.item);
      document.querySelector('.physical-player')?.classList.add('counter-baker');
      shell.insertAdjacentHTML('beforeend',`<div class="service-customer"><div class="order-bubble">${currentOrder.status==='arriving'?`${currentOrder.guest} is ready to order`:`${currentOrder.guest} wants<br><b>${currentOrder.item}</b>`}</div></div><aside class="bakery-service-hud"><h3>Counter shift</h3><div class="service-stats"><span><b>${state.shift.served}</b><br>served</span><span><b>◉ ${state.shift.earned}</b><br>earned</span><span><b>${available}</b><br>in stock</span></div>${currentOrder.status==='arriving'?'<button class="service-button" data-service-take>Take order</button>':`<p>Order ticket: <b>${currentOrder.item}</b></p>${available?`<p class="service-quality">Next item: <b>${qualityLabel(quality)} · ${quality}%</b></p>`:''}<button class="service-button" data-service-serve ${available?'':'disabled'}>Serve finished food</button><button class="service-button secondary" data-service-kitchen>Go cook in kitchen</button>`}<button class="service-button secondary" data-service-close>Close shift</button></aside>`);
    }else if(currentTab==='Kitchen'){
      const currentOrder=state.pendingOrder,ready=(state.stock[currentOrder.item]||0)>0,quality=nextQuality(currentOrder.item);
      shell.insertAdjacentHTML('beforeend',`<aside class="kitchen-order-ticket"><h3>Active order</h3><p>${currentOrder.guest} is waiting for <b>${currentOrder.item}</b>.</p><p class="${ready?'order-ready':'order-needed'}">${ready?`${qualityLabel(quality)} quality is ready to serve.`:'Cook and collect this recipe before returning.'}</p><button class="service-button" data-service-return>Return to counter</button></aside>`);
    }
  }

  const serviceRender=renderRoom;renderRoom=function(){serviceRender();renderServiceLayer()};
  const serviceInteract=interactPhysical;interactPhysical=function(element){if(current==='bakery'&&currentTab==='Café'&&['Open bakery','Start Shift'].includes(element.dataset.actionName)){startCounterShift();return}serviceInteract(element)};
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-service-take]')){state.pendingOrder.status='waiting';save();renderRoom()}
    if(event.target.closest('[data-service-kitchen]'))goToRoom('Kitchen');
    if(event.target.closest('[data-service-return]'))goToRoom('Café');
    if(event.target.closest('[data-service-serve]'))serveOrder();
    if(event.target.closest('[data-service-close]'))closeCounterShift();
  });
})();
