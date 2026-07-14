(() => {
  const progress=state.restaurantProgress=state.restaurantProgress||{reputation:10,upgrades:{},staff:{},unlocked:[]};
  const milestones=[
    {id:'recipe',at:15,title:'Local Favorite',icon:'🥐',reward:'Signature recipe',detail:'Honeybell Berry Danish is now available at the Pastry Station.'},
    {id:'equipment',at:30,title:'Trusted Bakery',icon:'⚙',reward:'Copper mixer & precision oven',detail:'Better equipment adds a permanent +3 baking-quality bonus.'},
    {id:'space',at:50,title:'Village Landmark',icon:'⌂',reward:'Bakery Sunroom',detail:'A new room opens for suppliers, chefs, trophies, and events.'},
    {id:'supplier',at:75,title:'Regional Name',icon:'🌾',reward:'Moonrise Farm supplier',detail:'Order discounted dairy, orchard, and rare-ingredient crates.'},
    {id:'chef',at:105,title:'Chef Destination',icon:'👩‍🍳',reward:'Visiting pastry chefs',detail:'Rotating mentors teach daily lessons and the Rose Garden Macarons recipe.'},
    {id:'competition',at:140,title:'Competition Contender',icon:'🏆',reward:'Baking competition circuit',detail:'Enter judged three-round baking challenges.'},
    {id:'festival',at:180,title:'Festival Bakery',icon:'🎪',reward:'Village festival invitations',detail:'Recurring tasting events unlock the Festival Honey Cake recipe.'},
    {id:'decoration',at:225,title:'Honeybell Icon',icon:'✦',reward:'Golden Honeybell Display',detail:'A rare animated display case appears in your café.'}
  ];
  state.reputationJourney=Object.assign({claimed:[],orders:0,perfect:0,bestDay:0,pending:[],supplierOrders:0,competitionWins:0,festivals:0},state.reputationJourney||{});
  let competition=null;
  const journey=()=>state.reputationJourney;
  const has=id=>journey().claimed.includes(id);
  const currentMilestone=()=>[...milestones].reverse().find(item=>progress.reputation>=item.at);
  const nextMilestone=()=>milestones.find(item=>progress.reputation<item.at);

  function ensureFeatures(){
    state.unlockedRecipes=state.unlockedRecipes||[];
    progress.upgrades=Object.assign({oven:0,mixer:0,fridge:0,espresso:0,prep:0,display:0},progress.upgrades||{});
    if(has('recipe')&&!state.unlockedRecipes.includes('Honeybell Berry Danish'))state.unlockedRecipes.push('Honeybell Berry Danish');
    if(has('chef')&&!state.unlockedRecipes.includes('Rose Garden Macarons'))state.unlockedRecipes.push('Rose Garden Macarons');
    if(has('festival')&&!state.unlockedRecipes.includes('Festival Honey Cake'))state.unlockedRecipes.push('Festival Honey Cake');
    if(has('equipment')){state.reputationEquipmentBonus=3;progress.upgrades.mixer=Math.max(1,progress.upgrades.mixer);progress.upgrades.oven=Math.max(1,progress.upgrades.oven)}
    if(has('space')){
      physicalRooms['bakery|Sunroom']=[['Moonrise supplier board','art','Open Supplier'],['Chef tasting table','table','Take Chef Lesson'],['Competition podium','display','Enter Competition'],['Festival invitation board','art','View Festival'],['Trophy shelves','shelf','View Reputation'],['Garden tea seating','sofa','Sit']];
      locations.bakery.rooms.Sunroom=locations.bakery.rooms.Sunroom||[];
      if(!locations.bakery.tabs.includes('Sunroom'))locations.bakery.tabs.push('Sunroom');
    }
    if(has('decoration')){if(!state.furniture.includes('Golden Honeybell Display'))state.furniture.push('Golden Honeybell Display');state.rareBakeryDecoration=true}
  }
  function grant(milestone,announce=true){
    if(has(milestone.id))return;journey().claimed.push(milestone.id);ensureFeatures();save();
    if(announce){journey().pending.push(milestone.id);setTimeout(showNextUnlock,1350)}
  }
  function check(announce=true){milestones.filter(item=>progress.reputation>=item.at&&!has(item.id)).forEach(item=>grant(item,announce));ensureFeatures();updateBadge()}
  function showNextUnlock(){
    if(!journey().pending.length)return;if(!document.getElementById('modal-wrap')?.hidden){setTimeout(showNextUnlock,1400);return}
    const id=journey().pending.shift(),item=milestones.find(entry=>entry.id===id);save();if(!item)return;
    modal(`<div class="reputation-unlock"><div>${item.icon}</div><small>REPUTATION MILESTONE · ${item.at}</small><h2>${item.title}</h2><h3>${item.reward}</h3><p>${item.detail}</p><button data-reputation-unlock-continue>See progression path</button></div>`);
  }
  function addReputation(amount,reason){const before=progress.reputation;progress.reputation=Math.max(0,before+amount);save();check(true);updateBadge();if(amount>0)toast(`Bakery reputation +${amount} · ${reason}`)}
  function recordOrder({quality,patienceRatio}){const gain=(quality>=92?4:quality>=82?3:quality>=70?2:quality>=55?1:0)+(patienceRatio>.65?1:0);journey().orders++;if(quality>=85&&patienceRatio>.55)journey().perfect++;addReputation(gain,quality>=92?'masterpiece service':quality>=82?'excellent order':'happy customer')}
  function recordMissed(){addReputation(-2,'customer left')}
  function recordDay({rating,served,perfect}){const bonus=rating===5?5:rating===4?3:rating===3?1:0;journey().bestDay=Math.max(journey().bestDay,served);if(bonus)addReputation(bonus,`${rating}-star bakery day`);state.lastReputationDay={rating,served,perfect,bonus};save()}

  function updateBadge(){
    const resources=document.querySelector('.topbar .resources');if(!resources)return;let badge=resources.querySelector('[data-reputation-hud]');
    if(!badge){badge=document.createElement('button');badge.className='reputation-hud';badge.dataset.reputationHud='true';resources.prepend(badge)}
    const next=nextMilestone();badge.innerHTML=`<span>♥</span><b>${progress.reputation}</b><small>${next?`/ ${next.at}`:'ICON'}</small>`;badge.title='Open Bakery Reputation';
  }
  function path(){
    const next=nextMilestone(),previous=currentMilestone(),start=previous?.at||0,end=next?.at||Math.max(225,progress.reputation),width=next?Math.max(0,Math.min(100,(progress.reputation-start)/(end-start)*100)):100;
    modal(`<div class="reputation-path"><header><div><small>LONG-TERM BAKERY PROGRESSION</small><h2>Bakery Reputation</h2><p>Quality, service, relationships, competitions, and festivals build your name.</p></div><div class="reputation-seal"><b>${progress.reputation}</b><span>REPUTATION</span></div></header><div class="reputation-next"><b>${next?`${next.at-progress.reputation} reputation until ${next.title}`:'Honeybell Bakery has become a village icon!'}</b><span><i style="width:${width}%"></i></span></div><div class="reputation-stats"><span><b>${journey().orders}</b>orders remembered</span><span><b>${journey().perfect}</b>perfect services</span><span><b>${journey().bestDay}</b>best daily guests</span></div><div class="milestone-road">${milestones.map(item=>`<article class="${has(item.id)?'unlocked':'locked'}"><div>${item.icon}</div><span>${item.at}</span><section><small>${has(item.id)?'UNLOCKED':'LOCKED'}</small><h3>${item.title}</h3><b>${item.reward}</b><p>${item.detail}</p>${featureButton(item)}</section></article>`).join('')}</div></div>`);
  }
  function featureButton(item){if(!has(item.id))return'';if(item.id==='space')return'<button data-reputation-sunroom>Visit Sunroom</button>';if(item.id==='supplier')return'<button data-reputation-supplier>Order ingredients</button>';if(item.id==='chef')return'<button data-reputation-chef>Take chef lesson</button>';if(item.id==='competition')return'<button data-reputation-competition>Enter competition</button>';if(item.id==='festival')return'<button data-reputation-festival>Open invitation</button>';if(item.id==='recipe')return'<button data-reputation-recipe>Bake signature recipe</button>';return''}
  function supplier(){if(!has('supplier'))return toast('Reach 75 reputation to meet Moonrise Farm');const crates=[['Dairy Morning Crate',32,{Milk:5,Eggs:5,Butter:4}],['Orchard Harvest Crate',38,{Apples:4,Peaches:4,Cherries:4}],['Rare Baker Crate',48,{Matcha:3,Vanilla:3,Honey:3,Raspberries:3}]];modal(`<div class="supplier-panel"><small>MOONRISE FARM · TRUSTED SUPPLIER</small><h2>Ingredient delivery</h2><p>Reputation contracts provide larger bundles than the village market.</p>${crates.map(([name,cost,items],index)=>`<button data-supplier-crate="${index}" data-cost="${cost}"><span>📦</span><b>${name}</b><small>${Object.entries(items).map(([key,value])=>`${key} ×${value}`).join(' · ')}</small><em>◉ ${cost}</em></button>`).join('')}</div>`)}
  function chefLesson(){if(!has('chef'))return toast('Visiting chefs arrive at 105 reputation');if(state.chefLessonDay===state.day)return toast('Today’s visiting-chef lesson is already complete');const chefs=[['Amélie','Precision pastry'],['Sora','Delicate finishing'],['Mateo','Artisan oven timing']],chef=chefs[(state.day-1)%chefs.length];state.chefLessonDay=state.day;state.bakingSkill=state.bakingSkill||{xp:0,batches:0,best:0};state.bakingSkill.xp+=30;addReputation(2,'visiting chef lesson');save();modal(`<div class="chef-lesson"><div>👩‍🍳</div><small>VISITING CHEF ${chef[0].toUpperCase()}</small><h2>${chef[1]} lesson</h2><p>You practice professional technique and delicate presentation. Today’s baking receives an additional quality bonus.</p><b>+30 Baking XP · +2 Reputation · Daily quality boost</b></div>`)}
  const competitionRounds=[['Measure precisely','steady'],['Mix and fold','gentle'],['Decorate the finale','creative']];
  function competitionStart(){if(!has('competition'))return toast('Reach 140 reputation to join competitions');competition={round:0,score:0};competitionRender()}
  function competitionRender(){const [label,best]=competitionRounds[competition.round]||[];if(!label)return competitionFinish();modal(`<div class="baking-competition"><small>HONEYBELL BAKING CIRCUIT · ROUND ${competition.round+1}/3</small><h2>${label}</h2><p>Choose your approach. Your baking skill helps every result.</p><div><button data-competition-choice="quick">⚡<b>Work quickly</b><span>Fast but risky</span></button><button data-competition-choice="${best}">✦<b>${best==='steady'?'Steady hands':best==='gentle'?'Gentle technique':'Creative flourish'}</b><span>Judges value this</span></button><button data-competition-choice="bold">♥<b>Bold style</b><span>Memorable finish</span></button></div></div>`)}
  function competitionFinish(){const skill=Math.min(12,Math.floor((state.bakingSkill?.xp||0)/120)),score=Math.min(100,competition.score+skill),won=score>=82,first=state.lastCompetitionDay!==state.day;if(first){state.lastCompetitionDay=state.day;if(won){journey().competitionWins++;addReputation(10,'competition victory');state.stars+=6}else addReputation(3,'competition appearance');updateHUD()}save();modal(`<div class="competition-result"><div>${won?'🏆':'🎗️'}</div><small>FINAL JUDGING</small><h2>${score} / 100</h2><p>${won?'Honeybell wins the golden whisk!':'The judges praise your potential. Practice and return tomorrow.'}</p><b>${first?(won?'+10 reputation · +6 stars':'+3 reputation'):'Practice round · rewards already earned today'}</b><button data-reputation-path>Return to reputation path</button></div>`)}
  function festival(){if(!has('festival'))return toast('Festival invitations begin at 180 reputation');const foods=['Festival Honey Cake','Strawberry Cake','Cinnamon Rolls','Honeybell Berry Danish'];modal(`<div class="festival-invite"><small>SEALED VILLAGE INVITATION</small><h2>Honeybell Spring Festival</h2><p>Choose one prepared specialty for the village tasting table.</p>${foods.map(food=>`<button data-festival-food="${food}" ${(state.stock[food]||0)?'':'disabled'}><span>🎪</span><b>${food}</b><em>${state.stock[food]||0} ready</em></button>`).join('')}</div>`)}
  function goSunroom(){document.getElementById('modal-wrap').hidden=true;if(current!=='bakery')openLocation('bakery');setTimeout(()=>{currentTab='Sunroom';renderTabs();renderRoom();document.querySelectorAll('#room-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab==='Sunroom'))},current==='bakery'?0:760)}
  function renderFeatures(){
    updateBadge();if(current!=='bakery')return;const shell=document.querySelector('.physical-shell');if(!shell)return;
    if(has('equipment')&&currentTab==='Kitchen')shell.insertAdjacentHTML('beforeend','<button class="reputation-equipment" data-reputation-equipment><span>⚙</span><b>Copper Precision Set</b><small>Permanent +3 quality</small></button>');
    if(has('chef')&&currentTab==='Café'&&!state.restaurant?.open){const chef=['Amélie','Sora','Mateo'][(state.day-1)%3];shell.insertAdjacentHTML('beforeend',`<button class="visiting-chef" data-reputation-chef><span>👩‍🍳</span><b>Chef ${chef}</b><small>Daily pastry lesson</small></button>`)}
    if(has('decoration')&&currentTab==='Café')shell.insertAdjacentHTML('beforeend','<button class="golden-honeybell-display" data-reputation-path><i>✦</i><b>Golden Honeybell</b></button>');
  }
  const previousRender=renderRoom;renderRoom=function(){previousRender();renderFeatures()};
  const previousInteract=interactPhysical;interactPhysical=function(object){const action=object.dataset.actionName||'';if(action==='Open Supplier')return supplier();if(action==='Take Chef Lesson')return chefLesson();if(action==='Enter Competition')return competitionStart();if(action==='View Festival')return festival();if(action==='View Reputation')return path();previousInteract(object)};

  window.bakeryReputation={recordOrder,recordMissed,recordDay,addReputation,open:path,check};
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-reputation-hud],[data-reputation-path]')){event.preventDefault();event.stopImmediatePropagation();path();return}
    if(event.target.closest('[data-action="more"]')){event.preventDefault();event.stopImmediatePropagation();path();return}
    if(event.target.closest('[data-reputation-unlock-continue]')){path();return}
    if(event.target.closest('[data-reputation-sunroom]')){goSunroom();return}
    if(event.target.closest('[data-reputation-supplier]')){supplier();return}
    if(event.target.closest('[data-reputation-chef]')){chefLesson();return}
    if(event.target.closest('[data-reputation-competition]')){competitionStart();return}
    if(event.target.closest('[data-reputation-festival]')){festival();return}
    if(event.target.closest('[data-reputation-recipe]')){window.openSkillBaking?.('Honeybell Berry Danish');return}
    const crate=event.target.closest('[data-supplier-crate]');if(crate){const choices=[[32,{Milk:5,Eggs:5,Butter:4}],[38,{Apples:4,Peaches:4,Cherries:4}],[48,{Matcha:3,Vanilla:3,Honey:3,Raspberries:3}]],entry=choices[Number(crate.dataset.supplierCrate)];if(!entry)return;if(state.coins<entry[0])return toast('Not enough coins for this supplier crate');state.coins-=entry[0];Object.entries(entry[1]).forEach(([name,count])=>state.inventory[name]=(state.inventory[name]||0)+count);journey().supplierOrders++;updateHUD();save();supplier();toast('Moonrise Farm delivery received');return}
    const choice=event.target.closest('[data-competition-choice]');if(choice&&competition){const best=competitionRounds[competition.round][1],selected=choice.dataset.competitionChoice;competition.score+=selected===best?30:selected==='bold'?24:18;competition.round++;competitionRender();return}
    const food=event.target.closest('[data-festival-food]');if(food){const name=food.dataset.festivalFood;if((state.stock[name]||0)<1)return;state.stock[name]--;const first=!state.lastFestivalDay||state.day-state.lastFestivalDay>=7;if(first){state.lastFestivalDay=state.day;journey().festivals++;state.stars+=8;addReputation(12,'festival tasting table');updateHUD()}save();modal(`<div class="festival-result"><div>🎆</div><h2>The village loved ${name}!</h2><p>${first?'+12 reputation · +8 friendship stars':'A joyful encore. The next reputation festival reward arrives in seven days.'}</p><button data-reputation-path>View progression</button></div>`);return}
  },true);

  check(false);ensureFeatures();updateBadge();if(journey().pending.length)setTimeout(showNextUnlock,1600);save();
})();
