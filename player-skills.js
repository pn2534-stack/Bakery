(() => {
  const definitions={service:['Customer Service','🍽️'],cleaning:['Bakery Care','🧹'],shopping:['Market Skills','🛒'],exploration:['Village Life','🗺️'],play:['Park Games','🎯']};
  function ensure(){state.playerSkills=state.playerSkills||{};Object.keys(definitions).forEach(key=>state.playerSkills[key]=Object.assign({level:1,xp:0},state.playerSkills[key]||{}))}
  ensure();
  function needed(skill){return 80+skill.level*40}
  function gain(key,amount=5){ensure();const skill=state.playerSkills[key];if(!skill||skill.level>=10)return;skill.xp+=amount;let leveled=false;while(skill.level<10&&skill.xp>=needed(skill)){skill.xp-=needed(skill);skill.level++;leveled=true}if(leveled){state.stars++;state.xp=(state.xp||0)+15;updateHUD();toast(`${definitions[key][0]} reached level ${skill.level} · +1 star`)}else save()}
  function skillCard(label,icon,skill,target=needed(skill)){const percent=skill.level>=10?100:Math.min(100,skill.xp/target*100);return`<article><i>${icon}</i><div><b>${label}</b><span>Level ${skill.level}${skill.level>=10?' · Mastered':` · ${skill.xp}/${target} XP`}</span><em><u style="width:${percent}%"></u></em></div></article>`}
  function journal(){ensure();const baking=state.bakingSkill||{xp:0,batches:0,best:0},bakingLevel=Math.min(10,1+Math.floor((baking.xp||0)/120));modal(`<div class="player-skill-journal"><small>YOUR HONEYBELL JOURNEY</small><h2>Player Skills</h2><p>Skills improve by playing: serving guests, cleaning, shopping, exploring buildings, baking, and winning park games.</p><div class="skill-journal-grid">${Object.entries(definitions).map(([key,[label,icon]])=>skillCard(label,icon,state.playerSkills[key])).join('')}${skillCard('Baking','🎂',{level:bakingLevel,xp:(baking.xp||0)%120},120)}</div><div class="baking-record"><b>${baking.batches||0}</b> batches baked <span>Best quality ${baking.best||0}%</span></div></div>`)}
  window.honeybellSkills={gain,journal};
  const previousInteract=interactPhysical;
  interactPhysical=function(object){previousInteract(object);gain('exploration',3)};
  document.addEventListener('click',event=>{
    if(event.target.closest('[data-action="skills"]')){journal();return}
    if(event.target.closest('[data-serve-restaurant]:not([disabled])'))gain('service',18);
    if(event.target.closest('[data-clean-bakery]:not([disabled])'))gain('cleaning',12);
    if(event.target.closest('[data-market-finish]'))gain('shopping',10);
  });
  save();
})();
