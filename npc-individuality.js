(() => {
  const profiles={
    'Emma Brooks':{skin:'#6f3d2d',dark:'#48251d',hair:'#211713',eyes:'#3b261d',outfit:'#738f69',accent:'#eab5ba',shoes:'#52352d',hairStyle:'afro-puffs',outfitStyle:'floral-dress',accessory:'flower-crown',face:'round',build:'petite',mark:'🌻',scale:[.93,.96]},
    'Oliver Baker':{skin:'#d7976f',dark:'#a75f47',hair:'#6a3e28',eyes:'#53725b',outfit:'#587f91',accent:'#e3bd78',shoes:'#39322f',hairStyle:'swept-wave',outfitStyle:'suspenders',accessory:'glasses',face:'long',build:'tall',mark:'📖',scale:[.96,1.08]},
    'Lily Foster':{skin:'#f0c4a5',dark:'#c98768',hair:'#c07b56',eyes:'#557d87',outfit:'#cb7a8c',accent:'#fff0d0',shoes:'#7a4b53',hairStyle:'twin-buns',outfitStyle:'party-dress',accessory:'headband',face:'heart',build:'petite',mark:'🎂',scale:[.9,.94]},
    'Noah Wilson':{skin:'#4f2c24',dark:'#301b18',hair:'#161212',eyes:'#926e43',outfit:'#a97b45',accent:'#526f61',shoes:'#302824',hairStyle:'short-crop',outfitStyle:'overalls',accessory:'satchel',face:'square',build:'broad',mark:'🐾',scale:[1.08,1]},
    'Sophia Carter':{skin:'#bd7653',dark:'#884630',hair:'#31201b',eyes:'#66527d',outfit:'#9979ae',accent:'#efcc88',shoes:'#51404d',hairStyle:'high-bun',outfitStyle:'artist-smock',accessory:'earrings',face:'oval',build:'tall',mark:'🎨',scale:[.96,1.06]},
    'Henry Green':{skin:'#e0ad8c',dark:'#ad6a52',hair:'#d5cec1',eyes:'#566e5f',outfit:'#678a7d',accent:'#c98268',shoes:'#5e4e3d',hairStyle:'silver-sides',outfitStyle:'elder-shawl',accessory:'round-glasses',face:'soft',build:'average',mark:'🥧',scale:[1,.98]},
    'Ruby Walker':{skin:'#8b5038',dark:'#603122',hair:'#522b23',eyes:'#34251f',outfit:'#d36f72',accent:'#f4d9b7',shoes:'#6c3e39',hairStyle:'ribbon-braids',outfitStyle:'baker-apron',accessory:'ribbon',face:'round',build:'petite',mark:'✏️',scale:[.91,.95]},
    'Lucas Reed':{skin:'#c58a61',dark:'#92543c',hair:'#9e6a3f',eyes:'#476a70',outfit:'#647e55',accent:'#d9b663',shoes:'#44382f',hairStyle:'curly-crop',outfitStyle:'cardigan',accessory:'beanie',face:'strong',build:'broad',mark:'🍎',scale:[1.06,1.02]},
    'Grandma Hazel':{skin:'#a96649',dark:'#78402f',hair:'#c9b5a4',eyes:'#654936',outfit:'#8c6c91',accent:'#e9cbb5',shoes:'#594139',hairStyle:'silver-coil',outfitStyle:'elder-shawl',accessory:'pearl-necklace',face:'soft',build:'petite',mark:'🧶',scale:[.94,.92]},
    'Lily':{skin:'#7d452f',dark:'#52291f',hair:'#28201d',eyes:'#4e392c',outfit:'#d77c8a',accent:'#f8d2d4',shoes:'#6b3f47',hairStyle:'double-puffs',outfitStyle:'berry-dress',accessory:'big-bow',face:'round',build:'petite',mark:'🍓',scale:[.91,.93]},
    'Professor Maple':{skin:'#d4a17d',dark:'#a46850',hair:'#6d5a4b',eyes:'#486651',outfit:'#718472',accent:'#d8b870',shoes:'#493d35',hairStyle:'professor-wave',outfitStyle:'academic-coat',accessory:'monocle',face:'long',build:'tall',mark:'📚',scale:[.97,1.08]},
    Juniper:{skin:'#7b432f',dark:'#54291f',hair:'#251713',eyes:'#3c261d',outfit:'#78966e',accent:'#e2b8bd',shoes:'#5a342a',hairStyle:'cloud-curls',outfitStyle:'floral-dress',accessory:'flowers',face:'round',build:'petite',mark:'🌿',scale:[.9,.96]},
    Milo:{skin:'#c47e55',dark:'#934f38',hair:'#4c2b1d',eyes:'#4d704f',outfit:'#66899a',accent:'#e2c38e',shoes:'#3f3431',hairStyle:'short-crop',outfitStyle:'vest',accessory:'glasses',face:'long',build:'tall',mark:'☕',scale:[.95,1.1]},
    Poppy:{skin:'#efb88f',dark:'#c4775c',hair:'#a85f42',eyes:'#5e7c78',outfit:'#c77982',accent:'#f1d3aa',shoes:'#78494b',hairStyle:'soft-bob',outfitStyle:'coat',accessory:'beret',face:'heart',build:'average',mark:'🌺',scale:[1,1]},
    Rowan:{skin:'#5b3027',dark:'#381c18',hair:'#171313',eyes:'#8b6b42',outfit:'#b8874e',accent:'#5f7968',shoes:'#382b27',hairStyle:'long-locs',outfitStyle:'overalls',accessory:'satchel',face:'square',build:'broad',mark:'🥖',scale:[1.1,.99]},
    Cleo:{skin:'#d79a68',dark:'#a75e43',hair:'#37201a',eyes:'#576d8a',outfit:'#9b83ad',accent:'#f0ca8d',shoes:'#54404b',hairStyle:'high-bun',outfitStyle:'layered-dress',accessory:'round-glasses',face:'oval',build:'tall',mark:'🔮',scale:[.95,1.07]},
    Theo:{skin:'#e6b08c',dark:'#b86c50',hair:'#d0a46f',eyes:'#557966',outfit:'#5f8f86',accent:'#d68a70',shoes:'#64513e',hairStyle:'wavy-short',outfitStyle:'sweater',accessory:'scarf',face:'soft',build:'petite',mark:'🫖',scale:[.92,.96]},
    Maribel:{skin:'#b96f4d',dark:'#83432f',hair:'#512c20',eyes:'#39291f',outfit:'#d17769',accent:'#f0dcba',shoes:'#6b4138',hairStyle:'side-braid',outfitStyle:'baker-apron',accessory:'ribbon',face:'round',build:'average',mark:'🥐',scale:[1,1.02]},
    Fern:{skin:'#704335',dark:'#47281f',hair:'#281a17',eyes:'#6f8458',outfit:'#607f61',accent:'#d9b56d',shoes:'#41352e',hairStyle:'side-puff',outfitStyle:'garden-coat',accessory:'sun-hat',face:'strong',build:'broad',mark:'🌱',scale:[1.08,1]}
  };
  const hairs=['pixie','ponytail','curly-crop','side-braid','twin-buns','long-locs','soft-bob','high-bun','swept-wave','afro-puffs'];
  const outfits=['cardigan','suspenders','artist-smock','overalls','berry-dress','academic-coat','baker-apron','garden-coat'];
  const accessories=['headband','glasses','scarf','beanie','earrings','satchel','pearl-necklace','flowers'];
  const faces=['round','long','heart','square','oval','soft','strong'];
  const builds=['petite','average','tall','broad'];
  const palettes=[['#613526','#3d211a','#251813','#6d8b6b','#e3b2ac','#50342d'],['#d8a17c','#a7664d','#9a603b','#69899a','#e6c67f','#4b4037'],['#9b5b41','#6d3527','#36211c','#b4778d','#f0d5ae','#664044'],['#edbc98','#bd795d','#cf9d64','#7d966c','#d98d7d','#5a493a'],['#543027','#341d19','#181313','#9b7350','#657e69','#332a26'],['#c7835c','#914b38','#4b2920','#8171a0','#e7c184','#50404a']];
  const establishedStyles={
    hair:{'afro-puffs':'cloud-curls','double-puffs':'cloud-curls','twin-buns':'high-bun',pixie:'short-crop',ponytail:'side-puff','curly-crop':'short-crop','side-braid':'ribbon-braids','long-locs':'long-braids','swept-wave':'wavy-short','silver-sides':'wavy-short','silver-coil':'high-bun','professor-wave':'wavy-short'},
    outfit:{suspenders:'vest',cardigan:'sweater','artist-smock':'coat','academic-coat':'coat','party-dress':'layered-dress','berry-dress':'layered-dress','elder-shawl':'sweater'},
    accessory:{'flower-crown':'flowers',headband:'ribbon','big-bow':'ribbon',beanie:'scarf',earrings:'flowers','pearl-necklace':'round-glasses',monocle:'glasses'}
  };

  function hash(value){let total=17;for(const char of String(value))total=(total*37+char.charCodeAt(0))>>>0;return total}
  function identity(npc,index=0){
    const bubble=npc.querySelector('.customer-order-bubble b')?.textContent||'';
    const spoken=bubble.split('·')[0].trim();
    return spoken||npc.dataset.npcName||(['Juniper','Rowan','Theo'][index%3]);
  }
  function generated(name){const value=hash(name),palette=palettes[value%palettes.length];return{skin:palette[0],dark:palette[1],hair:palette[2],eyes:['#3b291f','#4f7054','#526f83','#7b6543','#6e587c'][(value>>>3)%5],outfit:palette[3],accent:palette[4],shoes:palette[5],hairStyle:hairs[(value>>>5)%hairs.length],outfitStyle:outfits[(value>>>8)%outfits.length],accessory:accessories[(value>>>11)%accessories.length],face:faces[(value>>>14)%faces.length],build:builds[(value>>>17)%builds.length],mark:['✿','☕','📗','🍪','🌼','🎨','🫐','🧁'][(value>>>19)%8],scale:[.91+((value>>>21)%18)/100,.94+((value>>>25)%17)/100]}}
  function sourcePuppet(){return document.querySelector('#player .rendered-3d-puppet,.physical-player .rendered-3d-puppet')}
  function ensurePuppet(npc){let puppet=npc.querySelector('.rendered-3d-puppet');if(puppet)return puppet;const source=sourcePuppet();if(!source)return null;(npc.querySelector('.restaurant-customer-puppet')||npc).appendChild(source.cloneNode(true));return npc.querySelector('.rendered-3d-puppet')}
  function clearIdentityClasses(npc){[...npc.classList].filter(name=>/^(npc-hair|npc-outfit|npc-accessory|npc-build|npc-face|npc-identity)-/.test(name)).forEach(name=>npc.classList.remove(name))}
  function apply(npc,index=0){
    if(!npc||npc.classList.contains('npc-pet'))return;const puppet=ensurePuppet(npc);if(!puppet)return;
    const name=identity(npc,index),sourceProfile=profiles[name]||generated(name),profile={...sourceProfile,hairStyle:establishedStyles.hair[sourceProfile.hairStyle]||sourceProfile.hairStyle,outfitStyle:establishedStyles.outfit[sourceProfile.outfitStyle]||sourceProfile.outfitStyle,accessory:establishedStyles.accessory[sourceProfile.accessory]||sourceProfile.accessory};clearIdentityClasses(npc);
    const slug=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    npc.classList.add('npc-varied','npc-real-3d','npc-individual',`npc-identity-${slug}`,`npc-hair-${profile.hairStyle}`,`npc-outfit-${profile.outfitStyle}`,`npc-accessory-${profile.accessory}`,`npc-build-${profile.build}`,`npc-face-${profile.face}`);
    npc.dataset.npcName=name;npc.dataset.npcIdentity=slug;npc.setAttribute('aria-label',`${name}, uniquely styled village resident`);npc.title=name;
    [['skin',profile.skin],['skin-dark',profile.dark],['hair',profile.hair],['eyes',profile.eyes],['outfit',profile.outfit],['accent',profile.accent],['shoes',profile.shoes]].forEach(([key,value])=>npc.style.setProperty(`--npc-${key}`,value));
    const head=puppet.querySelector('.puppet-head'),torso=puppet.querySelector('.puppet-torso');
    if(head&&!head.querySelector('.npc-face-extra'))head.insertAdjacentHTML('beforeend','<span class="npc-face-extra"><i class="npc-glasses"></i><i class="npc-freckles"></i><i class="npc-earring left"></i><i class="npc-earring right"></i></span>');
    if(torso&&!torso.querySelector('.npc-outfit-extra'))torso.insertAdjacentHTML('beforeend','<span class="npc-outfit-extra"><i class="npc-scarf"></i><i class="npc-satchel"></i><i class="npc-buttons"></i></span>');
    torso?.querySelector('.npc-signature')?.remove();
    if(!npc.classList.contains('restaurant-customer')){let tag=npc.querySelector(':scope>.npc-name-tag');if(!tag){tag=document.createElement('span');tag.className='npc-name-tag';npc.appendChild(tag)}tag.textContent=name}
  }
  function applyAll(root=document){const nodes=[];if(root.matches?.('.village-npc,.room-npc,.restaurant-customer'))nodes.push(root);root.querySelectorAll?.('.village-npc,.room-npc,.restaurant-customer').forEach(node=>nodes.push(node));nodes.forEach((npc,index)=>apply(npc,index))}

  window.applyUniqueNpcDesigns=applyAll;applyAll();
  new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>{if(node.nodeType!==1)return;const owner=node.closest?.('.village-npc,.room-npc,.restaurant-customer');if(owner)apply(owner);applyAll(node)}))).observe(document.getElementById('game'),{childList:true,subtree:true});
})();
