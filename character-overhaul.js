(() => {
  const creator = document.getElementById('creator');
  const panel = creator?.querySelector('.creator-panel');
  const stage = document.getElementById('dressing-stage');
  const leftPanel = creator?.querySelector('.option-panel');
  const rightPanel = creator?.querySelector('.creator-categories');
  const footer = creator?.querySelector('.creator-footer');
  if (!creator || !panel || !stage || !leftPanel || !rightPanel || !footer) return;

  const look = Object.assign({
    outfit: 'Strawberry Shortcake', hair: 'Double puffs',
    hairColor: '#3b2116', face: 'Soft smile', eyes: '#4a2619', palette: '#d98289',
    accessory: 'Pink bow', shoes: 'Pink Mary Janes', direction: 'front'
  }, state.player.renderedLook || {});

  const outfits = [
    ['Strawberry', 'rose'], ['Cocoa', 'cocoa'], ['Sage', 'sage'],
    ['Honey', 'honey'], ['Lavender', 'lavender'], ['Blueberry', 'blue'],
    ['Overalls', 'overalls'], ['Shortcake', 'cream'], ['Picnic', 'picnic']
  ];
  const directions = ['front', 'right', 'back', 'left'];

  function choice(label, group, value, inner = '') {
    const active = look[group] === value ? ' active' : '';
    return `<button type="button" class="render-choice${active}" data-render-group="${group}" data-render-value="${value}" aria-pressed="${!!active}">${inner}<span>${label}</span></button>`;
  }

  function renderCreatorPanels() {
    leftPanel.innerHTML = `
      <h3><span>✦</span> Outfit <span>✦</span></h3>
      <div class="render-outfit-grid">${outfits.map(([name, tone]) => choice(name, 'outfit', name, `<i class="mini-dress ${tone}"></i>`)).join('')}</div>
      <div class="palette-card"><h4>✦ Color palette ✦</h4><div class="palette-row">
        ${['#d98289','#91a083','#aa91ad','#efbd61','#fff0d8','#6d3c22','#4a2b1d','#c68b5c'].map((color, index) => `<button type="button" class="palette-dot${look.palette === color ? ' active' : ''}" data-palette-color="${color}" style="--dot:${color}" aria-label="Choose color ${index + 1}"></button>`).join('')}
      </div></div>`;

    rightPanel.innerHTML = `
      <section class="render-section"><h3>✂ <span>Hair</span></h3><div class="render-options hair-options">
        ${choice('Puffs', 'hair', 'Double puffs', '<i class="hair-face puff"></i>')}
        ${choice('Braids', 'hair', 'Braids', '<i class="hair-face braid"></i>')}
        ${choice('Bob', 'hair', 'Soft bob', '<i class="hair-face bob"></i>')}
      </div></section>
      <section class="render-section compact"><h3>◈ <span>Hair color</span></h3><div class="circle-options">
        ${['#3b2116','#7a4a29','#e6c79b','#a85f32','#221c19'].map((color, index) => `<button type="button" class="render-color${look.hairColor === color ? ' active' : ''}" data-hair-color="${color}" style="--dot:${color}" aria-label="Hair color ${index + 1}"></button>`).join('')}
      </div></section>
      <section class="render-section"><h3>❀ <span>Face</span></h3><div class="render-options face-options">
        ${['Soft smile','Rosy','Sweet'].map((name, index) => choice(name, 'face', name, `<i class="face-thumb face-${index + 1}"></i>`)).join('')}
      </div></section>
      <section class="render-section compact"><h3>◉ <span>Eyes</span></h3><div class="circle-options eye-options">
        ${['#4a2619','#718260','#557987','#81708b','#29272a'].map((color, index) => `<button type="button" class="render-eye${look.eyes === color ? ' active' : ''}" data-eye-color="${color}" style="--dot:${color}" aria-label="Eye color ${index + 1}"></button>`).join('')}
      </div></section>
      <section class="render-section"><h3>🎀 <span>Accessories</span></h3><div class="render-options accessory-options">
        ${choice('Bow', 'accessory', 'Pink bow', '<i>🎀</i>')}${choice('Flowers', 'accessory', 'Flower crown', '<i>🌸</i>')}${choice('Hat', 'accessory', 'Sun hat', '<i>👒</i>')}
      </div></section>
      <section class="render-section"><h3>♟ <span>Shoes</span></h3><div class="render-options shoe-options">
        ${choice('Brown', 'shoes', 'Brown shoes', '<i>👞</i>')}${choice('Pink', 'shoes', 'Pink Mary Janes', '<i>👟</i>')}${choice('Black', 'shoes', 'Black shoes', '<i>🥾</i>')}${choice('Cream', 'shoes', 'Cream shoes', '<i>🥿</i>')}
      </div></section>`;
  }

  function installCreatorStage() {
    stage.querySelectorAll('.rendered-avatar,.creator-turn-hint').forEach(node => node.remove());
    stage.insertAdjacentHTML('beforeend', `
      <button type="button" class="rendered-avatar sprite-facing-${look.direction}" data-turn-character aria-label="Turn character to view every direction"></button>
      <div class="creator-turn-hint"><span>↻</span> Tap the character to turn</div>`);
    footer.innerHTML = `
      <button type="button" class="render-back" data-creator-back>← Back</button>
      <label class="render-name">Baker name <input id="rendered-baker-name" maxlength="16" value="${state.player.name || 'Your Baker'}"></label>
      <button type="button" class="render-save" data-render-save>Save Outfit ♥</button>
      <button class="start-game render-start" type="submit" form="creator-form">Start 🎂</button>`;
  }

  function saveLook() {
    state.player.renderedLook = { ...look };
    state.player.chibiLook = Object.assign({}, state.player.chibiLook, { dress: look.outfit, hairStyle: look.hair, accessory: look.accessory, shoes: look.shoes });
    save();
  }

  function ensureSprite(host) {
    if (!host) return;
    host.classList.add('rendered-character', 'rendered-3d-ready', 'sprite-facing-front');
    if (!host.querySelector(':scope > .rendered-directional-sprite')) host.insertAdjacentHTML('beforeend', '<i class="rendered-directional-sprite" aria-hidden="true"></i>');
    if (!host.querySelector(':scope > .rendered-3d-puppet')) host.insertAdjacentHTML('beforeend', `
      <span class="rendered-3d-puppet" aria-hidden="true">
        <span class="puppet-ground-shadow"></span>
        <span class="puppet-rig">
          <span class="puppet-hair-puff puff-left"></span><span class="puppet-hair-puff puff-right"></span>
          <span class="puppet-head"><span class="puppet-ear ear-left"></span><span class="puppet-ear ear-right"></span><span class="puppet-hair-cap"></span><span class="puppet-fringe"></span><span class="puppet-eye eye-left"></span><span class="puppet-eye eye-right"></span><span class="puppet-nose"></span><span class="puppet-mouth"></span><span class="puppet-headband"></span><span class="puppet-hair-bow"></span></span>
          <span class="puppet-neck"></span>
          <span class="puppet-arm arm-left"><b></b></span><span class="puppet-arm arm-right"><b></b></span>
          <span class="puppet-torso"><span class="puppet-collar"></span><span class="puppet-bodice-bow"></span><span class="puppet-apron"></span><span class="puppet-skirt"></span></span>
          <span class="puppet-leg leg-left"><b></b></span><span class="puppet-leg leg-right"><b></b></span>
        </span>
      </span>`);
    updateCharacterDepth(host);
  }

  function updateCharacterDepth(character) {
    if (!character) return;
    const y = Math.max(18, Math.min(90, parseFloat(character.style.top) || (character.closest('#world') ? state.player.y : 72)));
    const scale = .88 + ((y - 18) / 72) * .34;
    character.style.setProperty('--path-scale', scale.toFixed(3));
    character.style.zIndex = String(30 + Math.round(y));
  }

  function updateActiveCharacterDepth() {
    document.querySelectorAll('#world.active #player, #location.active .physical-player, #location.active .interior-player').forEach(updateCharacterDepth);
  }

  function decoratePlayers(root = document) {
    root.querySelectorAll?.('#player, .physical-player, .interior-player').forEach(ensureSprite);
  }

  function decorateNpcs(root = document) {
    root.querySelectorAll?.('.room-npc, .village-npc').forEach((npc, index) => {
      npc.classList.add('rendered-npc', `npc-render-${index % 3}`, `sprite-facing-${index % 2 ? 'right' : 'front'}`);
      if (!npc.querySelector(':scope > .rendered-directional-sprite')) npc.insertAdjacentHTML('beforeend', '<i class="rendered-directional-sprite" aria-hidden="true"></i>');
    });
  }

  window.setChibiDirection = function (key, walking = true) {
    const lower = String(key).toLowerCase();
    const direction = lower === 'arrowleft' || lower === 'a' ? 'left' : lower === 'arrowright' || lower === 'd' ? 'right' : lower === 'arrowup' || lower === 'w' ? 'back' : 'front';
    look.direction = direction;
    document.querySelectorAll('#world.active #player, #location.active .physical-player, #location.active .interior-player').forEach(character => {
      ensureSprite(character);
      character.classList.remove(...directions.map(value => `sprite-facing-${value}`));
      character.classList.add(`sprite-facing-${direction}`);
      character.classList.toggle('walking', walking);
      updateCharacterDepth(character);
      clearTimeout(character.renderWalkTimer);
      character.renderWalkTimer = setTimeout(() => character.classList.remove('walking'), 180);
    });
    requestAnimationFrame(updateActiveCharacterDepth);
    setTimeout(updateActiveCharacterDepth, 130);
  };

  renderCreatorPanels();
  installCreatorStage();
  decoratePlayers();
  decorateNpcs();

  const observer = new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType !== 1) return;
    if (node.matches?.('#player,.physical-player,.interior-player')) ensureSprite(node);
    if (node.matches?.('.room-npc,.village-npc')) decorateNpcs(node.parentElement || document);
    decoratePlayers(node);
    decorateNpcs(node);
  })));
  observer.observe(document.getElementById('game'), { childList: true, subtree: true });

  document.addEventListener('click', event => {
    const choiceButton = event.target.closest('[data-render-group]');
    if (choiceButton) {
      look[choiceButton.dataset.renderGroup] = choiceButton.dataset.renderValue;
      renderCreatorPanels();
      saveLook();
      return;
    }
    const hairColor = event.target.closest('[data-hair-color]');
    const eyeColor = event.target.closest('[data-eye-color]');
    const paletteColor = event.target.closest('[data-palette-color]');
    if (hairColor || eyeColor || paletteColor) {
      if (hairColor) look.hairColor = hairColor.dataset.hairColor;
      if (eyeColor) look.eyes = eyeColor.dataset.eyeColor;
      if (paletteColor) look.palette = paletteColor.dataset.paletteColor;
      renderCreatorPanels();
      saveLook();
      return;
    }
    const turn = event.target.closest('[data-turn-character]');
    if (turn) {
      const next = directions[(directions.indexOf(look.direction) + 1) % directions.length];
      look.direction = next;
      turn.className = `rendered-avatar sprite-facing-${next}`;
      return;
    }
    if (event.target.closest('[data-render-save]')) {
      saveLook();
      toast('Your strawberry bakery outfit was saved');
    }
  });

  document.addEventListener('keydown', event => {
    if (/^(arrowup|arrowdown|arrowleft|arrowright|w|a|s|d)$/i.test(event.key)) window.setChibiDirection(event.key, true);
  }, true);
  document.addEventListener('keyup', event => {
    if (/^(arrowup|arrowdown|arrowleft|arrowright|w|a|s|d)$/i.test(event.key)) document.querySelectorAll('.rendered-character').forEach(character => character.classList.remove('walking'));
  });

  document.getElementById('creator-form')?.addEventListener('submit', () => {
    const name = document.getElementById('rendered-baker-name')?.value.trim();
    if (name) state.player.name = name;
    saveLook();
  }, true);
})();
