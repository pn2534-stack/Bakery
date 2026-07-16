(() => {
  const activities={
    'Cottage bed':{
      title:'Prepare for Bed',subtitle:'BEDTIME ROUTINE',scene:'bed',
      items:[['Pillow','🛏️'],['Quilt','🧺'],['Bedtime Book','📖']],
      instruction:'Drag the pillow, quilt, and bedtime book onto the bed.',
      finish:'Sleep until morning',energy:100,minutes:0
    },
    Vanity:{
      title:'Get Ready at the Vanity',subtitle:'MORNING SELF-CARE',scene:'vanity',
      items:[['Hair Brush','🪮'],['Face Cream','🫙'],['Ribbon','🎀']],
      instruction:'Drag each item to the vanity in the order you want to use it.',
      finish:'Finish getting ready',energy:4,minutes:15
    },
    'Cottage sofa':{
      title:'Make the Sofa Cozy',subtitle:'LIVING ROOM',scene:'sofa',
      items:[['Cushion','🛋️'],['Soft Blanket','🧶'],['Story Book','📕']],
      instruction:'Set up a comfortable place to relax.',
      finish:'Relax on the sofa',energy:10,minutes:20
    },
    Armchair:{
      title:'Set Up the Reading Chair',subtitle:'QUIET CORNER',scene:'armchair',
      items:[['Cushion','🟩'],['Tea Cup','☕'],['Book','📚']],
      instruction:'Drag everything into place for a peaceful reading break.',
      finish:'Sit and read',energy:8,minutes:20
    },
    'Coffee table':{
      title:'Arrange the Coffee Table',subtitle:'COZY SNACK BREAK',scene:'coffee-table',
      items:[['Table Mat','🧵'],['Tea Cup','☕'],['Berry Tart','🥧']],
      instruction:'Lay out the mat, drink, and snack on the table.',
      finish:'Enjoy the snack',energy:7,minutes:15
    },
    'Dining table':{
      title:'Set the Cottage Table',subtitle:'MEAL TIME',scene:'dining-table',
      items:[['Placemat','🟫'],['Plate','🍽️'],['Flower Vase','💐'],['Meal','🥘']],
      instruction:'Drag each place setting onto the dining table.',
      finish:'Sit down to eat',energy:12,minutes:25
    },
    Nightstand:{
      title:'Organize the Nightstand',subtitle:'BEDROOM TIDY-UP',scene:'nightstand',
      items:[['Lamp','🏮'],['Journal','📔'],['Water Glass','🥛']],
      instruction:'Place the bedtime essentials neatly on the nightstand.',
      finish:'Save arrangement',energy:3,minutes:8
    },
    Wardrobe:{
      title:'Prepare an Outfit',subtitle:'COTTAGE WARDROBE',scene:'wardrobe',
      items:[['Top','👚'],['Bottom','👖'],['Shoes','👞'],['Accessory','🎀']],
      instruction:'Drag a complete outfit onto the dressing stand.',
      finish:'Wear this outfit',energy:2,minutes:10
    },
    Fireplace:{
      title:'Build a Cozy Fire',subtitle:'FIREPLACE',scene:'fireplace',
      items:[['Firewood','🪵'],['Kindling','🌿'],['Match','🔥']],
      instruction:'Add the wood, kindling, and match to warm the room.',
      finish:'Relax by the fire',energy:10,minutes:20
    },
    Bookshelf:{
      title:'Organize the Bookshelf',subtitle:'HOME LIBRARY',scene:'bookshelf',
      items:[['Cookbook','📕'],['Storybook','📗'],['Garden Book','📘']],
      instruction:'Drag the books back onto the correct shelf.',
      finish:'Choose a book to read',energy:6,minutes:15
    },
    'Pet bed':{
      title:'Prepare the Pet Bed',subtitle:'PET CARE',scene:'pet-bed',
      items:[['Soft Blanket','🧶'],['Favorite Toy','🧸'],['Treat','🦴']],
      instruction:'Make a comfortable resting place for your companion.',
      finish:'Call your pet over',energy:4,minutes:10
    },
    'Indoor plants':{
      title:'Care for the Houseplants',subtitle:'PLANT CARE',scene:'plants',
      items:[['Watering Can','🪴'],['Plant Food','🌱'],['Soft Cloth','🧽']],
      instruction:'Water, feed, and gently clean the leaves.',
      finish:'Admire the plants',energy:4,minutes:12
    },
    Mirror:{
      title:'Polish and Use the Mirror',subtitle:'BEDROOM MIRROR',scene:'vanity',
      items:[['Soft Cloth','🧽'],['Flower Pin','🌸'],['Hand Mirror','🪞']],
      instruction:'Polish the mirror, then arrange a finishing accessory.',
      finish:'Check your outfit',energy:3,minutes:8
    },
    'Window plant':{
      title:'Tend the Window Planter',subtitle:'BEDROOM GARDEN',scene:'plants',
      items:[['Watering Can','💧'],['Plant Food','🌱'],['Flower Seeds','🌼']],
      instruction:'Drag each gardening item to the planter beneath the window.',
      finish:'Watch the flowers bloom',energy:4,minutes:10
    },
    'Kitchen|Refrigerator':{
      title:'Organize the Refrigerator',subtitle:'COTTAGE KITCHEN',scene:'wardrobe',
      items:[['Milk','🥛'],['Fresh Fruit','🍓'],['Vegetables','🥬'],['Leftovers','🥘']],
      instruction:'Drag groceries onto the refrigerator shelves.',
      finish:'Close the refrigerator',energy:2,minutes:8
    },
    'Kitchen|Sink':{
      title:'Wash the Cottage Dishes',subtitle:'KITCHEN SINK',scene:'coffee-table',
      items:[['Dish Soap','🫧'],['Cup','☕'],['Plate','🍽️'],['Tea Towel','🧻']],
      instruction:'Drag the soap and dishes to the sink, then add the towel.',
      finish:'Put away clean dishes',energy:3,minutes:10
    },
    'Kitchen|Cabinets':{
      title:'Organize the Cabinets',subtitle:'KITCHEN STORAGE',scene:'bookshelf',
      items:[['Plates','🍽️'],['Cups','☕'],['Mixing Bowls','🥣'],['Jars','🫙']],
      instruction:'Return each kitchen item to the cabinet.',
      finish:'Close the cabinets',energy:2,minutes:8
    },
    'Kitchen|Pantry':{
      title:'Restock the Pantry',subtitle:'PANTRY STORAGE',scene:'bookshelf',
      items:[['Flour Jar','🌾'],['Sugar Jar','🫙'],['Tea Tin','🍃'],['Snack Basket','🧺']],
      instruction:'Drag the pantry goods onto their shelves.',
      finish:'Finish restocking',energy:2,minutes:10
    },
    'Bathroom|Shower':{
      title:'Prepare a Cozy Shower',subtitle:'BATHROOM ROUTINE',scene:'shower',
      items:[['Soap','🧼'],['Shampoo','🧴'],['Warm Towel','🧻']],
      instruction:'Place the bath supplies by the shower.',
      finish:'Take a refreshing shower',energy:8,minutes:20
    },
    'Bathroom|Sink':{
      title:'Freshen Up at the Sink',subtitle:'BATHROOM SINK',scene:'vanity',
      items:[['Hand Soap','🧼'],['Toothbrush','🪥'],['Face Towel','🧻']],
      instruction:'Arrange the sink supplies for your morning routine.',
      finish:'Wash and freshen up',energy:5,minutes:10
    },
    'Bathroom|Toilet':{
      title:'Tidy the Bathroom Corner',subtitle:'BATHROOM CARE',scene:'nightstand',
      items:[['Cleaning Brush','🧹'],['Fresh Roll','🧻'],['Flower Spray','🌸']],
      instruction:'Drag each cleaning item into place.',
      finish:'Finish tidying',energy:2,minutes:8
    },
    'Bathroom|Towel rack':{
      title:'Arrange Fresh Towels',subtitle:'LINEN ROUTINE',scene:'wardrobe',
      items:[['Bath Towel','🧻'],['Hand Towel','🟩'],['Flower Sachet','🌼']],
      instruction:'Hang the clean towels and add a flower sachet.',
      finish:'Save towel arrangement',energy:2,minutes:6
    },
    'Exterior|Garden bench':{
      title:'Prepare the Garden Bench',subtitle:'COTTAGE GARDEN',scene:'sofa',
      items:[['Seat Cushion','🟩'],['Picnic Blanket','🧶'],['Lemonade','🥤']],
      instruction:'Set up the bench for a peaceful outdoor break.',
      finish:'Rest in the garden',energy:8,minutes:18
    },
    'Exterior|Flower garden':{
      title:'Tend the Cottage Flowers',subtitle:'FRONT GARDEN',scene:'plants',
      items:[['Seeds','🌱'],['Watering Can','💧'],['Compost','🪴']],
      instruction:'Plant, feed, and water the cottage flower bed.',
      finish:'Admire the flower garden',energy:5,minutes:15
    }
  };
  let activity=null;
  const placed=()=>activity?.placed||new Set();

  function playerMarkup(){
    return `<i class="furniture-player player-gender-${state.player?.gender==='Boy'?'boy':'girl'}"><span></span></i>`;
  }
  function render(){
    const config=activity.config,complete=placed().size===config.items.length;
    modal(`<div class="furniture-activity scene-${config.scene} ${complete?'activity-ready':''}">
      <header><small>${config.subtitle}</small><h2>${config.title}</h2><p>${config.instruction}</p></header>
      <div class="furniture-workspace">
        <aside><h3>Drag these items</h3>${config.items.map(([name,icon],index)=>`<button draggable="true" data-furniture-item="${index}" class="${placed().has(index)?'placed':''}" ${placed().has(index)?'disabled':''}><i>${icon}</i><b>${name}</b><small>${placed().has(index)?'Placed':'Drag or tap'}</small></button>`).join('')}</aside>
        <section class="furniture-scene" data-furniture-drop>
          ${playerMarkup()}<div class="furniture-model"><i></i><b>${config.title.replace(/^(Prepare|Make|Set Up|Arrange|Set|Organize|Build|Care for) /,'')}</b></div>
          <div class="placed-furniture-items">${config.items.map(([name,icon],index)=>placed().has(index)?`<span class="placed-item item-${index}" title="${name}">${icon}</span>`:'').join('')}</div>
          <output>${complete?'Everything is ready!':`${placed().size} / ${config.items.length} items placed`}</output>
        </section>
      </div>
      <button class="furniture-finish" data-furniture-finish ${complete?'':'disabled'}>${complete?config.finish:'Place every item first'}</button>
    </div>`);
  }
  function open(name,object){
    const activityKey=activities[`${currentTab}|${name}`]?`${currentTab}|${name}`:name;
    const config=activities[activityKey];if(!config)return false;
    activity={name,config,object,placed:new Set()};render();return true;
  }
  function addItem(index){
    if(!activity||!Number.isInteger(index)||!activity.config.items[index]||placed().has(index))return;
    placed().add(index);render();
    requestAnimationFrame(()=>document.querySelector(`.placed-item.item-${index}`)?.classList.add('just-placed'));
  }
  function finish(){
    if(!activity||placed().size!==activity.config.items.length)return;
    const {name,config,object}=activity,scene=document.querySelector('.furniture-scene');
    scene?.classList.add('furniture-using');
    document.querySelector('.furniture-finish')?.setAttribute('disabled','');
    setTimeout(()=>{
      if(name==='Cottage bed'){
        state.day=(state.day||1)+1;state.minute=480;state.energy=100;state.hygiene=Math.min(100,(state.hygiene||65)+5);
        state.restaurant&&(state.restaurant.open=false);state.shift&&(state.shift.active=false);
        updateHUD();save();document.getElementById('modal-wrap').hidden=true;toast('Good morning! Game saved · Energy restored');
      }else{
        state.energy=Math.min(100,(state.energy||100)+config.energy);
        state.minute=Math.min(1439,(state.minute||540)+config.minutes);
        state.furnitureActivityDays=state.furnitureActivityDays||{};
        const first=state.furnitureActivityDays[name]!==state.day;
        if(first){state.furnitureActivityDays[name]=state.day;state.xp=(state.xp||0)+5}
        if(name==='Pet bed'&&state.pet)state.pet.happiness=Math.min(100,(state.pet.happiness||50)+8);
        updateHUD();save();document.getElementById('modal-wrap').hidden=true;
        toast(`${config.finish} · Energy +${config.energy}${first?' · +5 XP':''}`);
      }
      object?.classList.add('object-in-use');setTimeout(()=>object?.classList.remove('object-in-use'),1200);
      activity=null;
    },1800);
  }

  document.addEventListener('dragstart',event=>{
    const item=event.target.closest('[data-furniture-item]');if(!item)return;
    event.dataTransfer.setData('text/furniture-item',item.dataset.furnitureItem);
    event.dataTransfer.effectAllowed='move';
  });
  document.addEventListener('dragover',event=>{
    const target=event.target.closest('[data-furniture-drop]');if(!target)return;
    event.preventDefault();target.classList.add('drag-over');
  });
  document.addEventListener('dragleave',event=>event.target.closest('[data-furniture-drop]')?.classList.remove('drag-over'));
  document.addEventListener('drop',event=>{
    const target=event.target.closest('[data-furniture-drop]');if(!target)return;
    event.preventDefault();target.classList.remove('drag-over');
    addItem(Number(event.dataTransfer.getData('text/furniture-item')));
  });
  document.addEventListener('click',event=>{
    const item=event.target.closest('[data-furniture-item]');if(item){addItem(Number(item.dataset.furnitureItem));return}
    if(event.target.closest('[data-furniture-finish]'))finish();
  },true);

  // Loaded last so these hands-on activities take priority over the older
  // instant Sit/Relax/Use handlers.
  const previousInteract=interactPhysical;
  interactPhysical=function(object){
    if(current==='cottage'){
      const name=object?.querySelector('.object-name')?.textContent.trim()||'';
      if(open(name,object))return;
    }
    previousInteract(object);
  };
})();
