(() => {
  const recipes={
    pancakes:{name:'Honey Pancakes',icon:'🥞',kind:'meal',needs:{Flour:2,Eggs:1,Milk:1,Honey:1},energy:12},
    soup:{name:'Creamy Pumpkin Soup',icon:'🍲',kind:'meal',needs:{Pumpkin:2,Milk:1,Butter:1},energy:14},
    toast:{name:'Strawberry Toast',icon:'🍓',kind:'meal',needs:{Flour:1,Butter:1,Strawberries:2},energy:9},
    tea:{name:'Lavender Honey Tea',icon:'🫖',kind:'tea',needs:{'Tea Leaves':1,Honey:1,Vanilla:1},energy:8},
    coffee:{name:'Creamy Cottage Coffee',icon:'☕',kind:'coffee',needs:{'Coffee Beans':1,Milk:1,Sugar:1},energy:10}
  };
  let cook={recipe:'pancakes',added:{},phase:'prep',filter:'meal'},tvChannel='garden';
  const count=name=>Number(state.inventory?.[name]||0),item=()=>recipes[cook.recipe];
  const icon=name=>/Flour/.test(name)?'🌾':/Egg/.test(name)?'🥚':/Milk/.test(name)?'🥛':/Honey/.test(name)?'🍯':/Tea|Herb|Lavender/.test(name)?'🌿':/Coffee/.test(name)?'☕':/Sugar/.test(name)?'🧂':/Butter/.test(name)?'🧈':/Strawberr/.test(name)?'🍓':/Pumpkin/.test(name)?'🎃':/Vanilla/.test(name)?'🌼':'🫙';
  const ready=()=>Object.entries(item().needs).every(([name,amount])=>(cook.added[name]||0)>=amount);
  const list=filter=>Object.entries(recipes).filter(([,value])=>!filter||value.kind===filter);

  function openCooking(filter='meal'){
    cook.filter=filter;
    if(!list(filter).some(([key])=>key===cook.recipe))cook.recipe=list(filter)[0][0];
    cook.added={};cook.phase='prep';renderCooking();
  }
  function renderCooking(){
    const food=item();
    if(cook.phase==='cooking')return modal(`<div class="home-cooking"><header><small>MY COTTAGE KITCHEN</small><h2>Cooking ${food.name}</h2></header><div class="home-cook-animation ${food.kind}"><i class="home-pan"></i><i class="home-steam one"></i><i class="home-steam two"></i><b>${food.icon}</b></div><p class="home-cook-status">Stirring, simmering, and making the kitchen smell wonderful…</p></div>`);
    if(cook.phase==='done')return modal(`<div class="home-cooking"><header><small>HOME COOKING COMPLETE</small><h2>${food.name}</h2></header><div class="home-finished-meal">${food.icon}<i></i></div><p>Your homemade ${food.name.toLowerCase()} is ready.</p><button class="home-primary" data-home-collect>Enjoy meal · Energy +${food.energy}</button></div>`);
    modal(`<div class="home-cooking"><header><small>MY COTTAGE KITCHEN</small><h2>Drag ingredients into the mixing bowl</h2><p>Use groceries already stored in your cottage pantry.</p></header><div class="home-recipe-tabs">${list(cook.filter).map(([key,value])=>`<button data-home-recipe="${key}" class="${key===cook.recipe?'active':''}">${value.icon}<b>${value.name}</b></button>`).join('')}</div><div class="home-cook-workspace"><section class="home-pantry"><h3>Pantry</h3>${Object.entries(food.needs).map(([name,amount])=>`<button draggable="true" data-home-ingredient="${name}" class="${count(name)<=0?'empty':''}"><i>${icon(name)}</i><span><b>${name}</b><small>${count(name)} available · need ${amount}</small></span></button>`).join('')}</section><section class="home-prep"><h3>${food.icon} ${food.name}</h3><div class="home-drop-bowl ${ready()?'ready':''}" data-home-bowl><i></i><b>Drop ingredients here</b><span>${Object.entries(food.needs).map(([name,amount])=>`<button data-home-remove="${name}" class="${(cook.added[name]||0)>=amount?'complete':''}">${icon(name)} ${name} ${cook.added[name]||0}/${amount}</button>`).join('')}</span></div><button class="home-primary" data-home-cook ${ready()?'':'disabled'}>${ready()?'Cook '+food.name:'Add every required ingredient'}</button><small>Tip: Ingredients can also be tapped to add them.</small></section></div></div>`);
  }
  function addIngredient(name){const needed=item().needs[name]||0,current=cook.added[name]||0;if(!needed||current>=needed)return toast(`${name} is already measured`);if(count(name)<=current)return toast(`You need more ${name} from the market`);cook.added[name]=current+1;renderCooking()}
  function cookMeal(){if(!ready())return;Object.entries(item().needs).forEach(([name,amount])=>state.inventory[name]=Math.max(0,count(name)-amount));cook.phase='cooking';renderCooking();setTimeout(()=>{if(cook.phase!=='cooking')return;cook.phase='done';state.homeMeals=state.homeMeals||{};state.homeMeals[item().name]=(state.homeMeals[item().name]||0)+1;save();renderCooking()},1800)}

  const programs={
    garden:{name:'Garden Friends',number:'01',description:'Butterflies visit a sunny flower garden.'},
    baking:{name:'The Cozy Bake-Off',number:'02',description:'A tiny baker decorates today’s berry cake.'},
    news:{name:'Honeybell News',number:'03',description:'Village events, weather, and friendly announcements.'},
    pond:{name:'Duck Pond Live',number:'04',description:'A peaceful live view from Willow Park pond.'},
    stars:{name:'Fairy Night Sky',number:'05',description:'Soft music beneath a sparkling magical sky.'}
  };
  function picture(channel){return `<div class="tv-picture program-${channel}"><i class="tv-sun"></i><i class="tv-cloud one"></i><i class="tv-cloud two"></i><i class="tv-cottage"></i><i class="tv-cake">🎂</i><i class="tv-duck one">🦆</i><i class="tv-duck two">🦆</i><i class="tv-butterfly one">🦋</i><i class="tv-butterfly two">🦋</i><i class="tv-starfield"></i><b>${programs[channel].name}</b><span>CH ${programs[channel].number} · ${programs[channel].description}</span></div>`}
  function openTV(){modal(`<div class="cottage-tv"><header><small>HONEYBELL TELEVISION</small><h2>Choose a channel</h2></header><div class="tv-console"><div class="tv-screen"><i class="tv-scan"></i>${picture(tvChannel)}</div><aside><h3>Channels</h3>${Object.entries(programs).map(([key,value])=>`<button data-tv-channel="${key}" class="${key===tvChannel?'active':''}"><span>${value.number}</span><b>${value.name}</b><small>${value.description}</small></button>`).join('')}</aside></div><div class="tv-channel-ticker"><span>NOW SHOWING · ${Object.values(programs).map(program=>program.name).join('　✦　')}　✦　</span></div></div>`)}

  function openTeaParty(){modal(`<div class="park-tea-party"><header><small>WILLOW PARK PAVILION</small><h2>Animated Tea Party</h2><p>Choose the tea, then watch your friends pour and celebrate together.</p></header><div class="park-tea-scene"><i class="tea-garland"></i><i class="tea-butterfly one">🦋</i><i class="tea-butterfly two">🦋</i><div class="tea-guest guest-one"><i></i><b>Poppy</b></div><div class="tea-guest guest-two"><i></i><b>Milo</b></div><div class="tea-table"><i class="tea-pot">🫖</i><i class="tea-cup one">☕</i><i class="tea-cup two">☕</i><i class="tea-cake">🍰</i><i class="tea-steam one"></i><i class="tea-steam two"></i></div><output data-tea-message>Choose a tea to begin.</output></div><div class="tea-choices">${['Peach Tea','Lavender Tea','Mint Tea'].map(name=>`<button data-animated-tea="${name}"><b>🍵 ${name}</b><span>${state.stock?.[name]||0} prepared</span></button>`).join('')}</div></div>`)}
  window.openParkTeaParty=openTeaParty;
  function animateTea(name){const scene=document.querySelector('.park-tea-scene');if(!scene)return;scene.classList.remove('serving');void scene.offsetWidth;scene.classList.add('serving');const message=scene.querySelector('[data-tea-message]');message.textContent=`Pouring ${name} for everyone…`;document.querySelectorAll('[data-animated-tea]').forEach(button=>button.disabled=true);if((state.stock?.[name]||0)>0)state.stock[name]--;const first=state.parkTeaPartyDay!==state.day;if(first){state.parkTeaPartyDay=state.day;state.stars+=3;updateHUD()}setTimeout(()=>{message.textContent=first?`${name} shared · Friendship +3 stars`:`Another lovely cup of ${name}`;document.querySelectorAll('[data-animated-tea]').forEach(button=>button.disabled=false);save()},2800)}

  document.addEventListener('dragstart',event=>{const card=event.target.closest('[data-home-ingredient]');if(card)event.dataTransfer.setData('text/home-ingredient',card.dataset.homeIngredient)});
  document.addEventListener('dragover',event=>{const bowl=event.target.closest('[data-home-bowl]');if(bowl){event.preventDefault();bowl.classList.add('drag-over')}});
  document.addEventListener('dragleave',event=>event.target.closest('[data-home-bowl]')?.classList.remove('drag-over'));
  document.addEventListener('drop',event=>{const bowl=event.target.closest('[data-home-bowl]');if(!bowl)return;event.preventDefault();bowl.classList.remove('drag-over');addIngredient(event.dataTransfer.getData('text/home-ingredient'))});
  document.addEventListener('click',event=>{
    const ingredient=event.target.closest('[data-home-ingredient]');if(ingredient){addIngredient(ingredient.dataset.homeIngredient);return}
    const remove=event.target.closest('[data-home-remove]');if(remove){cook.added[remove.dataset.homeRemove]=Math.max(0,(cook.added[remove.dataset.homeRemove]||0)-1);renderCooking();return}
    const recipeButton=event.target.closest('[data-home-recipe]');if(recipeButton){cook.recipe=recipeButton.dataset.homeRecipe;cook.added={};renderCooking();return}
    if(event.target.closest('[data-home-cook]')){cookMeal();return}
    if(event.target.closest('[data-home-collect]')){state.energy=Math.min(100,(state.energy||100)+item().energy);state.homeMeals[item().name]=Math.max(0,(state.homeMeals[item().name]||1)-1);save();document.getElementById('modal-wrap').hidden=true;toast(`${item().name} enjoyed · Energy +${item().energy}`);return}
    const channel=event.target.closest('[data-tv-channel]');if(channel){tvChannel=channel.dataset.tvChannel;openTV();return}
    const tea=event.target.closest('[data-animated-tea]');if(tea){animateTea(tea.dataset.animatedTea);return}
  },true);

  const previousInteract=interactPhysical;
  interactPhysical=function(object){const name=object?.querySelector('.object-name')?.textContent.trim()||'',action=object?.dataset.actionName||'';
    if(current==='cottage'&&currentTab==='Kitchen'){
      if(name==='Stove'||/Cook Meal/.test(action)){openCooking('meal');return}
      if(name==='Tea kettle'||/Make Tea/.test(action)){openCooking('tea');return}
      if(name==='Coffee machine'||/Make Coffee/.test(action)){openCooking('coffee');return}
    }
    if(current==='cottage'&&(name==='Television'||/Watch TV/.test(action))){openTV();return}
    if(current==='park'&&/Tea tables|Tea set|Cake stand/.test(name)){openTeaParty();return}
    previousInteract(object);
  };
})();
