(() => {
  // Coordinates follow the furniture painted into the final bedroom-style
  // backgrounds. Values are percentages of the full illustrated room.
  const rooms={
    'bakery|Café':{
      'Bread shelves':[0,14,25,30],'Cookie shelves':[0,31,25,23],
      'Cake display':[0,38,27,23],'Pastry case':[44,29,14,22],
      'Front counter':[25,34,34,25],'Register':[29,36,11,16],
      'Espresso machine':[33,20,13,19],'Tea and honey bar':[66,5,14,36],
      'Dining table':[60,49,22,29],'Booth seating':[31,61,24,27],
      'Piano':[83,62,13,21],'Kitchen door':[55,9,9,32]
    },
    'bakery|Kitchen':{
      'Bread station':[0,19,12,43],'Coffee station':[12,24,21,24],
      'Tea station':[25,7,10,22],'Refrigerator':[35,11,12,31],
      'Ovens':[52,18,15,31],'Pantry':[77,10,20,36],
      'Ingredient storage':[65,22,12,23],'Cake station':[68,36,18,22],
      'Flour & Sugar Shelf':[77,10,20,36],'Butter Fridge':[35,11,12,31],
      'Fruit Basket':[57,51,13,20],'Tea & Coffee Shelf':[12,24,21,24],
      'Pastry station':[23,36,17,20],'Cupcake station':[39,34,12,20],
      'Cookie station':[51,51,14,19],'Pie station':[28,43,15,18],
      'Donut & muffin station':[34,64,15,20],'Snack station':[49,55,12,18],
      'Ice cream machine':[56,52,12,18],'Sandwich station':[52,61,14,18],
      'Smoothie station':[58,49,11,18],'Packaging':[79,61,18,27],
      'Serving table':[68,36,19,24]
    },
    'cottage|Living room':{
      'Fireplace':[8,13,23,39],'Television':[38,18,17,22],
      'Bookshelf':[57,5,18,34],'Armchair':[74,27,16,25],
      'Cottage sofa':[49,51,34,34],'Coffee table':[45,46,21,21],
      'Pet bed':[14,62,18,22],'Indoor plants':[0,35,15,35]
    },
    'cottage|Kitchen':{
      'Sink':[12,24,18,24],'Coffee machine':[25,17,11,20],
      'Refrigerator':[36,8,13,34],'Stove':[56,20,13,30],
      'Tea kettle':[58,18,9,15],'Cabinets':[71,15,22,35],
      'Pantry':[76,9,18,33],'Dining table':[55,52,29,35]
    },
    'cottage|Bedroom':{
      'Cottage bed':[9,19,23,49],'Nightstand':[30,24,9,17],
      'Wardrobe':[62,9,16,34],'Mirror':[80,15,10,19],
      'Vanity':[78,45,13,27],'Window plant':[40,18,14,14]
    },
    'cottage|Bathroom':{
      'Shower':[29,4,23,43],'Sink':[49,25,23,34],
      'Toilet':[75,39,14,29],'Towel rack':[75,18,14,20]
    },
    'park|Pavilion':{
      'Tea tables':[37,31,37,38],'Tea set':[0,18,22,33],
      'Cake stand':[81,39,17,28],'Mini games':[70,70,25,25]
    },
    'park|Gardens':{
      'Flower garden':[17,32,27,25],'Butterfly garden':[76,58,22,27],
      'Walking trail':[35,42,35,45],'Duck pond':[39,19,27,25],
      'Playground':[76,23,20,28],'Picnic blanket':[54,55,23,24],
      'Food stand':[0,46,20,28]
    }
  };

  function apply(){
    const layout=rooms[`${current}|${currentTab}`],room=document.querySelector('#room.physical-room'),stage=room?.querySelector('.physical-stage');
    if(!layout||!room||!stage)return;
    room.classList.add('aligned-picture-hotspots');
    stage.classList.add('image-hit-stage','aligned-hit-stage');
    stage.querySelectorAll(':scope > .physical-object').forEach(object=>{
      const label=object.querySelector('.object-name'),name=label?.querySelector('span')?.textContent.trim()||label?.textContent.trim()||'',box=layout[name];
      if(!box)return;
      const [left,top,width,height]=box;
      Object.assign(object.style,{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`,right:'auto',bottom:'auto',transform:'none'});
      object.dataset.overlayHit='true';
      object.classList.add('image-hit-area','aligned-hit-area');
      object.setAttribute('aria-label',`${object.dataset.actionName||'Interact'}: ${name}`);
      object.title=`${object.dataset.actionName||'Interact'} — ${name}`;
    });
  }
  const previous=renderRoom;
  renderRoom=function(){previous();apply();requestAnimationFrame(apply)};
  apply();
})();
