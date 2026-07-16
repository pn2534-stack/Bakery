(()=>{
  const layouts = {
    'bakery|Café': {
      'Front counter':[43,34,24,25], 'Register':[57,34,8,14], 'Cake display':[18,37,17,20],
      'Bread shelves':[0,13,12,35], 'Pastry case':[28,36,18,20], 'Cookie shelves':[34,45,15,13],
      'Espresso machine':[39,20,13,17], 'Tea and honey bar':[49,15,10,22],
      'Dining table':[71,58,20,29], 'Booth seating':[87,44,13,23], 'Piano':[86,28,11,17],
      'Kitchen door':[13,18,10,30]
    },
    'bakery|Kitchen': {
      'Bread station':[36,36,20,24], 'Pastry station':[45,33,19,27], 'Cake station':[26,22,18,22],
      'Cupcake station':[0,57,18,25], 'Cookie station':[76,50,20,23], 'Pie station':[7,56,16,23],
      'Sandwich station':[76,28,18,22], 'Coffee station':[63,16,16,23], 'Tea station':[80,8,17,18],
      'Smoothie station':[87,24,12,23], 'Packaging':[60,72,22,20], 'Ingredient storage':[17,10,14,24],
      'Pantry':[78,5,20,18], 'Refrigerator':[43,8,12,24], 'Ovens':[0,17,16,44], 'Serving table':[82,45,17,20]
    },
    'cottage|Exterior': {
      'Front door':[42,37,13,28], 'Garden bench':[81,50,13,20], 'Mailbox':[56,71,10,19],
      'Flower garden':[64,54,28,31]
    },
    'cottage|Living room': {
      'Cottage sofa':[65,34,28,27], 'Armchair':[17,58,16,25], 'Coffee table':[56,56,18,19],
      'Fireplace':[36,22,14,32], 'Television':[54,24,13,21], 'Bookshelf':[88,18,11,39],
      'Indoor plants':[3,32,20,38], 'Pet bed':[35,72,15,17]
    },
    'shops|Market': {
      'Shopping carts':[80,54,19,31], 'Fresh produce':[3,27,20,39], 'Milk and eggs':[41,10,13,25],
      'Flour and sugar':[7,5,17,22], 'Chocolate':[84,9,14,22], 'Tea and coffee':[64,4,18,20],
      'Frozen foods':[32,14,14,22], 'Bakery supplies':[69,15,18,22], 'Cleaning supplies':[86,31,13,26],
      'Decorations':[73,62,16,19], 'Checkout':[65,42,20,27]
    },
    'shops|Pet shop': {
      'Dogs':[5,39,20,28], 'Cats':[27,31,18,28], 'Birds':[43,5,15,23],
      'Rabbits':[63,31,17,22], 'Hamsters':[67,51,14,18], 'Fish tanks':[85,34,13,27],
      'Pet toys':[43,57,16,18], 'Pet beds':[62,5,17,24], 'Pet food':[76,68,16,19],
      'Pet clothing':[24,6,17,24], 'Play area':[27,53,16,19]
    }
  };

  function applyImageHitAreas(){
    const layout = layouts[`${current}|${currentTab}`];
    const stage = document.querySelector('.physical-stage');
    if(!layout || !stage) return;
    stage.classList.add('image-hit-stage');
    stage.querySelectorAll('.physical-object').forEach((object)=>{
      const name = object.querySelector('.object-name')?.textContent.trim();
      const box = layout[name];
      if(!box) return;
      const [left,top,width,height] = box;
      Object.assign(object.style, {
        left:`${left}%`, top:`${top}%`, width:`${width}%`, height:`${height}%`
      });
      object.classList.add('image-hit-area');
      object.setAttribute('aria-label', `${object.dataset.actionName}: ${name}`);
      object.title = `${object.dataset.actionName} — ${name}`;
    });
  }

  const imageRoomRender = renderRoom;
  renderRoom = function(){
    imageRoomRender();
    applyImageHitAreas();
  };

  document.addEventListener('pointerdown', event=>{
    const hit = event.target.closest('.image-hit-area');
    if(!hit) return;
    document.querySelectorAll('.image-hit-area.touching').forEach(el=>el.classList.remove('touching'));
    hit.classList.add('touching');
    setTimeout(()=>hit.classList.remove('touching'),700);
  });
})();
