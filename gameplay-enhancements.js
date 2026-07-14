(() => {
  state.bakeryTutorial=Object.assign({step:0,complete:false},state.bakeryTutorial||{});
  state.introTutorial=Object.assign({step:0,complete:false},state.introTutorial||{});
  let keyInteractionLocked=false;
  const tutorialSteps=[
    ['Welcome to Honeybell Bakery!','Walk to the front counter and press E or Space to open the bakery.'],
    ['Take the order','Let a customer reach the counter, then select them to add their request to the order queue.'],
    ['Gather real groceries','Open the order checklist, choose “Collect ingredients,” and enter the kitchen. Walk to every glowing pantry, fridge, fruit basket, or tea shelf and press E or Space. Watch each count change from 0/2 to 2/2.'],
    ['Prepare the recipe','Select the food or drink task in the checklist. The correct station glows. Walk to it, press E or Space, and finish every cooking step.'],
    ['Serve your customer','When both checklist items show ✓, choose “Return and serve now.” Go back to the café and press E or Space near the customer before the 3:00 timer reaches zero.']
  ];
  const introSteps=[
    ['Welcome to Honeybell!','I’m Poppy. I’ll show you how village life works, and you can replay the bakery guide whenever you need it.'],
    ['Walk around','Use WASD or the arrow keys. You can also click a clear spot on the path to walk there.'],
    ['Visit the village','Walk to a building and select its door. Shops and homes are relaxed simulation spaces where you can browse, buy, decorate, and make friends.'],
    ['Run your bakery','Enter Honeybell Bakery when you are ready. Press E or Space at the front counter, accept a customer, collect groceries, prepare both items, and serve within three minutes.']
  ];

  function tutorialMarkup(){
    const step=Math.min(state.bakeryTutorial.step,tutorialSteps.length-1),[title,text]=tutorialSteps[step];
    return `<aside class="bakery-tutorial"><span class="tutorial-npc"><span class="tutorial-npc-head"></span><span class="tutorial-npc-body"></span></span><div><small>POPPY'S BAKERY GUIDE · ${step+1}/${tutorialSteps.length}</small><h3>${title}</h3><p>${text}</p><button data-tutorial-next>${step===tutorialSteps.length-1?'Finish tutorial':'Next tip'}</button><button data-tutorial-skip>Skip</button></div></aside>`;
  }
  function showIntroTutorial(){
    if(state.introTutorial.complete)return;
    const step=Math.min(state.introTutorial.step,introSteps.length-1),[title,text]=introSteps[step];
    modal(`<div class="village-npc-tutorial"><div class="intro-poppy"><i></i><b>Poppy</b></div><div><small>YOUR FIRST-DAY GUIDE · ${step+1}/${introSteps.length}</small><h2>${title}</h2><p>${text}</p><div class="intro-key-guide"><span>WASD / arrows<b>Move</b></span><span>E / Space<b>Interact</b></span><span>Mouse<b>Walk or select</b></span></div><button data-intro-next>${step===introSteps.length-1?'Begin village life':'Next'}</button><button data-intro-skip>Skip guide</button></div></div>`);
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
  enterVillage=function(){previousEnterVillage();if(!state.introTutorial.complete)setTimeout(showIntroTutorial,700)};

  if(document.querySelector('.room.physical-room')){addTutorial();prepareRegularDrag();labelBakeryStations()}
})();
