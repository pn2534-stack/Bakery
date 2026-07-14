(() => {
  function applyBedroomStyle() {
    const room=document.querySelector('.room.physical-room');
    const shell=room?.querySelector('.physical-shell');
    const stage=room?.querySelector('.physical-stage');
    if(!room||!shell||!stage||room.classList.contains('topdown-bedroom')||current==='park'||(current==='cottage'&&currentTab==='Exterior'))return;
    room.classList.add('bedroom-style-room');
    room.dataset.interiorTheme=current;
    if(!shell.querySelector('.bedroom-style-architecture'))shell.insertAdjacentHTML('afterbegin',`<div class="bedroom-style-architecture" aria-hidden="true"><i class="style-window left"><b></b></i><i class="style-window right"><b></b></i><i class="style-wall-flowers"></i><i class="style-doorway"></i><i class="style-sunlight"></i></div>`);
    stage.querySelectorAll('.physical-object').forEach(object=>{
      const name=object.querySelector('.object-name')?.textContent.trim()||'Furniture';
      object.dataset.objectName=name.toLowerCase().replace(/[^a-z0-9]+/g,'-');
      object.classList.add('bedroom-style-furniture');
    });
  }
  const prior=renderRoom;
  renderRoom=function(){prior();applyBedroomStyle()};
  if(document.querySelector('.room.physical-room'))applyBedroomStyle();
})();
