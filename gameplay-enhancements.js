(() => {
  state.bakeryTutorial=Object.assign({step:0,complete:false},state.bakeryTutorial||{});
  const INTRO_TUTORIAL_VERSION=2;
  state.introTutorial=Object.assign({step:0,complete:false,version:0},state.introTutorial||{});
  if(state.introTutorial.version<INTRO_TUTORIAL_VERSION)state.introTutorial={step:0,complete:false,version:INTRO_TUTORIAL_VERSION};
  let keyInteractionLocked=false;
  const tutorialSteps=[
    ['Welcome to Honeybell Bakery!','Walk to the front counter and press E or Space to open the bakery.'],
    ['Take the order','Let a customer reach the counter, then select them to add their request to the order queue.'],
    ['Gather real groceries','Open the order checklist, choose “Collect ingredients,” and enter the kitchen. Walk to every glowing pantry, fridge, fruit basket, or tea shelf and press E or Space. Watch each count change from 0/2 to 2/2.'],
    ['Prepare the recipe','Select the food or drink task in the checklist. The correct station glows. Walk to it, press E or Space, and finish every cooking step.'],
    ['Serve your customer','Collect the finished batch after cooking. It appears on the physical Serving Table in the kitchen. Click each ordered food or drink onto the tray, return to the café, then choose “Serve customer” before the 5:00 timer reaches zero.']
  ];
  const introSteps=[
    {icon:'🌸',title:'Welcome to Honeybell!',text:"I’m Poppy, your village guide. We’ll practice the important controls together. You can reopen this guide at any time.",tip:'Follow the glowing prompts—there is no time limit while exploring.'},
    {icon:'👣',title:'Walk around the village',text:'Use WASD or the arrow keys to follow the stone paths. You can also click a clear place on the ground and your baker will walk there.',tip:'Walk close to a door, villager, or object before interacting.'},
    {icon:'🚪',title:'Enter buildings',text:'Approach a cottage or shop door, then press E or Space. You may also click the door. The Cottage, Market Row, Bakery, and Willow Park are all open to explore.',tip:'Use the Village button to leave any interior.'},
    {icon:'✨',title:'Interact with the world',text:'When an object glows, press E or Space. Furniture, shelves, ovens, televisions, pets, and activity stations each have their own actions.',tip:'The object’s name and action appear when you are close enough.'},
    {icon:'🧺',title:'Shop and use your items',text:'At the market, choose a department, add groceries to your basket, and pay only at checkout. The Cleaning supplies aisle stocks spray, soap, sponges, floor cleaner, and bin bags.',tip:'Bought ingredients and supplies become available in your cottage and bakery.'},
    {icon:'🦋',title:'Relax in Willow Park',text:'Open the Park from the village map to play nine activities, including Flower Memory, Butterfly Garden, and Fairy Pattern, or enjoy the animated tea party.',tip:'Life outside the bakery is calm—explore, decorate, and make friends.'},
    {icon:'🍰',title:'Open your bakery',text:'At the front counter, accept an order. Cook both items, click the finished batches in the Serving counter, and serve before the five-minute timer ends. Use Clean store to keep the café sparkling.',tip:'Poppy’s bakery checklist will stay on screen and can be replayed with the ? button.'}
  ];

  function poppyPuppetMarkup(){
    return `<span class="tutorial-poppy-character npc-varied npc-real-3d npc-individual npc-hair-soft-bob npc-outfit-coat npc-accessory-beret npc-face-heart" aria-hidden="true" style="--npc-skin:#efb88f;--npc-skin-dark:#c4775c;--npc-hair:#a85f42;--npc-eyes:#5e7c78;--npc-outfit:#c77982;--npc-accent:#f1d3aa;--npc-shoes:#78494b"><span class="rendered-3d-puppet"><span class="puppet-ground-shadow"></span><span class="puppet-rig"><span class="puppet-hair-puff puff-left"></span><span class="puppet-hair-puff puff-right"></span><span class="puppet-head"><span class="puppet-ear ear-left"></span><span class="puppet-ear ear-right"></span><span class="puppet-hair-cap"></span><span class="puppet-fringe"></span><span class="puppet-eye eye-left"></span><span class="puppet-eye eye-right"></span><span class="puppet-nose"></span><span class="puppet-mouth"></span><span class="puppet-headband"></span><span class="puppet-hair-bow"></span><span class="npc-face-extra"><i class="npc-freckles"></i></span></span><span class="puppet-neck"></span><span class="puppet-arm arm-left"><b></b></span><span class="puppet-arm arm-right"><b></b></span><span class="puppet-torso"><span class="puppet-collar"></span><span class="puppet-bodice-bow"></span><span class="puppet-apron"></span><span class="puppet-skirt"></span></span><span class="puppet-leg leg-left"><b></b></span><span class="puppet-leg leg-right"><b></b></span></span></span></span>`;
  }

  function tutorialMarkup(){
    const step=Math.min(state.bakeryTutorial.step,tutorialSteps.length-1),[title,text]=tutorialSteps[step];
    return `<aside class="bakery-tutorial"><span class="tutorial-npc">${poppyPuppetMarkup()}</span><div><small>POPPY'S BAKERY GUIDE · ${step+1}/${tutorialSteps.length}</small><h3>${title}</h3><p>${text}</p><button data-tutorial-next>${step===tutorialSteps.length-1?'Finish tutorial':'Next tip'}</button><button data-tutorial-skip>Skip</button></div></aside>`;
  }
  function showIntroTutorial(force=false){
    if(state.introTutorial.complete&&!force)return;
    const step=Math.min(state.introTutorial.step,introSteps.length-1),guide=introSteps[step];
    const progress=introSteps.map((item,index)=>`<button type="button" class="intro-progress-step${index===step?' active':''}${index<step?' complete':''}" data-intro-jump="${index}" aria-label="Tutorial step ${index+1}: ${item.title}"><span>${index<step?'✓':item.icon}</span><small>${index+1}</small></button>`).join('');
    modal(`<div class="village-npc-tutorial"><div class="intro-poppy"><div class="intro-poppy-scene"><i class="tutorial-window"></i><i class="tutorial-dresser"></i><i class="tutorial-plant one"></i><i class="tutorial-plant two"></i>${poppyPuppetMarkup()}</div><b>Poppy</b><small>Village Guide</small></div><div class="intro-guide-copy"><div class="intro-progress">${progress}</div><small>YOUR FIRST-DAY GUIDE · ${step+1}/${introSteps.length}</small><h2><span>${guide.icon}</span>${guide.title}</h2><p>${guide.text}</p><div class="intro-tip"><b>Poppy’s tip</b><span>${guide.tip}</span></div><div class="intro-key-guide"><span><kbd>WASD</kbd> / arrows<b>Move</b></span><span><kbd>E</kbd> / Space<b>Interact</b></span><span><kbd>Mouse</kbd><b>Walk or select</b></span></div><div class="intro-guide-actions"><button data-intro-back ${step===0?'disabled':''}>← Back</button><button data-intro-next>${step===introSteps.length-1?'Begin village life':'Next step →'}</button><button data-intro-skip>Skip guide</button></div></div></div>`);
  }

  function installVillageTutorialButton(){
    const world=document.getElementById('world');
    if(world&&!world.querySelector('[data-intro-reopen]'))world.insertAdjacentHTML('beforeend','<button class="village-guide-reopen glass" data-intro-reopen aria-label="Replay Poppy’s first-day tutorial"><span>🌸</span><b>Guide</b></button>');
  }

  function addTutorial(){
    if(current!=='bakery'||!document.getElementById('location')?.classList.contains('active'))return;
    const shell=document.querySelector('.physical-shell');if(!shell)return;
    if(!state.bakeryTutorial.complete&&!shell.querySelector('.bakery-tutorial'))shell.insertAdjacentHTML('beforeend',tutorialMarkup());
    if(state.bakeryTutorial.complete&&!shell.querySelector('.tutorial-reopen'))shell.insertAdjacentHTML('beforeend','<button class="tutorial-reopen" data-tutorial-reopen>?</button>');
  }

  function prepareRegularDrag(){
    const shell=document.querySelector('.physical-shell');
    if(!shell||current==='bakery')return;
    shell.querySelectorAll('.physical-object').forEach((object,index)=>{object.draggable=true;object.dataset.roomDrag=String(index)});
    if(!shell.querySelector('.room-interaction-drop'))shell.insertAdjacentHTML('beforeend','<div class="room-interaction-drop" data-room-interaction-drop><b>Drag here</b><span>Use this object</span></div>');
  }

  function labelBakeryStations(){
    if(current!=='bakery')return;
    document.querySelectorAll('.physical-object').forEach(object=>{
      const label=object.querySelector('.object-name');if(!label)return;
      const name=label.textContent.trim(),action=object.dataset.actionName||'Interact';
      label.classList.add('always-visible-name');
      label.innerHTML=`<span>${name}</span><small>${action} · E / Space</small>`;
      object.title=`${name} — ${action}`;
      object.setAttribute('aria-label',`${name}. ${action}. Press E or Space.`);
    });
  }

  const priorRender=renderRoom;
  renderRoom=function(){priorRender();addTutorial();prepareRegularDrag();labelBakeryStations();const help=document.querySelector('.unified-room-controls span');if(help)help.textContent='Move: WASD / arrows · Interact: E or Space · Click the floor to walk';const prompt=document.getElementById('proximity-prompt');if(prompt&&!prompt.classList.contains('show'))prompt.textContent='E / Space · Interact'};

  window.addEventListener('keydown',event=>{
    if(!['e',' '].includes(event.key.toLowerCase())||event.repeat)return;
    if(!document.getElementById('location')?.classList.contains('active')||!document.getElementById('modal-wrap')?.hidden)return;
    if(event.target.matches('input,textarea,select,button'))return;
    if(keyInteractionLocked)return;
    const customer=document.querySelector('[data-accept-customer]');
    const serve=document.querySelector('[data-serve-restaurant]:not([disabled])');
    if(!customer&&!serve&&(!nearPhysical||nearPhysical.d>=18))return;
    event.preventDefault();event.stopImmediatePropagation();keyInteractionLocked=true;
    if(customer)customer.click();else if(serve)serve.click();else interactPhysical(nearPhysical.o);
    setTimeout(()=>keyInteractionLocked=false,350);
  },true);

  document.addEventListener('dragstart',event=>{
    const object=event.target.closest('.physical-object[data-room-drag]');
    if(!object||current==='bakery')return;
    event.dataTransfer.setData('application/x-honeybell-room-object',object.dataset.roomDrag);
    object.classList.add('being-dragged');
  });
  document.addEventListener('dragend',event=>event.target.closest('.physical-object')?.classList.remove('being-dragged'));
  document.addEventListener('dragover',event=>{const drop=event.target.closest('[data-room-interaction-drop]');if(drop){event.preventDefault();drop.classList.add('dragover')}});
  document.addEventListener('dragleave',event=>event.target.closest('[data-room-interaction-drop]')?.classList.remove('dragover'));
  document.addEventListener('drop',event=>{
    const drop=event.target.closest('[data-room-interaction-drop]');if(!drop)return;
    event.preventDefault();drop.classList.remove('dragover');
    const index=Number(event.dataTransfer.getData('application/x-honeybell-room-object'));
    const object=document.querySelector(`.physical-object[data-room-drag="${index}"]`);
    if(object)interactPhysical(object);
  });

  document.addEventListener('click',event=>{
    const introJump=event.target.closest('[data-intro-jump]');
    if(introJump){state.introTutorial.step=Number(introJump.dataset.introJump)||0;showIntroTutorial(true);save();return}
    if(event.target.closest('[data-intro-back]')){state.introTutorial.step=Math.max(0,state.introTutorial.step-1);showIntroTutorial(true);save();return}
    if(event.target.closest('[data-intro-reopen]')){state.introTutorial={step:0,complete:false,version:INTRO_TUTORIAL_VERSION};showIntroTutorial(true);save();return}
    if(event.target.closest('[data-intro-next]')){state.introTutorial.step++;if(state.introTutorial.step>=introSteps.length){state.introTutorial.complete=true;document.getElementById('modal-wrap').hidden=true;toast('Poppy’s bakery guide will appear inside the bakery')}else showIntroTutorial();save();return}
    if(event.target.closest('[data-intro-skip]')){state.introTutorial.complete=true;save();document.getElementById('modal-wrap').hidden=true;return}
    if(event.target.closest('[data-tutorial-next]')){
      state.bakeryTutorial.step++;
      if(state.bakeryTutorial.step>=tutorialSteps.length){state.bakeryTutorial.complete=true;state.bakeryTutorial.step=tutorialSteps.length-1;toast('Tutorial complete · Poppy will always be available from the ? button')}
      save();renderRoom();return;
    }
    if(event.target.closest('[data-tutorial-skip]')){state.bakeryTutorial.complete=true;save();renderRoom();return}
    if(event.target.closest('[data-tutorial-reopen]')){state.bakeryTutorial={step:0,complete:false};save();renderRoom()}
  });

  const previousEnterVillage=enterVillage;
  enterVillage=function(){previousEnterVillage();installVillageTutorialButton();if(!state.introTutorial.complete)setTimeout(showIntroTutorial,700)};

  installVillageTutorialButton();
  if(document.querySelector('.room.physical-room')){addTutorial();prepareRegularDrag();labelBakeryStations()}
})();
