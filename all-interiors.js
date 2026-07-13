(()=>{
  physicalRooms['park|Gardens'] = [
    ['Flower garden','plant','Arrange Flowers'],['Butterfly garden','plant','Watch Butterflies'],
    ['Walking trail','art','Take a Walk'],['Duck pond','display','Feed Ducks'],
    ['Playground','sofa','Play'],['Picnic blanket','sofa','Picnic'],['Food stand','counter','Buy Snack']
  ];

  const roomLayouts = {
    'cottage|Kitchen':{'Refrigerator':[20,14,14,34],'Stove':[46,19,13,26],'Sink':[64,18,16,25],'Cabinets':[75,22,20,28],'Dining table':[36,45,24,27],'Pantry':[88,14,11,34],'Tea kettle':[49,20,7,12],'Coffee machine':[78,21,9,15]},
    'cottage|Bedroom':{'Cottage bed':[24,22,36,42],'Nightstand':[17,34,10,22],'Wardrobe':[52,10,17,34],'Vanity':[75,22,17,28],'Mirror':[66,13,10,30],'Window plant':[4,19,17,34]},
    'cottage|Bathroom':{'Shower':[53,14,24,41],'Sink':[15,27,22,29],'Toilet':[82,42,13,28],'Towel rack':[39,31,12,24]},
    'shops|Furniture':{'Living room display':[4,24,28,27],'Bedroom display':[43,8,22,28],'Kitchen display':[67,15,22,30],'Bathroom display':[84,37,15,25],'Garden display':[0,55,25,32],'Pet furniture':[66,55,25,31]},
    'shops|Boutique':{'Women clothing':[36,34,18,26],'Men clothing':[55,35,19,25],'Shoes':[35,54,25,18],'Accessories':[8,37,20,25],'Hats':[5,29,20,22],'Jewelry':[80,43,18,24],'Changing room':[42,13,16,24],'Mirror':[22,22,11,32],'Cashier':[64,17,18,24]},
    'park|Pavilion':{'Tea tables':[42,34,31,28],'Tea set':[48,37,12,15],'Cake stand':[63,39,10,16],'Flower garden':[72,54,22,24],'Picnic area':[82,68,16,18],'Butterfly garden':[23,40,17,24],'Duck pond':[0,58,24,32],'Mini games':[75,24,15,20],'Playground':[84,17,14,24],'Food stand':[3,26,19,29]},
    'park|Gardens':{'Flower garden':[35,31,25,26],'Butterfly garden':[60,27,22,25],'Walking trail':[37,49,27,32],'Duck pond':[0,48,28,37],'Playground':[66,7,22,27],'Picnic blanket':[67,55,21,23],'Food stand':[83,34,16,28]},
    'library|Reading Hall':{'Bookshelves':[0,11,22,38],'Fireplace':[22,21,17,31],'Reading chairs':[18,37,27,25],'Study tables':[53,28,24,25],'Recipe books':[28,51,19,25],'Magazine rack':[46,49,22,26],'Tea corner':[80,57,18,27]},
    'greenhouse|Greenhouse':{'Flower beds':[5,48,25,30],'Vegetable beds':[31,40,27,29],'Herb shelves':[81,18,17,29],'Fruit trees':[0,24,18,36],'Seed cabinet':[49,11,13,25],'Watering area':[78,38,18,27]},
    'giftshop|Gift Shop':{'Greeting cards':[22,11,18,30],'Gift wrap':[73,24,22,31],'Flowers':[0,36,28,34],'Stuffed animals':[37,29,25,29],'Candles':[58,9,19,25],'Picture frames':[56,28,16,27],'Holiday gifts':[83,27,16,34]},
    'delivery|Delivery Center':{'Delivery board':[34,7,31,24],'Packages':[76,42,23,35],'Scooters':[0,49,25,31],'Reward counter':[66,25,20,27]},
    'studio|Art Studio':{'Painting counter':[0,48,24,31],'Pottery wheel':[47,21,20,25],'Craft table':[20,30,29,28],'Display gallery':[80,15,18,39]}
  };

  function applyGeneratedRoomLayout(){
    const layout=roomLayouts[`${current}|${currentTab}`],stage=document.querySelector('.physical-stage');
    if(!layout||!stage)return;
    stage.classList.add('image-hit-stage');
    stage.querySelectorAll('.physical-object').forEach(object=>{
      const name=object.querySelector('.object-name')?.textContent.trim(),box=layout[name];
      if(!box)return;
      const [left,top,width,height]=box;
      Object.assign(object.style,{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`});
      object.classList.add('image-hit-area');
      object.setAttribute('aria-label',`${object.dataset.actionName}: ${name}`);
      object.title=`${object.dataset.actionName} — ${name}`;
    });
  }

  const generatedRoomRender=renderRoom;
  renderRoom=function(){generatedRoomRender();applyGeneratedRoomLayout()};
})();
