(() => {
  const foods=['Strawberry Cake','Biscoff Cookies','Glazed Donuts','Cake Pops','Cucumber Tea Sandwich','Lavender Tea','Vanilla Ice Cream','Blueberry Muffins'];
  const callers=['Poppy','Milo','Lily','Grandma Hazel','Juniper','Professor Maple'];
  let packing=null;
  const phone=()=>state.bakeryPhoneOrder;

  function createCall(){
    if(phone()||!state.restaurant?.open||state.minute>=1140)return;
    const item=foods[Math.floor(Math.random()*foods.length)],drink=/Tea|Ice Cream/.test(item);
    state.bakeryPhoneOrder={id:Date.now(),caller:callers[Math.floor(Math.random()*callers.length)],item,size:drink?'Medium':'Regular',status:'ringing',reward:110+Math.floor(Math.random()*80),ingredientsCollected:false};
    save();renderCallCard();
  }
  function renderCallCard(){
    document.querySelector('.bakery-incoming-call')?.remove();
    const order=phone(),shell=document.querySelector('.physical-shell');
    if(!order||!shell||current!=='bakery'||!state.restaurant?.open||order.status==='complete')return;
    const copy={
      ringing:['Incoming bakery call',`${order.caller} would like to place an order.`],
      accepted:['Phone order accepted',`Collect ingredients from the refrigerator and make ${order.size} ${order.item}.`],
      prepared:['Ready to package',`Use the Packaging station for ${order.item}.`],
      packaged:['Parcel complete',`The courier is ready to collect ${order.caller}'s order.`]
    }[order.status];
    shell.insertAdjacentHTML('beforeend',`<aside class="bakery-incoming-call status-${order.status}"><header><i>☎</i><div><small>${copy[0]}</small><b>${order.caller}</b></div><button data-phone-call-hide>×</button></header><p>${copy[1]}</p><strong>${order.size} ${order.item} · ◉ ${order.reward}</strong><div>${order.status==='ringing'?'<button data-phone-accept>Accept</button><button data-phone-decline>Decline</button>':order.status==='accepted'?'<button data-phone-cook>Make order</button>':order.status==='prepared'?'<button data-phone-package>Open packaging</button>':order.status==='packaged'?'<button data-phone-dispatch>Give to courier</button>':''}</div></aside>`);
  }
  function packageOrder(){
    const order=phone();if(!order||!['accepted','prepared'].includes(order.status))return toast('There is no phone order ready for packaging');
    if((state.stock[order.item]||0)<1)return toast(`Make ${order.item} before packaging`);
    order.status='prepared';packing={placed:new Set()};save();renderPackaging();
  }
  function renderPackaging(){
    const order=phone(),complete=packing?.placed.size===3;
    modal(`<div class="bakery-package-game ${complete?'package-ready':''}"><header><small>HONEYBELL PACKAGING STATION</small><h2>Pack ${order.caller}'s order</h2><p>Drag the food, receipt, and ribbon into the parcel.</p></header><div class="package-workspace"><aside>${[[`Prepared ${order.item}`,'🍰'],['Order receipt','🧾'],['Honeybell ribbon','🎀']].map(([name,icon],index)=>`<button draggable="true" data-pack-item="${index}" class="${packing.placed.has(index)?'placed':''}" ${packing.placed.has(index)?'disabled':''}><i>${icon}</i><b>${name}</b><small>${packing.placed.has(index)?'Packed':'Drag or tap'}</small></button>`).join('')}</aside><section data-package-box><div class="parcel-box ${complete?'closed':''}"><i></i><b>${complete?'Sealed for delivery':'Drop items here'}</b>${[...packing.placed].map(index=>`<span class="parcel-item item-${index}">${['🍰','🧾','🎀'][index]}</span>`).join('')}</div><output>${packing.placed.size} / 3 packed</output></section></div><button data-package-finish ${complete?'':'disabled'}>${complete?'Seal package':'Add every item'}</button></div>`);
  }
  function addPackageItem(index){
    if(!packing||!Number.isInteger(index)||index<0||index>2||packing.placed.has(index))return;
    packing.placed.add(index);renderPackaging();
  }
  function finishPackage(){
    const order=phone();if(!order||!packing||packing.placed.size!==3)return;
    const sizes=state.stockSizes?.[order.item]||[],wanted=sizes.indexOf(order.size),index=wanted>=0?wanted:0;
    state.stock[order.item]=Math.max(0,(state.stock[order.item]||0)-1);
    state.stockQuality?.[order.item]?.splice(index,1);state.stockSizes?.[order.item]?.splice(index,1);
    order.status='packaged';packing=null;save();document.getElementById('modal-wrap').hidden=true;renderCallCard();toast('Phone order sealed · give it to the courier');
  }
  function dispatch(){
    const order=phone();if(order?.status!=='packaged')return;
    state.coins+=order.reward;state.stars+=2;order.status='complete';updateHUD();save();renderCallCard();
    modal(`<div class="package-dispatch"><div class="courier-animation"><i>🚲</i><span>📦</span><b>🏡</b></div><small>DELIVERY COMPLETE</small><h2>${order.caller} received the order!</h2><p>+${order.reward} coins · +2 friendship stars</p></div>`);
    setTimeout(()=>{state.bakeryPhoneOrder=null;save()},2200);
  }

  const previousRender=renderRoom;
  renderRoom=function(){previousRender();setTimeout(renderCallCard,0)};
  const previousInteract=interactPhysical;
  interactPhysical=function(object){
    const name=object?.querySelector('.object-name')?.textContent.trim()||'';
    if(current==='bakery'&&currentTab==='Kitchen'&&name==='Packaging'){packageOrder();return}
    if(current==='bakery'&&currentTab==='Kitchen'&&name==='Order Refrigerator'&&phone()?.status==='accepted'){
      phone().ingredientsCollected=true;save();toast('Phone-order ingredients collected from refrigerator');renderCallCard();
    }
    previousInteract(object);
  };
  document.addEventListener('dragstart',event=>{const item=event.target.closest('[data-pack-item]');if(item)event.dataTransfer.setData('text/package-item',item.dataset.packItem)});
  document.addEventListener('dragover',event=>{if(event.target.closest('[data-package-box]'))event.preventDefault()});
  document.addEventListener('drop',event=>{if(!event.target.closest('[data-package-box]'))return;event.preventDefault();addPackageItem(Number(event.dataTransfer.getData('text/package-item')))});
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-phone-accept]')){phone().status='accepted';save();renderCallCard();return}
    if(event.target.closest('[data-phone-decline]')){state.bakeryPhoneOrder=null;save();renderCallCard();return}
    if(event.target.closest('[data-phone-call-hide]')){document.querySelector('.bakery-incoming-call')?.remove();return}
    if(event.target.closest('[data-phone-cook]')){const order=phone();window.requestedBakerySize=order.size;window.openSkillBaking?.(order.item);return}
    if(event.target.closest('[data-phone-package]')){packageOrder();return}
    if(event.target.closest('[data-phone-dispatch]')){dispatch();return}
    const item=event.target.closest('[data-pack-item]');if(item){addPackageItem(Number(item.dataset.packItem));return}
    if(event.target.closest('[data-package-finish]'))finishPackage();
  },true);
  setInterval(()=>{
    const order=phone();
    if(order?.status==='accepted'&&(state.stock[order.item]||0)>0){order.status='prepared';save();renderCallCard()}
    if(!order&&state.restaurant?.open&&state.minute<1140&&Math.random()<.18)createCall();
  },12000);
})();
