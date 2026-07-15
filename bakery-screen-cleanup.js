(() => {
  const kitchenLayout={
    'Bread station':[4,22,12,18],'Pastry station':[18,19,12,18],'Cake station':[33,18,12,18],
    'Cupcake station':[47,19,12,18],'Cookie station':[61,20,11,18],'Pie station':[5,43,11,18],
    'Sandwich station':[20,43,12,18],'Coffee station':[35,42,11,18],'Tea station':[49,42,11,18],
    'Smoothie station':[63,42,10,18],'Packaging':[6,63,11,17],'Ingredient storage':[15,61,12,18],
    'Pantry':[31,61,10,18],'Refrigerator':[62,61,11,19],'Ovens':[58,27,11,23],
    'Serving table':[6,78,13,16],'Flour & Sugar Shelf':[0,49,14,29],'Butter Fridge':[58,59,12,24],
    'Fruit Basket':[44,69,12,17],'Tea & Coffee Shelf':[58,7,14,29]
  };
  const caféLayout={
    'Front counter':[28,29,22,23],'Register':[47,27,9,16],'Cake display':[12,33,17,22],
    'Bread shelves':[0,10,14,30],'Pastry case':[14,55,18,20],'Cookie shelves':[0,53,14,28],
    'Espresso machine':[47,25,10,17],'Tea and honey bar':[58,10,14,29],'Dining table':[58,58,15,22],
    'Booth seating':[49,61,17,20],'Piano':[4,72,12,18],'Kitchen door':[78,43,8,24]
  };
  function cleanIllustratedInterior(){
    const room=document.querySelector('.physical-room'),shell=room?.querySelector('.physical-shell'),stage=room?.querySelector('.physical-stage');
    if(!room||!shell||!stage||room.classList.contains('topdown-bedroom')||current==='park'||(current==='cottage'&&currentTab==='Exterior'))return;
    // The background already contains the finished furniture. Keep the DOM
    // objects solely as invisible, accessible interaction maps like Bakery.
    room.classList.add('scene-integrated-interior');
    room.classList.remove('organized-interior');
    shell.querySelector('.organized-room-decor')?.remove();
    shell.querySelector('.room-interaction-drop')?.remove();
    stage.querySelectorAll('.physical-object').forEach(object=>{
      object.dataset.overlayHit='true';
      delete object.dataset.visibleShelf;
      object.draggable=false;
      object.removeAttribute('draggable');
      delete object.dataset.roomDrag;
    });
  }
  function cleanBakeryScreen(){
    if(current!=='bakery')return;
    const room=document.querySelector('.physical-room'),shell=room?.querySelector('.physical-shell'),layout=currentTab==='Kitchen'?kitchenLayout:caféLayout;
    if(!room||!shell)return;
    room.classList.add('clean-bakery-gameplay');
    const objects=[...room.querySelectorAll('.physical-object')],saved=state.bakeryDesign?.layouts?.[`${current}|${currentTab}`]||{};
    objects.forEach((object,index)=>{
      const label=object.querySelector('.object-name'),name=label?.querySelector('span')?.textContent.trim()||label?.textContent.trim()||'',box=layout[name];
      object.dataset.overlayHit='true';
      delete object.dataset.visibleShelf;
      const id=`${label?.textContent.trim()||object.dataset.type||'furniture'}#${index}`,position=saved[id];
      if(box){const [left,top,width,height]=box;Object.assign(object.style,{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`,transform:'none'})}
      else if(position)Object.assign(object.style,{left:`${position.x}%`,top:`${position.y}%`,transform:'none'});
    });
    shell.querySelector('[data-station-guide]')?.remove();
  }
  const previous=renderRoom;renderRoom=function(){previous();cleanIllustratedInterior();cleanBakeryScreen()};
  cleanIllustratedInterior();
  cleanBakeryScreen();
})();
