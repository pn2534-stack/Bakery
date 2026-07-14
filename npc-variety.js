(() => {
  const designs = [
    {name:'Juniper',skin:'#7b432f',dark:'#54291f',hair:'#251713',eyes:'#3c261d',outfit:'#78966e',accent:'#e2b8bd',shoes:'#5a342a',hairStyle:'cloud-curls',outfitStyle:'floral-dress',accessory:'flowers',build:'petite',face:'round'},
    {name:'Milo',skin:'#c47e55',dark:'#934f38',hair:'#4c2b1d',eyes:'#4d704f',outfit:'#66899a',accent:'#e2c38e',shoes:'#3f3431',hairStyle:'short-crop',outfitStyle:'vest',accessory:'glasses',build:'tall',face:'long'},
    {name:'Poppy',skin:'#efb88f',dark:'#c4775c',hair:'#a85f42',eyes:'#5e7c78',outfit:'#c77982',accent:'#f1d3aa',shoes:'#78494b',hairStyle:'soft-bob',outfitStyle:'coat',accessory:'beret',build:'average',face:'heart'},
    {name:'Rowan',skin:'#5b3027',dark:'#381c18',hair:'#171313',eyes:'#8b6b42',outfit:'#b8874e',accent:'#5f7968',shoes:'#382b27',hairStyle:'long-braids',outfitStyle:'overalls',accessory:'satchel',build:'broad',face:'square'},
    {name:'Cleo',skin:'#d79a68',dark:'#a75e43',hair:'#37201a',eyes:'#576d8a',outfit:'#9b83ad',accent:'#f0ca8d',shoes:'#54404b',hairStyle:'high-bun',outfitStyle:'layered-dress',accessory:'round-glasses',build:'tall',face:'oval'},
    {name:'Theo',skin:'#e6b08c',dark:'#b86c50',hair:'#d0a46f',eyes:'#557966',outfit:'#5f8f86',accent:'#d68a70',shoes:'#64513e',hairStyle:'wavy-short',outfitStyle:'sweater',accessory:'scarf',build:'petite',face:'soft'},
    {name:'Maribel',skin:'#b96f4d',dark:'#83432f',hair:'#512c20',eyes:'#39291f',outfit:'#d17769',accent:'#f0dcba',shoes:'#6b4138',hairStyle:'ribbon-braids',outfitStyle:'baker-apron',accessory:'ribbon',build:'average',face:'round'},
    {name:'Fern',skin:'#704335',dark:'#47281f',hair:'#281a17',eyes:'#6f8458',outfit:'#607f61',accent:'#d9b56d',shoes:'#41352e',hairStyle:'side-puff',outfitStyle:'garden-coat',accessory:'sun-hat',build:'broad',face:'strong'}
  ];

  function hash(value){let number=0;for(const char of value)number=(number*31+char.charCodeAt(0))>>>0;return number}
  function variantFor(npc,index){
    if(npc.classList.contains('npc-map-a'))return 0;
    if(npc.classList.contains('npc-map-b'))return 3;
    if(npc.classList.contains('npc-map-c'))return 5;
    const room=`${typeof current==='string'?current:'village'}|${typeof currentTab==='string'?currentTab:''}|${npc.className}|${index}`;
    return hash(room)%designs.length;
  }

  function addPuppet(npc){
    if(npc.querySelector('.rendered-3d-puppet'))return true;
    const source=document.querySelector('#player .rendered-3d-puppet');
    if(!source)return false;
    npc.appendChild(source.cloneNode(true));
    return true;
  }

  function applyDesign(npc,design,index){
    if(!addPuppet(npc))return;
    npc.querySelector('.rendered-directional-sprite')?.remove();
    npc.classList.add('npc-varied',`npc-hair-${design.hairStyle}`,`npc-outfit-${design.outfitStyle}`,`npc-accessory-${design.accessory}`,`npc-build-${design.build}`,`npc-face-${design.face}`);
    npc.dataset.npcName=design.name;
    npc.style.setProperty('--npc-skin',design.skin);
    npc.style.setProperty('--npc-skin-dark',design.dark);
    npc.style.setProperty('--npc-hair',design.hair);
    npc.style.setProperty('--npc-eyes',design.eyes);
    npc.style.setProperty('--npc-outfit',design.outfit);
    npc.style.setProperty('--npc-accent',design.accent);
    npc.style.setProperty('--npc-shoes',design.shoes);
    const head=npc.querySelector('.puppet-head');
    const torso=npc.querySelector('.puppet-torso');
    if(head&&!head.querySelector('.npc-face-extra'))head.insertAdjacentHTML('beforeend','<span class="npc-face-extra"><i class="npc-glasses"></i><i class="npc-freckles"></i><i class="npc-earring left"></i><i class="npc-earring right"></i></span>');
    if(torso&&!torso.querySelector('.npc-outfit-extra'))torso.insertAdjacentHTML('beforeend','<span class="npc-outfit-extra"><i class="npc-scarf"></i><i class="npc-satchel"></i><i class="npc-buttons"></i></span>');
    if(!npc.querySelector(':scope > .npc-name-tag'))npc.insertAdjacentHTML('beforeend',`<span class="npc-name-tag">${design.name}</span>`);
    npc.setAttribute('aria-label',`${design.name}, village resident`);
    npc.title=design.name;
  }

  function decorate(root=document){
    const npcs=[...root.querySelectorAll?.('.village-npc,.room-npc')||[]];
    npcs.forEach((npc,index)=>{if(!npc.classList.contains('npc-varied'))applyDesign(npc,designs[variantFor(npc,index)],index)});
  }

  decorate();
  const observer=new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{
    if(node.nodeType!==1)return;
    if(node.matches?.('.village-npc,.room-npc'))decorate(node.parentElement||document);
    decorate(node);
  })));
  observer.observe(document.getElementById('game'),{childList:true,subtree:true});
})();
