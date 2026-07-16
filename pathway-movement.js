(() => {
  const world = document.getElementById('world');
  const layer = world?.querySelector('.reference-map-layer');
  const player = document.getElementById('player');
  if (!world || !layer || !player) return;

  const center = { x:50, y:64 };
  const paths = [
    [center,{x:18,y:65}], [center,{x:39,y:58}], [center,{x:62,y:57}],
    [center,{x:83,y:65}], [center,{x:50,y:52}], [center,{x:50,y:81}],
    [{x:18,y:65},{x:12,y:69}], [{x:83,y:65},{x:89,y:69}]
  ];
  const doors = {
    bakery:{x:20,y:62}, market:{x:40,y:57}, boutique:{x:62,y:56}, cottage:{x:82,y:63}, park:{x:50,y:81}
  };
  let routeFrame = 0;

  function closestOnSegment(point, segment) {
    const [a,b]=segment,dx=b.x-a.x,dy=b.y-a.y,length=dx*dx+dy*dy||1;
    const t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/length));
    const projected={x:a.x+dx*t,y:a.y+dy*t};
    return {...projected,d:Math.hypot(point.x-projected.x,(point.y-projected.y)*1.35)};
  }

  function nearestPath(point) {
    return paths.reduce((best,segment,index)=>{const projected=closestOnSegment(point,segment);return !best||projected.d<best.d?{...projected,index}:best},null);
  }

  function constrainToPath(point) {
    const nearest=nearestPath(point);
    if(nearest.d<=4.2)return {x:Math.max(7,Math.min(92,point.x)),y:Math.max(49,Math.min(82,point.y)),segment:nearest.index};
    return {x:nearest.x,y:nearest.y,segment:nearest.index};
  }

  function directionFor(dx,dy) {
    return Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down');
  }

  function faceMovement(dx,dy) {
    const key={left:'arrowleft',right:'arrowright',up:'arrowup',down:'arrowdown'}[directionFor(dx,dy)];
    window.setChibiDirection?.(key,true);
  }

  function applyGroundPosition(point, walking=true) {
    state.player.x=point.x;state.player.y=point.y;
    player.style.left=`${point.x}%`;player.style.top=`${point.y}%`;
    const scale=.76+((point.y-49)/33)*.38;
    player.style.setProperty('--path-scale',Math.max(.74,Math.min(1.16,scale)).toFixed(3));
    player.style.zIndex=String(25+Math.round(point.y));
    player.classList.toggle('walking',walking);
  }

  function stopRoute() {
    if(routeFrame)cancelAnimationFrame(routeFrame);
    routeFrame=0;
  }

  const previousMove=movePlayer;
  movePlayer=function(dx,dy){
    if(!world.classList.contains('active')||!document.getElementById('start-screen').classList.contains('hidden'))return;
    stopRoute();
    const before={x:state.player.x,y:state.player.y};
    const next=constrainToPath({x:before.x+dx,y:before.y+dy});
    const movedX=next.x-before.x,movedY=next.y-before.y;
    if(Math.hypot(movedX,movedY)<.03)return;
    faceMovement(movedX,movedY);
    applyGroundPosition(next,true);
    clearTimeout(movePlayer.stopTimer);
    movePlayer.stopTimer=setTimeout(()=>{player.classList.remove('walking');save()},190);
  };

  function walkRoute(target,done) {
    stopRoute();
    const start=constrainToPath({x:state.player.x,y:state.player.y});
    const end=constrainToPath(target);
    const startSegment=nearestPath(start).index,endSegment=nearestPath(end).index;
    const points=startSegment===endSegment?[start,end]:[start,center,end];
    let part=1,last=performance.now();
    function step(now){
      const from={x:state.player.x,y:state.player.y},to=points[part],dx=to.x-from.x,dy=to.y-from.y,distance=Math.hypot(dx,dy);
      if(distance<.18){part++;if(part>=points.length){applyGroundPosition(end,false);save();routeFrame=0;done?.();return}}
      const destination=points[part],mx=destination.x-state.player.x,my=destination.y-state.player.y,remaining=Math.hypot(mx,my);
      const amount=Math.min(remaining,Math.max(.08,(now-last)*.013));last=now;
      const next={x:state.player.x+(mx/remaining)*amount,y:state.player.y+(my/remaining)*amount};
      faceMovement(mx,my);applyGroundPosition(next,true);
      routeFrame=requestAnimationFrame(step);
    }
    routeFrame=requestAnimationFrame(step);
  }

  window.walkToVillageBuilding=function(hotspot,enter){
    const key=hotspot.classList.contains('hotspot-bakery')?'bakery':hotspot.classList.contains('hotspot-market')?'market':hotspot.classList.contains('hotspot-boutique')?'boutique':hotspot.classList.contains('hotspot-park')?'park':'cottage';
    walkRoute(doors[key],enter);
  };

  layer.addEventListener('pointerdown',event=>{
    if(event.target.closest('.reference-hotspot'))return;
    const rect=layer.getBoundingClientRect();
    const raw={x:(event.clientX-rect.left)/rect.width*100,y:(event.clientY-rect.top)/rect.height*100};
    const target=constrainToPath(raw);
    walkRoute(target);
  });

  function installNpcPuppets(){
    const source=player.querySelector('.rendered-3d-puppet');
    if(!source)return;
    layer.querySelectorAll('.village-npc').forEach((npc,index)=>{
      npc.classList.add('pathway-npc','walking');
      npc.querySelector('.rendered-directional-sprite')?.remove();
      if(!npc.querySelector('.rendered-3d-puppet'))npc.appendChild(source.cloneNode(true));
      npc.style.setProperty('--custom-hair',['#5a3221','#8a5a37','#33241e'][index]);
      npc.style.setProperty('--custom-outfit',['#7f9b75','#b78278','#718fa0'][index]);
      npc.style.setProperty('--custom-eyes',['#4a2a1b','#55705a','#3f5667'][index]);
    });
  }

  const npcRoutes=[
    [{x:38,y:63},{x:50,y:59},{x:59,y:64},{x:50,y:68}],
    [{x:69,y:65},{x:56,y:64},{x:48,y:58},{x:41,y:63}],
    [{x:28,y:67},{x:40,y:65},{x:50,y:73},{x:50,y:64}]
  ];
  function animateNpcs(time){
    layer.querySelectorAll('.pathway-npc').forEach((npc,index)=>{
      const route=npcRoutes[index],duration=15000+index*2300,phase=(time+index*4100)%duration/(duration/(route.length));
      const segment=Math.floor(phase)%route.length,t=phase-Math.floor(phase),a=route[segment],b=route[(segment+1)%route.length];
      const eased=t*t*(3-2*t),x=a.x+(b.x-a.x)*eased,y=a.y+(b.y-a.y)*eased;
      npc.style.left=`${x}%`;npc.style.top=`${y}%`;npc.style.zIndex=String(20+Math.round(y));npc.style.setProperty('--path-scale',(.62+(y-49)/33*.22).toFixed(3));
      npc.classList.remove('sprite-facing-front','sprite-facing-back','sprite-facing-left','sprite-facing-right');
      npc.classList.add(`sprite-facing-${directionFor(b.x-a.x,b.y-a.y)==='up'?'back':directionFor(b.x-a.x,b.y-a.y)==='down'?'front':directionFor(b.x-a.x,b.y-a.y)}`);
    });
    requestAnimationFrame(animateNpcs);
  }

  const initial=constrainToPath({x:state.player.x,y:state.player.y});
  applyGroundPosition(initial,false);
  installNpcPuppets();
  requestAnimationFrame(animateNpcs);
})();
