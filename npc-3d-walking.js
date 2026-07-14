(() => {
  const selector = '.village-npc,.room-npc,.restaurant-customer';
  const looks = [
    ['#7b432f','#54291f','#251713','#78966e','#e2b8bd','#5a342a','cloud-curls','floral-dress','flowers','petite','round'],
    ['#c47e55','#934f38','#4c2b1d','#66899a','#e2c38e','#3f3431','short-crop','vest','glasses','tall','long'],
    ['#efb88f','#c4775c','#a85f42','#c77982','#f1d3aa','#78494b','soft-bob','coat','beret','average','heart'],
    ['#5b3027','#381c18','#171313','#b8874e','#5f7968','#382b27','long-braids','overalls','satchel','broad','square'],
    ['#d79a68','#a75e43','#37201a','#9b83ad','#f0ca8d','#54404b','high-bun','layered-dress','round-glasses','tall','oval'],
    ['#e6b08c','#b86c50','#d0a46f','#5f8f86','#d68a70','#64513e','wavy-short','sweater','scarf','petite','soft']
  ];

  function hash(value) {
    let total = 7;
    for (const character of String(value)) total = (total * 31 + character.charCodeAt(0)) >>> 0;
    return total;
  }

  function sourcePuppet() {
    return document.querySelector('#player .rendered-3d-puppet,.physical-player .rendered-3d-puppet');
  }

  function addFaceDetails(npc) {
    const head = npc.querySelector('.puppet-head');
    const torso = npc.querySelector('.puppet-torso');
    if (head && !head.querySelector('.npc-face-extra')) head.insertAdjacentHTML('beforeend', '<span class="npc-face-extra"><i class="npc-glasses"></i><i class="npc-freckles"></i><i class="npc-earring left"></i><i class="npc-earring right"></i></span>');
    if (torso && !torso.querySelector('.npc-outfit-extra')) torso.insertAdjacentHTML('beforeend', '<span class="npc-outfit-extra"><i class="npc-scarf"></i><i class="npc-satchel"></i><i class="npc-buttons"></i></span>');
  }

  function applyLook(npc, index) {
    if (npc.classList.contains('npc-varied')) return;
    const identity = npc.dataset.npcName || npc.querySelector('.customer-order-bubble b')?.textContent || npc.className;
    const look = looks[hash(identity) % looks.length];
    const [skin,dark,hair,outfit,accent,shoes,hairStyle,outfitStyle,accessory,build,face] = look;
    npc.classList.add('npc-varied',`npc-hair-${hairStyle}`,`npc-outfit-${outfitStyle}`,`npc-accessory-${accessory}`,`npc-build-${build}`,`npc-face-${face}`);
    npc.style.setProperty('--npc-skin',skin);
    npc.style.setProperty('--npc-skin-dark',dark);
    npc.style.setProperty('--npc-hair',hair);
    npc.style.setProperty('--npc-eyes',['#3c261d','#4d704f','#5e7c78','#8b6b42'][index % 4]);
    npc.style.setProperty('--npc-outfit',outfit);
    npc.style.setProperty('--npc-accent',accent);
    npc.style.setProperty('--npc-shoes',shoes);
    addFaceDetails(npc);
  }

  function setMotion(npc) {
    if (npc.classList.contains('restaurant-customer')) {
      const moving = npc.matches('.phase-arriving,.phase-looking,.phase-seated,.phase-counter,.phase-leaving');
      npc.classList.toggle('npc-is-walking',moving && !npc.classList.contains('phase-seated'));
      npc.classList.remove('sprite-facing-front','sprite-facing-back','sprite-facing-left','sprite-facing-right');
      const direction = npc.classList.contains('phase-leaving') ? 'left' :
        npc.classList.contains('phase-counter') ? 'back' :
        npc.classList.contains('phase-seated') ? 'front' : 'right';
      npc.classList.add(`sprite-facing-${direction}`);
    } else if (npc.classList.contains('pathway-npc') || npc.classList.contains('walking')) {
      npc.classList.add('npc-is-walking');
    }
  }

  function upgrade(npc, index = 0) {
    if (!npc || npc.classList.contains('npc-pet')) return;
    npc.classList.add('npc-real-3d');
    let puppet = npc.querySelector('.rendered-3d-puppet');
    if (!puppet) {
      const source = sourcePuppet();
      if (!source) return void setTimeout(() => upgrade(npc,index), 80);
      const host = npc.querySelector('.restaurant-customer-puppet') || npc;
      host.appendChild(source.cloneNode(true));
      puppet = host.querySelector('.rendered-3d-puppet');
    }
    puppet.setAttribute('aria-hidden','true');
    npc.querySelector('.rendered-directional-sprite')?.remove();
    applyLook(npc,index);
    setMotion(npc);
  }

  function upgradeAll(root = document) {
    root.querySelectorAll?.(selector).forEach((npc,index) => upgrade(npc,index));
    if (root.matches?.(selector)) upgrade(root,0);
  }

  upgradeAll();
  new MutationObserver(records => records.forEach(record => record.addedNodes.forEach(node => {
    if (node.nodeType === 1) upgradeAll(node);
  }))).observe(document.getElementById('game'),{childList:true,subtree:true});
})();
