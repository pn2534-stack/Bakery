(() => {
  const ROOM = 'cottage|Bedroom';
  const INTERACT_DISTANCE = 19;
  const spawn = { x: 50, y: 82 };
  const hotspots = {
    'Cottage bed': [7, 18, 25, 49],
    'Nightstand': [30, 23, 9, 20],
    'Wardrobe': [62, 9, 16, 34],
    'Vanity': [77, 43, 16, 34],
    'Mirror': [81, 14, 10, 25],
    'Window plant': [2, 62, 14, 29]
  };
  const obstacles = [
    [5, 16, 29, 51],
    [29, 21, 12, 23],
    [60, 7, 19, 38],
    [76, 41, 19, 36],
    [1, 60, 16, 31]
  ];

  function isBedroom() {
    return current === 'cottage' && currentTab === 'Bedroom';
  }

  function savedPosition() {
    state.roomPositions = state.roomPositions || {};
    return state.roomPositions[ROOM] || spawn;
  }

  function isBlocked(x, y) {
    if (x < 8 || x > 92 || y < 31 || y > 86) return true;
    return obstacles.some(([left, top, width, height]) =>
      x > left - 2.5 && x < left + width + 2.5 && y > top - 3 && y < top + height + 3
    );
  }

  function positionPlayer() {
    const player = document.querySelector('.cottage-bedroom .physical-player');
    if (!player) return;
    player.style.left = `${interiorXY.x}%`;
    player.style.top = `${interiorXY.y}%`;
  }

  function nearestObject() {
    const objects = [...document.querySelectorAll('.cottage-bedroom .physical-object')];
    const nearest = objects.reduce((best, object) => {
      const box = hotspots[object.querySelector('.object-name')?.textContent.trim()];
      if (!box) return best;
      const centerX = box[0] + box[2] / 2;
      const centerY = box[1] + box[3] / 2;
      const distance = Math.hypot((centerX - interiorXY.x) * .9, centerY - interiorXY.y);
      return !best || distance < best.d ? { o: object, d: distance } : best;
    }, null);
    nearPhysical = nearest;
    objects.forEach(object => object.classList.toggle('near', nearest?.o === object && nearest.d < INTERACT_DISTANCE));
    const prompt = document.getElementById('proximity-prompt');
    if (!prompt) return;
    const closeEnough = nearest && nearest.d < INTERACT_DISTANCE;
    prompt.classList.toggle('show', !!closeEnough);
    if (closeEnough) {
      const name = nearest.o.querySelector('.object-name')?.textContent.trim();
      prompt.textContent = `E · ${nearest.o.dataset.actionName} ${name}`;
    }
  }

  function moveBedroomPlayer(dx, dy) {
    const nextX = interiorXY.x + dx;
    const nextY = interiorXY.y + dy;
    if (!isBlocked(nextX, interiorXY.y)) interiorXY.x = nextX;
    if (!isBlocked(interiorXY.x, nextY)) interiorXY.y = nextY;
    state.roomPositions[ROOM] = { x: interiorXY.x, y: interiorXY.y };
    positionPlayer();
    nearestObject();
    save();
  }

  function prepareBedroom() {
    if (!isBedroom()) return;
    const room = document.querySelector('.physical-room.cottage-bedroom');
    const shell = room?.querySelector('.physical-shell');
    const stage = room?.querySelector('.physical-stage');
    if (!room || !shell || !stage) return;
    room.classList.add('topdown-bedroom');
    shell.classList.toggle('lamp-on', !!state.bedroomLamp);
    if (!shell.querySelector('.bedroom-controls')) shell.insertAdjacentHTML('beforeend', '<div class="bedroom-controls">Move: WASD / arrows · Interact: E</div>');
    stage.querySelectorAll('.physical-object').forEach(object => {
      const name = object.querySelector('.object-name')?.textContent.trim();
      const box = hotspots[name];
      if (!box) return;
      const [left, top, width, height] = box;
      Object.assign(object.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
      object.classList.add('bedroom-hit-area');
      object.setAttribute('aria-label', `${object.dataset.actionName}: ${name}`);
    });
    const start = savedPosition();
    interiorXY = { x: start.x, y: start.y };
    if (isBlocked(interiorXY.x, interiorXY.y)) interiorXY = { ...spawn };
    positionPlayer();
    nearestObject();
  }

  const previousBedroomRender = renderRoom;
  renderRoom = function () {
    previousBedroomRender();
    prepareBedroom();
  };

  document.addEventListener('keydown', event => {
    if (!isBedroom() || !document.getElementById('location')?.classList.contains('active')) return;
    const movement = {
      arrowup: [0, -2.4], w: [0, -2.4], arrowdown: [0, 2.4], s: [0, 2.4],
      arrowleft: [-2.4, 0], a: [-2.4, 0], arrowright: [2.4, 0], d: [2.4, 0]
    }[event.key.toLowerCase()];
    if (movement) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.setChibiDirection?.(event.key.toLowerCase(), true);
      moveBedroomPlayer(...movement);
      return;
    }
    if (event.key.toLowerCase() === 'e') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (nearPhysical?.d < INTERACT_DISTANCE) interactPhysical(nearPhysical.o);
    }
  }, true);

  document.addEventListener('pointerdown', event => {
    if (!isBedroom() || event.target.closest('.physical-object')) return;
    const shell = event.target.closest('.cottage-bedroom .physical-shell');
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (isBlocked(x, y)) return;
    const dx = x - interiorXY.x;
    const dy = y - interiorXY.y;
    const directionKey = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    window.setChibiDirection?.(directionKey, true);
    interiorXY = { x, y };
    state.roomPositions[ROOM] = { x, y };
    positionPlayer();
    nearestObject();
    save();
  });

  const previousBedroomInteract = interactPhysical;
  interactPhysical = function (element) {
    if (!isBedroom()) return previousBedroomInteract(element);
    const name = element.querySelector('.object-name')?.textContent.trim();
    if (name === 'Cottage bed') return previousBedroomInteract(element);
    if (name === 'Nightstand') {
      state.bedroomLamp = !state.bedroomLamp;
      document.querySelector('.cottage-bedroom .physical-shell')?.classList.toggle('lamp-on', state.bedroomLamp);
      save();
      toast(`Bedside lamp ${state.bedroomLamp ? 'on' : 'off'}`);
      return;
    }
    if (name === 'Wardrobe') {
      modal('<h2>Bedroom wardrobe</h2><p class="sub">Choose a cozy outfit for today.</p><div class="cards"><button class="card bedroom-outfit" data-bedroom-outfit="Rose baker overalls">🌹 Rose baker overalls</button><button class="card bedroom-outfit" data-bedroom-outfit="Sage floral dress">🌿 Sage floral dress</button><button class="card bedroom-outfit" data-bedroom-outfit="Cream linen set">🤍 Cream linen set</button></div>');
      return;
    }
    if (name === 'Vanity') {
      state.energy = Math.min(100, (state.energy || 0) + 5);
      updateHUD();
      toast('Freshened up at the vanity · Energy +5');
      return;
    }
    if (name === 'Mirror') {
      toast(`${state.player?.outfit || 'Your outfit'} looks lovely today`);
      return;
    }
    if (name === 'Window plant') {
      if (state.bedroomPlantDay === state.day) return toast('The bedroom plant is already watered');
      state.bedroomPlantDay = state.day;
      state.stars += 1;
      updateHUD();
      toast('Bedroom plant watered · Friendship star +1');
      return;
    }
    previousBedroomInteract(element);
  };

  document.addEventListener('click', event => {
    const outfit = event.target.closest('[data-bedroom-outfit]');
    if (!outfit) return;
    state.player.outfit = outfit.dataset.bedroomOutfit;
    save();
    document.getElementById('modal-wrap').hidden = true;
    toast(`${state.player.outfit} equipped`);
  });
})();
