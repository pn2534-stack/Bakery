(() => {
  const BEDROOM = 'cottage|Bedroom';
  const INTERACT_DISTANCE = 18;
  const DEFAULT_SPAWNS = [{ x: 50, y: 84 }, { x: 36, y: 84 }, { x: 65, y: 84 }, { x: 50, y: 76 }];

  const key = () => `${current}|${currentTab}`;
  const isBedroom = () => key() === BEDROOM;
  const isRoomActive = () => document.getElementById('location')?.classList.contains('active') && !!document.querySelector('.physical-room .physical-shell');
  const numberStyle = (element, property, fallback = 0) => parseFloat(element.style[property]) || fallback;

  function objectBox(object) {
    return {
      left: numberStyle(object, 'left'),
      top: numberStyle(object, 'top'),
      width: numberStyle(object, 'width', 12),
      height: numberStyle(object, 'height', 18)
    };
  }

  function blocksMovement(object) {
    if (object.dataset.overlayHit === 'true') return false;
    return !['door', 'art', 'plant', 'animal'].includes(object.dataset.type);
  }

  function isBlocked(x, y) {
    if (x < 6 || x > 94 || y < 27 || y > 89) return true;
    return [...document.querySelectorAll('.topdown-unified .physical-object')].some(object => {
      if (!blocksMovement(object)) return false;
      const box = objectBox(object);
      const insetX = Math.min(4, box.width * .18);
      const insetY = Math.min(5, box.height * .2);
      return x > box.left + insetX - 2 && x < box.left + box.width - insetX + 2 &&
        y > box.top + insetY - 2 && y < box.top + box.height - insetY + 3;
    });
  }

  function safeSpawn() {
    state.roomPositions = state.roomPositions || {};
    const saved = state.roomPositions[key()];
    if (saved && !isBlocked(saved.x, saved.y)) return saved;
    return DEFAULT_SPAWNS.find(point => !isBlocked(point.x, point.y)) || { x: 50, y: 84 };
  }

  function positionPlayer() {
    const player = document.querySelector('.topdown-unified .physical-player');
    if (!player) return;
    player.style.left = `${interiorXY.x}%`;
    player.style.top = `${interiorXY.y}%`;
    player.style.zIndex = String(30 + Math.round(interiorXY.y));
  }

  function nearestObject() {
    const objects = [...document.querySelectorAll('.topdown-unified .physical-object')];
    const nearest = objects.reduce((best, object) => {
      const box = objectBox(object);
      const centerX = box.left + box.width / 2;
      const centerY = box.top + box.height / 2;
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
      const label = nearest.o.querySelector('.object-name');
      const name = label?.querySelector('span')?.textContent.trim() || nearest.o.dataset.objectName?.replace(/-/g,' ') || label?.textContent.trim();
      prompt.textContent = `E · ${nearest.o.dataset.actionName} ${name}`;
    }
  }

  function movePlayer(dx, dy) {
    const nextX = interiorXY.x + dx;
    const nextY = interiorXY.y + dy;
    if (!isBlocked(nextX, interiorXY.y)) interiorXY.x = nextX;
    if (!isBlocked(interiorXY.x, nextY)) interiorXY.y = nextY;
    state.roomPositions[key()] = { x: interiorXY.x, y: interiorXY.y };
    positionPlayer();
    nearestObject();
    save();
  }

  function prepareRoom() {
    if (!isRoomActive() || isBedroom()) return;
    const room = document.querySelector('.room.physical-room');
    const shell = room?.querySelector('.physical-shell');
    const stage = room?.querySelector('.physical-stage');
    if (!room || !shell || !stage) return;
    room.classList.add('topdown-unified');
    if (!shell.querySelector('.unified-room-controls')) {
      shell.insertAdjacentHTML('beforeend', `<div class="unified-room-controls"><b>${locations[current]?.title || 'Room'}</b><span>Move: WASD / arrows · Interact: E · Click the floor to walk</span></div>`);
    }
    stage.querySelectorAll('.physical-object').forEach(object => {
      object.classList.add('unified-hit-area');
      const box = objectBox(object);
      object.style.zIndex = String(18 + Math.round(box.top + box.height));
      const name = object.querySelector('.object-name')?.textContent.trim();
      object.setAttribute('aria-label', `${object.dataset.actionName}: ${name}`);
    });
    const start = safeSpawn();
    interiorXY = { x: start.x, y: start.y };
    positionPlayer();
    nearestObject();
  }

  const previousRender = renderRoom;
  renderRoom = function () {
    previousRender();
    prepareRoom();
  };

  document.addEventListener('keydown', event => {
    if (event.target.matches?.('input,textarea,select') || event.target.isContentEditable) return;
    if (!isRoomActive() || isBedroom()) return;
    const movement = {
      arrowup: [0, -2.4], w: [0, -2.4], arrowdown: [0, 2.4], s: [0, 2.4],
      arrowleft: [-2.4, 0], a: [-2.4, 0], arrowright: [2.4, 0], d: [2.4, 0]
    }[event.key.toLowerCase()];
    if (movement) {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.setChibiDirection?.(event.key.toLowerCase(), true);
      movePlayer(...movement);
      return;
    }
    if (event.key.toLowerCase() === 'e') {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (nearPhysical?.d < INTERACT_DISTANCE) interactPhysical(nearPhysical.o);
    }
  }, true);

  document.addEventListener('pointerdown', event => {
    if (!isRoomActive() || isBedroom() || event.target.closest('.physical-object,.room-tabs,.back')) return;
    const shell = event.target.closest('.topdown-unified .physical-shell');
    if (!shell) return;
    const rect = shell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    if (isBlocked(x, y)) return;
    const dx = x - interiorXY.x;
    const dy = y - interiorXY.y;
    const direction = Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : (dy < 0 ? 'up' : 'down');
    window.setChibiDirection?.(direction, true);
    interiorXY = { x, y };
    state.roomPositions[key()] = { x, y };
    positionPlayer();
    nearestObject();
    save();
  });

  if (isRoomActive()) prepareRoom();
})();
