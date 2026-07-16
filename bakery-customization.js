(() => {
  const categories = [
    {id:'walls',label:'Walls',icon:'▧',description:'Wallpaper and wall finishes',options:[['cream-plaster','Vanilla Plaster',0],['berry-floral','Berry Floral Wallpaper',85],['sage-panel','Sage Wainscoting',120]]},
    {id:'floors',label:'Floors',icon:'▦',description:'Flooring throughout the bakery',options:[['honey-oak','Honey Oak Boards',0],['cream-check','Cream Checker Tile',95],['rose-tile','Rose Terracotta',130]]},
    {id:'counters',label:'Counters',icon:'▤',description:'Front and kitchen counters',options:[['warm-oak','Warm Oak Counter',0],['blush-cream','Blush & Cream Counter',110],['sage-marble','Sage Marble Counter',160]]},
    {id:'shelves',label:'Shelves',icon:'☰',description:'Bread, cookie, and ingredient shelves',options:[['country-oak','Country Oak Shelves',0],['white-lace','White Lace Shelves',90],['greenhouse','Greenhouse Shelves',125]]},
    {id:'tables',label:'Tables',icon:'◉',description:'Dining and serving tables',options:[['round-oak','Round Oak Tables',0],['rose-cloth','Rose Tablecloths',75],['garden-tea','Garden Tea Tables',115]]},
    {id:'chairs',label:'Chairs',icon:'♧',description:'Booths and customer seating',options:[['linen-seat','Linen Seating',0],['berry-velvet','Berry Velvet Chairs',95],['sage-wicker','Sage Wicker Chairs',125]]},
    {id:'windows',label:'Windows',icon:'▣',description:'Frames, curtains, and flower boxes',options:[['sunny-arch','Sunny Arch Window',0],['lace-bow','Lace Bow Window',80],['garden-bay','Garden Bay Window',135]]},
    {id:'displayCases',label:'Display Cases',icon:'◇',description:'Cake and pastry displays',options:[['classic-glass','Classic Glass Cases',0],['pink-gold','Pink & Gold Cases',115],['botanical','Botanical Cases',145]]},
    {id:'garden',label:'Garden',icon:'✿',description:'The bakery’s outdoor planting',options:[['daisy-border','Daisy Border',0],['strawberry-patch','Strawberry Patch',90],['rose-arbor','Rose Arbor Garden',155]]},
    {id:'outdoorCafe',label:'Outdoor Café',icon:'☕',description:'Tables and shade outside the bakery',options:[['picnic-table','Picnic Table',0],['striped-parasol','Striped Parasol Café',135],['fairy-lights','Fairy-Light Terrace',190]]}
  ];
  const defaults=Object.fromEntries(categories.map(category=>[category.id,category.options[0][0]]));
  state.bakeryDesign=Object.assign({selected:{...defaults},owned:categories.map(category=>category.options[0][0]),layouts:{},purchases:0},state.bakeryDesign||{});
  state.bakeryDesign.selected=Object.assign({...defaults},state.bakeryDesign.selected||{});
  state.bakeryDesign.owned=[...new Set([...categories.map(category=>category.options[0][0]),...(state.bakeryDesign.owned||[])])];
  let activeCategory='walls',layoutMode=false,drag=null;

  const design=()=>state.bakeryDesign;
  const roomKey=()=>`${current}|${currentTab}`;
  const findOption=(categoryId,optionId)=>categories.find(category=>category.id===categoryId)?.options.find(option=>option[0]===optionId);
  const objectId=(object,index)=>`${object.querySelector('.object-name')?.textContent.trim()||object.dataset.type||'furniture'}#${index}`;

  function decorateButton(){
    if(current!=='bakery')return;
    const tabs=document.getElementById('room-tabs');
    tabs?.querySelector('[data-decorate]')?.remove();
    if(tabs&&!tabs.querySelector('[data-bakery-design]'))tabs.insertAdjacentHTML('beforeend',`<button data-bakery-design class="bakery-design-tab">✦ Design Bakery</button>`);
  }
  function restoreLayout(){
    if(current!=='bakery')return;
    const saved=design().layouts[roomKey()]||{};
    document.querySelectorAll('.physical-stage>.physical-object').forEach((object,index)=>{
      const position=saved[objectId(object,index)];if(!position)return;
      Object.assign(object.style,{left:`${position.x}%`,top:`${position.y}%`,right:'auto',bottom:'auto',zIndex:String(20+Math.round(position.y))});
    });
  }
  function applyRoomDesign(){
    if(current!=='bakery')return;
    const room=document.getElementById('room'),shell=room?.querySelector('.physical-shell');if(!room||!shell)return;
    room.classList.add('bakery-customized');
    Object.entries(design().selected).forEach(([category,value])=>room.dataset[category]=value);
    restoreLayout();decorateButton();
    if(layoutMode&&!shell.querySelector('.bakery-layout-toolbar'))shell.insertAdjacentHTML('beforeend',`<aside class="bakery-layout-toolbar"><b>Organize interactions</b><span>Drag the outlined hotspots onto the matching furniture shown in the background picture.</span><button data-finish-bakery-layout>Save & hide outlines</button></aside>`);
  }
  function renderOutdoors(){
    const board=document.getElementById('town-board'),bakery=document.querySelector('.building-bakery');if(!board||!bakery)return;
    bakery.dataset.wallStyle=design().selected.walls;
    let outdoor=board.querySelector('.bakery-owner-outdoors');
    if(!outdoor){outdoor=document.createElement('div');outdoor.className='bakery-owner-outdoors';board.appendChild(outdoor)}
    outdoor.dataset.garden=design().selected.garden;outdoor.dataset.cafe=design().selected.outdoorCafe;
    outdoor.innerHTML='<i class="owner-garden"></i><i class="owner-cafe-table one"></i><i class="owner-cafe-table two"></i><i class="owner-parasol"></i><i class="owner-lights"></i><b>YOUR BAKERY GARDEN</b>';
  }
  function optionCard(category,option){
    const [id,label,price]=option,owned=design().owned.includes(id),selected=design().selected[category.id]===id;
    return `<button class="design-option ${owned?'owned':'locked'} ${selected?'selected':''}" data-design-option="${id}" data-design-category="${category.id}"><span class="design-swatch swatch-${id}"></span><b>${label}</b><small>${selected?'Currently in use':owned?'Owned · select style':`Buy for ${price} coins`}</small><em>${selected?'✓':owned?'Use':`◉ ${price}`}</em></button>`;
  }
  function studio(){
    const category=categories.find(item=>item.id===activeCategory)||categories[0];
    modal(`<div class="bakery-design-studio"><header><div><small>HONEYBELL DESIGN STUDIO</small><h2>Make the bakery yours</h2><p>Coins: <b>${state.coins}</b> · Every selection saves automatically.</p></div><div class="design-score"><b>${design().owned.length}</b><span>styles owned</span></div></header><div class="design-studio-layout"><nav>${categories.map(item=>`<button data-design-category-tab="${item.id}" class="${item.id===category.id?'active':''}"><span>${item.icon}</span>${item.label}</button>`).join('')}</nav><main><div class="design-category-heading"><div><small>${category.label.toUpperCase()}</small><h3>${category.description}</h3></div><button data-start-bakery-layout>Organize interactions</button></div><div class="design-options">${category.options.map(option=>optionCard(category,option)).join('')}</div><div class="design-preview-note">Shelves and furniture come from the room artwork. Organize mode only aligns their invisible interaction areas, and all outlines disappear after saving.</div></main></div></div>`);
  }
  function choose(categoryId,optionId){
    const option=findOption(categoryId,optionId);if(!option)return;
    const [id,label,price]=option,owned=design().owned.includes(id);
    if(!owned){if(state.coins<price)return toast(`You need ${price-state.coins} more coins for ${label}`);state.coins-=price;design().owned.push(id);design().purchases++;state.decor=(state.decor||0)+1;updateHUD();toast(`${label} added to your design collection`)}
    design().selected[categoryId]=id;save();applyRoomDesign();renderOutdoors();studio();
  }
  function toggleLayout(enabled){
    layoutMode=enabled;document.getElementById('modal-wrap').hidden=true;
    document.getElementById('room')?.classList.toggle('bakery-layout-mode',enabled);
    if(enabled){applyRoomDesign();toast('Drag each outline onto the matching item in the background')}else{save();renderRoom();toast('Interactions organized · outlines hidden')}
  }

  function stopLayoutForNavigation(){
    if(!layoutMode)return;
    layoutMode=false;drag?.object?.classList.remove('design-dragging');drag=null;
    document.getElementById('room')?.classList.remove('bakery-layout-mode');
    document.querySelector('.bakery-layout-toolbar')?.remove();
    save();
  }

  const previousRender=renderRoom;renderRoom=function(){previousRender();applyRoomDesign()};
  const previousShowScene=showScene;showScene=function(id){previousShowScene(id);if(id==='world')renderOutdoors()};
  const previousOpenLocation=openLocation;openLocation=function(key){if(key!=='bakery')stopLayoutForNavigation();previousOpenLocation(key)};

  document.addEventListener('click',event=>{
    if(event.target.closest('[data-bakery-design]')){event.preventDefault();event.stopImmediatePropagation();if(state.restaurant?.open)return toast('Close the bakery before redecorating');studio();return}
    const tab=event.target.closest('[data-design-category-tab]');if(tab){activeCategory=tab.dataset.designCategoryTab;studio();return}
    const option=event.target.closest('[data-design-option]');if(option){choose(option.dataset.designCategory,option.dataset.designOption);return}
    if(event.target.closest('[data-start-bakery-layout]')){toggleLayout(true);return}
    if(event.target.closest('[data-finish-bakery-layout]')){event.preventDefault();event.stopImmediatePropagation();toggleLayout(false)}
  },true);
  document.addEventListener('pointerdown',event=>{
    if(!layoutMode)return;const object=event.target.closest('.bakery-customized .physical-stage>.physical-object');if(!object)return;
    event.preventDefault();event.stopImmediatePropagation();const rect=object.getBoundingClientRect();drag={object,offsetX:event.clientX-rect.left,offsetY:event.clientY-rect.top};object.classList.add('design-dragging');object.setPointerCapture?.(event.pointerId);
  },true);
  document.addEventListener('pointermove',event=>{
    if(!drag)return;event.preventDefault();const stage=drag.object.parentElement,rect=stage.getBoundingClientRect(),width=drag.object.getBoundingClientRect().width/rect.width*100,height=drag.object.getBoundingClientRect().height/rect.height*100;
    const x=Math.max(0,Math.min(100-width,(event.clientX-rect.left-drag.offsetX)/rect.width*100)),y=Math.max(0,Math.min(100-height,(event.clientY-rect.top-drag.offsetY)/rect.height*100));
    Object.assign(drag.object.style,{left:`${x}%`,top:`${y}%`,right:'auto',bottom:'auto',zIndex:String(20+Math.round(y))});
  },true);
  document.addEventListener('pointerup',event=>{
    if(!drag)return;event.preventDefault();event.stopImmediatePropagation();const objects=[...document.querySelectorAll('.physical-stage>.physical-object')],index=objects.indexOf(drag.object),id=objectId(drag.object,index);
    design().layouts[roomKey()]=design().layouts[roomKey()]||{};design().layouts[roomKey()][id]={x:parseFloat(drag.object.style.left),y:parseFloat(drag.object.style.top)};drag.object.classList.remove('design-dragging');drag=null;save();
  },true);
  document.addEventListener('click',event=>{if(layoutMode&&event.target.closest('.physical-object')){event.preventDefault();event.stopImmediatePropagation()}},true);

  renderOutdoors();save();
})();
