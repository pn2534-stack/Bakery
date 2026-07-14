(() => {
  const profiles = {
    hazel: {
      name:'Grandma Hazel', role:'Sunday storyteller', icon:'🧶', color:'hazel',
      schedule:'Every Sunday', days:[6], favorites:['Cinnamon Rolls','Hazel’s Heirloom Buns'],
      order:()=>[unlocked('Hazel’s Heirloom Buns')?'Hazel’s Heirloom Buns':'Cinnamon Rolls','Peach Tea'],
      decoration:'Hazel’s Recipe Tin', recipe:'Hazel’s Heirloom Buns', keepsake:'Hazel’s Patchwork Tablecloth',
      stories:[
        'These taste like the rolls my mother baked before the whole house woke up.',
        'Hazel tells you how she learned to read recipes from flour-smudged note cards.',
        'She trusts you with the missing page from her family recipe book.',
        'The Sunday regulars gather as Hazel tells the story of Honeybell’s first bake sale.',
        'Hazel calls your bakery part of her family tradition now.'
      ]
    },
    lily: {
      name:'Lily', role:'Celebration planner', icon:'🎂', color:'lily',
      schedule:'Tuesdays & Saturdays', days:[1,5], favorites:['Strawberry Cake','Lily’s Berry Birthday Cake'],
      order:()=>[unlocked('Lily’s Berry Birthday Cake')?'Lily’s Berry Birthday Cake':'Strawberry Cake','Berry Smoothie'],
      decoration:'Strawberry Party Garland', recipe:'Lily’s Berry Birthday Cake', keepsake:'Lily’s Birthday Photo',
      stories:[
        'Lily is planning a tiny surprise party and promises not to taste the frosting early.',
        'She starts bringing a list of every villager’s favorite birthday color.',
        'Lily asks you to invent a strawberry cake that can become a Honeybell tradition.',
        'Together you host a candlelit birthday party after the bakery closes.',
        'Lily names you the village’s official keeper of happy occasions.'
      ]
    },
    maple: {
      name:'Professor Maple', role:'Tea & cookie scholar', icon:'📚', color:'maple',
      schedule:'Daily tea visit', days:[0,1,2,3,4,5,6], favorites:['Oat Honey Cookies','Professor Maple’s Tea Cookies'],
      order:()=>[unlocked('Professor Maple’s Tea Cookies')?'Professor Maple’s Tea Cookies':'Oat Honey Cookies','Lavender Tea'],
      decoration:'Antique Tea Caddy', recipe:'Professor Maple’s Tea Cookies', keepsake:'Maple’s Cookie Catalogue',
      stories:[
        'Maple records the aroma, crumb, and crunch in a very serious cookie notebook.',
        'The professor shows you a pressed tea leaf found in an old Honeybell cookbook.',
        'A rare cookie recipe is reconstructed from three faded library notes.',
        'You host a tea tasting and identify the village’s forgotten lavender blend.',
        'Maple dedicates the completed cookie catalogue to Honeybell Bakery.'
      ]
    }
  };
  const thresholds=[1,20,45,75,100];
  const levels=['New visitor','Warm acquaintance','Good friend','Dear friend','Kindred spirit'];
  const weekdays=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  state.visitorRelations=state.visitorRelations||{};
  state.unlockedRecipes=state.unlockedRecipes||[];
  state.relationshipDecorations=state.relationshipDecorations||[];
  Object.keys(profiles).forEach(id=>state.visitorRelations[id]=Object.assign({friendship:0,visits:0,lastVisitDay:0,lastOfferedDay:0,storyLevels:[]},state.visitorRelations[id]||{}));

  function unlocked(name){return state.unlockedRecipes.includes(name)}
  function levelFor(points){return thresholds.filter(value=>points>=value).length}
  function nextReward(profile,points){
    if(points<20)return `${20-points} friendship to unlock ${profile.decoration}`;
    if(points<45)return `${45-points} friendship to unlock ${profile.recipe}`;
    if(points<75)return `${75-points} friendship to unlock a story event`;
    if(points<100)return `${100-points} friendship to unlock ${profile.keepsake}`;
    return 'All friendship rewards unlocked';
  }
  function addDecoration(name){
    if(state.relationshipDecorations.includes(name))return;
    state.relationshipDecorations.push(name);
    if(!state.furniture.includes(name))state.furniture.push(name);
    state.decor=(state.decor||0)+1;
  }
  function grantRewards(id,oldPoints,newPoints){
    const profile=profiles[id],rewards=[];
    if(oldPoints<20&&newPoints>=20){addDecoration(profile.decoration);rewards.push(`Decoration: ${profile.decoration}`)}
    if(oldPoints<45&&newPoints>=45&&!unlocked(profile.recipe)){state.unlockedRecipes.push(profile.recipe);rewards.push(`Recipe: ${profile.recipe}`)}
    if(oldPoints<75&&newPoints>=75){state.stars+=12;rewards.push('12 friendship stars')}
    if(oldPoints<100&&newPoints>=100){addDecoration(profile.keepsake);rewards.push(`Keepsake: ${profile.keepsake}`)}
    return rewards;
  }
  function nextCustomer(){
    const dayIndex=(state.day-1)%7;
    const eligible=Object.entries(profiles).filter(([id,profile])=>profile.days.includes(dayIndex)&&state.visitorRelations[id].lastOfferedDay!==state.day);
    if(!eligible.length)return null;
    const [id,profile]=eligible[0],relation=state.visitorRelations[id];
    relation.lastOfferedDay=state.day;save();
    return {visitorId:id,name:profile.name,items:profile.order(),personality:{type:profile.role,icon:profile.icon,patience:220,tip:1.55,note:`Favorite order · ${profile.schedule}`},special:`Favorite order · friendship ${relation.friendship}/100`};
  }
  function completeVisit(order,quality,patienceRatio){
    if(!order.visitorId||!profiles[order.visitorId])return null;
    const id=order.visitorId,profile=profiles[id],relation=state.visitorRelations[id],old=relation.friendship;
    const favorite=order.items.some(item=>profile.favorites.includes(item));
    const gained=7+(favorite?3:0)+(quality>=85?4:quality>=70?2:0)+(patienceRatio>.5?2:0);
    relation.friendship=Math.min(100,old+gained);relation.visits++;relation.lastVisitDay=state.day;
    const rewards=grantRewards(id,old,relation.friendship),newStories=[];
    thresholds.forEach((threshold,index)=>{if(old<threshold&&relation.friendship>=threshold&&!relation.storyLevels.includes(index)){relation.storyLevels.push(index);newStories.push(index)}});
    state.pendingVisitorStory=newStories.length?{id,level:newStories.at(-1),rewards}:state.pendingVisitorStory;
    save();
    if(newStories.length)setTimeout(showPendingStory,1250);
    return {friendship:gained,rewards,payMultiplier:favorite?1.08:1,message:`+${gained} friendship`};
  }
  function missedVisit(order){if(!order?.visitorId)return;toast(`${profiles[order.visitorId].name} will visit again · friendship was not lost`)}
  function showPendingStory(){
    const event=state.pendingVisitorStory;if(!event||!profiles[event.id])return;
    const profile=profiles[event.id],relation=state.visitorRelations[event.id];state.pendingVisitorStory=null;save();
    modal(`<div class="visitor-story ${profile.color}"><div class="visitor-portrait"><span>${profile.icon}</span></div><small>FRIENDSHIP STORY · ${levels[Math.max(0,levelFor(relation.friendship)-1)].toUpperCase()}</small><h2>${profile.name}</h2><blockquote>“${profile.stories[event.level]}”</blockquote>${event.rewards.length?`<div class="visitor-rewards"><b>Unlocked</b>${event.rewards.map(reward=>`<span>✦ ${reward}</span>`).join('')}</div>`:''}<button class="relationship-primary" data-visitor-journal>Open friendship journal</button></div>`);
  }
  function nextVisit(profile){const today=(state.day-1)%7;if(profile.days.includes(today))return 'Visiting today';for(let offset=1;offset<=7;offset++)if(profile.days.includes((today+offset)%7))return offset===1?'Tomorrow':`In ${offset} days`;return profile.schedule}
  function card(id,profile){
    const relation=state.visitorRelations[id],level=levelFor(relation.friendship),hearts=Math.min(5,Math.ceil(relation.friendship/20));
    return `<article class="relationship-card ${profile.color}"><div class="relationship-avatar"><span>${profile.icon}</span></div><div class="relationship-copy"><header><div><h3>${profile.name}</h3><small>${profile.role}</small></div><b>${'♥'.repeat(hearts)}${'♡'.repeat(5-hearts)}</b></header><p>${profile.schedule} · <strong>${nextVisit(profile)}</strong></p><div class="friendship-meter"><i style="width:${relation.friendship}%"></i></div><small>${relation.friendship}/100 · ${level?levels[level-1]:levels[0]} · ${relation.visits} visits</small><p class="favorite-order">Favorite: ${profile.favorites[0]}</p><em>${relation.storyLevels.length?profile.stories[Math.min(profile.stories.length-1,relation.storyLevels.at(-1))]:'Serve their favorite to begin their story.'}</em><span class="next-reward">✦ ${nextReward(profile,relation.friendship)}</span></div></article>`;
  }
  function journal(){
    modal(`<div class="relationship-journal"><header><small>HONEYBELL VILLAGE</small><h2>Friendship Journal</h2><p>Remember favorites, meet regulars on their visiting days, and serve thoughtful high-quality orders.</p></header><div class="relationship-list">${Object.entries(profiles).map(([id,profile])=>card(id,profile)).join('')}</div><section class="relationship-unlocks"><h3>Your friendship collection</h3><span><b>${state.unlockedRecipes.length}</b> special recipes</span><span><b>${state.relationshipDecorations.length}</b> decorations & keepsakes</span><span><b>${Object.values(state.visitorRelations).reduce((sum,item)=>sum+item.storyLevels.length,0)}</b> story moments</span></section></div>`);
  }
  function schedule(){modal(`<div class="visitor-calendar"><small>SPRING · DAY ${state.day}</small><h2>Regular visitor schedule</h2><p>Open the bakery on a visitor’s day to continue their story.</p>${Object.values(profiles).map(profile=>`<div><span>${profile.icon}</span><b>${profile.name}</b><small>${profile.schedule}</small><em>${nextVisit(profile)}</em></div>`).join('')}<button class="relationship-primary" data-visitor-journal>Open friendship journal</button></div>`)}

  window.honeybellVisitors={profiles,nextCustomer,completeVisit,missedVisit,journal,schedule,showPendingStory};
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-visitor-journal]')){event.preventDefault();event.stopImmediatePropagation();journal();return}
    const friendsButton=event.target.closest('[data-action="friends"]');if(friendsButton){event.preventDefault();event.stopImmediatePropagation();journal();return}
    const calendarButton=event.target.closest('[data-action="calendar"]');if(calendarButton){event.preventDefault();event.stopImmediatePropagation();schedule()}
  },true);
  save();
})();
