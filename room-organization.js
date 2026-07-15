(() => {
  const floorTypes = new Set(['counter','checkout','table','sofa','display','bed','animal']);
  const perimeter = [
    [3,7,14,18],[19,7,14,18],[35,7,14,18],[51,7,14,18],[67,7,14,18],[83,7,14,18],
    [3,31,15,18],[3,55,15,18],[3,76,15,14],
    [82,31,15,18],[82,55,15,18],[82,76,15,14]
  ];
  const islands = [[23,38,17,18],[60,38,17,18],[23,64,17,18],[60,64,17,18]];

  function gridSlots(count) {
    const slots=[];
    const xs=[3,23,43,63,83], ys=[5,28,51,74];
    ys.forEach(y=>xs.forEach(x=>slots.push([x,y,13,14])));
    return slots.slice(0,count);
  }

  function place(object,slot,index) {
    const [left,top,width,height]=slot;
    Object.assign(object.style,{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`,right:'auto',bottom:'auto'});
    object.style.zIndex=String(20+Math.round(top+height));
    object.dataset.organizedSlot=String(index);
  }

  function addDecor(shell) {
    if(shell.querySelector('.organized-room-decor'))return;
    shell.insertAdjacentHTML('afterbegin',`<div class="organized-room-decor" aria-hidden="true"><i class="organized-beam"></i><i class="organized-garland"></i><i class="organized-rug"></i><i class="organized-lamp left"></i><i class="organized-lamp right"></i><i class="organized-flowers left"></i><i class="organized-flowers right"></i></div>`);
  }

  function organizeRoom() {
    const room=document.querySelector('.room.physical-room');
    const shell=room?.querySelector('.physical-shell');
    const stage=room?.querySelector('.physical-stage');
    if(!room||!shell||!stage||room.classList.contains('topdown-bedroom')||current==='park'||(current==='cottage'&&currentTab==='Exterior'))return;

    // Illustrated interiors already receive carefully matched hit boxes from
    // image-interactions/all-interiors.  Do not replace those positions with
    // the old generic furniture grid or add duplicate scenery over the art.
    if(stage.classList.contains('image-hit-stage')){
      room.classList.remove('organized-interior');
      room.classList.add('scene-integrated-interior');
      shell.querySelector('.organized-room-decor')?.remove();
      return;
    }
    room.classList.add('organized-interior');
    addDecor(shell);
    const objects=[...stage.querySelectorAll(':scope > .physical-object')];
    if(!objects.length)return;
    const doors=objects.filter(object=>object.dataset.type==='door');
    const furnishings=objects.filter(object=>object.dataset.type!=='door');
    if(furnishings.length>16){
      gridSlots(furnishings.length).forEach((slot,index)=>place(furnishings[index],slot,index));
    }else{
      const wallObjects=furnishings.filter(object=>!floorTypes.has(object.dataset.type));
      const floorObjects=furnishings.filter(object=>floorTypes.has(object.dataset.type));
      const wallSlots=[...perimeter].filter(slot=>!doors.length||!(slot[0]>80&&slot[1]<52)),floorSlots=[...islands];
      wallObjects.forEach((object,index)=>place(object,wallSlots.shift()||floorSlots.shift(),index));
      floorObjects.forEach((object,index)=>place(object,floorSlots.shift()||wallSlots.shift(),wallObjects.length+index));
    }
    doors.forEach((door,index)=>place(door,[89,35+index*31,8,27],furnishings.length+index));
    room.dataset.organizedCount=String(objects.length);
  }

  const previousRender=renderRoom;
  renderRoom=function(){previousRender();organizeRoom()};

  function enterCottage() {
    if(document.getElementById('location')?.classList.contains('active')&&current==='cottage')return;
    openLocation('cottage');
    setTimeout(()=>{
      currentTab='Living room';renderTabs();renderRoom();
      document.querySelectorAll('#room-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab==='Living room'));
    },760);
  }

  // The old map pin did not share the cottage interior handler used by the 3D house.
  document.getElementById('my-cottage-button')?.addEventListener('click',event=>{
    event.preventDefault();event.stopImmediatePropagation();enterCottage();
  },true);

  // Debounce scene navigation so rapid clicks cannot start overlapping room transitions.
  let navigationLocked=false;
  document.addEventListener('click',event=>{
    const navigation=event.target.closest('[data-action="home"],[data-location]');
    if(!navigation||navigationLocked)return;
    navigationLocked=true;
    document.body.classList.add('scene-transitioning');
    setTimeout(()=>{navigationLocked=false;document.body.classList.remove('scene-transitioning')},850);
  },true);

  if(document.querySelector('.room.physical-room'))organizeRoom();
})();
