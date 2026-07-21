(() => {
  const world=document.getElementById('world');
  if(!world)return;
  world.classList.add('reference-map');
  world.insertAdjacentHTML('afterbegin',`<div class="reference-map-layer">
    <button class="reference-hotspot hotspot-bakery" data-reference-location="bakery" aria-label="Honeybell Bakery"></button>
    <button class="reference-hotspot hotspot-market" data-reference-location="shops" data-reference-tab="Market" aria-label="Village Market"></button>
    <button class="reference-hotspot hotspot-boutique" data-reference-location="shops" data-reference-tab="Boutique" aria-label="Cottage Boutique"></button>
    <button class="reference-hotspot hotspot-cottage" data-reference-location="cottage" data-reference-tab="Living room" aria-label="My Cottage"></button>
    <button class="reference-hotspot hotspot-park" data-reference-location="park" data-reference-tab="Pavilion" aria-label="Willow Park · Mini Games"></button>
    <i class="village-npc npc-map-a"></i><i class="village-npc npc-map-b"></i><i class="village-npc npc-map-c"></i>
    <i class="reference-butterfly butterfly-a"></i><i class="reference-butterfly butterfly-b"></i>
  </div><nav class="village-destinations" aria-label="More village locations">
    <span>Village places</span>
    <button data-reference-location="library">📚 <b>Library</b></button>
    <button data-reference-location="studio">🎨 <b>Art Studio</b></button>
    <button data-reference-location="giftshop">🎁 <b>Gift Shop</b></button>
    <button data-reference-location="greenhouse">🌿 <b>Greenhouse</b></button>
    <button data-reference-location="delivery">📦 <b>Delivery Center</b></button>
  </nav><div class="map-mini"></div>`);

  let entryRequest=0;
  document.addEventListener('click',event=>{
    const hotspot=event.target.closest('[data-reference-location]');
    if(!hotspot)return;
    event.preventDefault();event.stopImmediatePropagation();
    const request=++entryRequest,location=hotspot.dataset.referenceLocation,tab=hotspot.dataset.referenceTab;
    const enter=()=>{
      if(request!==entryRequest)return;
      openLocation(location);
      if(!tab)return;
      setTimeout(()=>{
        if(request!==entryRequest||current!==location)return;
        currentTab=tab;renderTabs();renderRoom();
        document.querySelectorAll('#room-tabs button').forEach(button=>button.classList.toggle('active',button.dataset.tab===currentTab));
      },760);
    };
    if(window.walkToVillageBuilding)window.walkToVillageBuilding(hotspot,enter);else enter();
  },true);
})();
