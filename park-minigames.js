(() => {
  const icons = {
    tic:'✕', fruit:'🍓', colors:'🎨', water:'🧪', words:'🔤', numbers:'🔢', memory:'🌼', catch:'🦋', pattern:'✨'
  };
  const titles = {
    tic:'Tic-Tac-Toe', fruit:'Fruit Merge', colors:'Color Blocks', water:'Water Sort', words:'Word Finder', numbers:'Number Merge', memory:'Flower Memory', catch:'Butterfly Garden', pattern:'Fairy Pattern'
  };
  const fruitIcons = ['', '🍒', '🍓', '🍊', '🍎', '🍉', '🍍'];
  let activeGame = null;
  let tic, fruit, blocks, water, words, numbers, memory, butterfly, pattern;

  function gameShell(name, body, instructions = '') {
    activeGame = name;
    modal(`<div class="park-game"><header><button data-park-hub aria-label="Back to games">←</button><div><small>WILLOW PARK ARCADE</small><h2>${icons[name]} ${titles[name]}</h2></div><button data-reset-park-game="${name}">Reset</button></header>${instructions ? `<p class="park-game-help">${instructions}</p>` : ''}${body}</div>`);
  }

  function award(game, coins = 25) {
    state.minigameWins = state.minigameWins || {};
    state.minigameWins[game] = (state.minigameWins[game] || 0) + 1;
    state.coins += coins;
    state.stars += 1;
    updateHUD();
    save();
    toast(`${titles[game]} complete · +${coins} coins · +1 star`);
  }

  function openHub() {
    activeGame = null;
    const wins = state.minigameWins || {};
    modal(`<div class="park-game-hub"><div class="park-arcade-title"><small>TEA PAVILION ACTIVITY TABLE</small><h2>Willow Park Mini Games</h2><p>Choose a game. Winning earns coins and a friendship star.</p></div><div class="park-game-grid">
      ${Object.keys(titles).map(name => `<button data-park-game="${name}"><i>${icons[name]}</i><b>${titles[name]}</b><span>${wins[name] || 0} wins</span></button>`).join('')}
      <button class="tea-party-game" data-park-tea-animation><i>🫖</i><b>Tea Party</b><span>Pour, share, and celebrate</span></button>
    </div></div>`);
  }

  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const ticWinner = board => lines.find(line => line.every(index => board[index] && board[index] === board[line[0]]));
  function startTic() { tic = { board:Array(9).fill(''), over:false, message:'Your turn · place ✕' }; renderTic(); }
  function renderTic() {
    gameShell('tic', `<div class="tic-board">${tic.board.map((mark,index) => `<button data-tic-cell="${index}" class="${mark ? `mark-${mark}` : ''}" ${mark || tic.over ? 'disabled' : ''}>${mark}</button>`).join('')}</div><div class="game-status">${tic.message}</div>`, 'Make three in a row before the park sprite places three circles.');
  }
  function playTic(index) {
    if (tic.over || tic.board[index]) return;
    tic.board[index] = '✕';
    if (ticWinner(tic.board)) { tic.over = true; tic.message = 'You won the picnic match!'; award('tic'); renderTic(); return; }
    if (tic.board.every(Boolean)) { tic.over = true; tic.message = 'A friendly draw!'; renderTic(); return; }
    const open = tic.board.map((value,i) => value ? -1 : i).filter(i => i >= 0);
    const winning = open.find(i => { const copy=[...tic.board]; copy[i]='○'; return ticWinner(copy); });
    const blocking = open.find(i => { const copy=[...tic.board]; copy[i]='✕'; return ticWinner(copy); });
    tic.board[winning ?? blocking ?? open[Math.floor(Math.random()*open.length)]] = '○';
    if (ticWinner(tic.board)) { tic.over = true; tic.message = 'The park sprite won this round.'; }
    else if (tic.board.every(Boolean)) { tic.over = true; tic.message = 'A friendly draw!'; }
    else tic.message = 'Your turn · place ✕';
    renderTic();
  }

  function startFruit() { fruit = { cells:Array(16).fill(0), next:1 + Math.floor(Math.random()*2), score:0, rewarded:false }; renderFruit(); }
  function renderFruit() {
    gameShell('fruit', `<div class="fruit-next">Next fruit <b>${fruitIcons[fruit.next]}</b></div><div class="fruit-grid">${fruit.cells.map((level,index) => `<button data-fruit-cell="${index}" ${level ? 'disabled' : ''}>${level ? `<span class="fruit-level-${level}">${fruitIcons[level]}</span>` : ''}</button>`).join('')}</div><div class="game-status">Score ${fruit.score} · Place matching fruit beside each other to merge.</div>`, 'Place fruit into empty baskets. Touching identical fruit combine into a larger fruit.');
  }
  function mergeFruit(index) {
    if (fruit.cells[index]) return;
    fruit.cells[index] = fruit.next;
    fruit.next = 1 + Math.floor(Math.random()*2);
    let current = index, merged = true;
    while (merged) {
      merged = false;
      const row = Math.floor(current/4), col = current%4;
      const neighbors = [[row-1,col],[row+1,col],[row,col-1],[row,col+1]].filter(([r,c]) => r>=0&&r<4&&c>=0&&c<4).map(([r,c]) => r*4+c);
      const match = neighbors.find(i => fruit.cells[i] === fruit.cells[current]);
      if (match !== undefined) {
        fruit.cells[current] = Math.min(6, fruit.cells[current] + 1);
        fruit.cells[match] = 0;
        fruit.score += 10 * fruit.cells[current];
        merged = true;
      }
    }
    if (!fruit.rewarded && fruit.cells.some(level => level >= 5)) { fruit.rewarded=true; award('fruit',30); }
    if (fruit.cells.every(Boolean)) toast('Fruit basket full · reset to try again');
    renderFruit();
  }

  const blockColors = ['rose','sage','gold','blue','lavender'];
  function startBlocks() { blocks={cells:Array.from({length:64},()=>blockColors[Math.floor(Math.random()*blockColors.length)]),score:0,rewarded:false}; renderBlocks(); }
  function blockGroup(start) {
    const color=blocks.cells[start], found=new Set([start]), queue=[start];
    while(queue.length){const i=queue.shift(),r=Math.floor(i/8),c=i%8;[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([rr,cc])=>{const n=rr*8+cc;if(rr>=0&&rr<8&&cc>=0&&cc<8&&!found.has(n)&&blocks.cells[n]===color){found.add(n);queue.push(n)}})}
    return [...found];
  }
  function renderBlocks(){gameShell('colors',`<div class="color-grid">${blocks.cells.map((color,i)=>`<button class="block-${color} ${color?'':'empty'}" data-color-cell="${i}" ${color?'':'disabled'}></button>`).join('')}</div><div class="game-status">Score ${blocks.score} · Tap groups of two or more matching blocks.</div>`,'Clear connected groups of the same color. Larger groups earn more points.');}
  function playBlocks(index){const group=blockGroup(index);if(group.length<2)return toast('Choose a connected color group');group.forEach(i=>blocks.cells[i]='');for(let col=0;col<8;col++){const values=[];for(let row=7;row>=0;row--){const value=blocks.cells[row*8+col];if(value)values.push(value)}for(let row=7;row>=0;row--)blocks.cells[row*8+col]=values[7-row]||''}blocks.score+=group.length*group.length*2;if(!blocks.rewarded&&blocks.score>=250){blocks.rewarded=true;award('colors',30)}renderBlocks();}

  function startWater(){const colors=['rose','sage','gold','blue'],liquid=colors.flatMap(color=>Array(4).fill(color));do{liquid.sort(()=>Math.random()-.5)}while(liquid.slice(0,4).every(x=>x===liquid[0]));water={tubes:Array.from({length:6},(_,i)=>i<4?liquid.slice(i*4,i*4+4):[]),selected:null,over:false};renderWater();}
  function waterWon(){return water.tubes.every(tube=>!tube.length||(tube.length===4&&tube.every(color=>color===tube[0])))}
  function renderWater(){gameShell('water',`<div class="water-tubes">${water.tubes.map((tube,i)=>`<button data-water-tube="${i}" class="${water.selected===i?'selected':''}"><span>${tube.map(color=>`<i class="water-${color}"></i>`).join('')}</span></button>`).join('')}</div><div class="game-status">${water.over?'Every color is sorted!':'Select a tube, then select where to pour.'}</div>`,'Pour matching colors together. Each glass holds four layers.');}
  function pourWater(index){if(water.over)return;if(water.selected===null){if(water.tubes[index].length){water.selected=index;renderWater()}return}const from=water.tubes[water.selected],to=water.tubes[index],color=from[from.length-1];if(index!==water.selected&&to.length<4&&(!to.length||to[to.length-1]===color)){let count=0;for(let i=from.length-1;i>=0&&from[i]===color;i--)count++;while(count--&&to.length<4)to.push(from.pop())}water.selected=null;if(waterWon()){water.over=true;award('water',35)}renderWater();}

  function startWords(){const targets=['BERRY','CAKE','FAIRY','TEA','PARK','DUCK'],size=8,grid=Array(size*size).fill('');const placements=[[0,0,0,1],[1,6,1,0],[2,1,1,1],[7,0,0,1],[4,3,0,1],[0,7,1,-1]];targets.forEach((word,w)=>{const [r,c,dr,dc]=placements[w];[...word].forEach((letter,i)=>grid[(r+dr*i)*size+c+dc*i]=letter)});const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ';words={targets,found:[],grid:grid.map(letter=>letter||alphabet[Math.floor(Math.random()*alphabet.length)]),selected:[]};renderWords();}
  function renderWords(){gameShell('words',`<div class="word-list">${words.targets.map(word=>`<span class="${words.found.includes(word)?'found':''}">${word}</span>`).join('')}</div><div class="word-grid">${words.grid.map((letter,i)=>`<button data-word-cell="${i}" class="${words.selected.includes(i)?'selected':''}">${letter}</button>`).join('')}</div><div class="game-status">Select neighboring letters in order to find each word.</div>`,'Find BERRY, CAKE, FAIRY, TEA, PARK, and DUCK in the letter garden.');}
  function selectLetter(index){if(!words.selected.length){words.selected=[index];renderWords();return}const last=words.selected.at(-1),lr=Math.floor(last/8),lc=last%8,r=Math.floor(index/8),c=index%8;if(words.selected.includes(index)||Math.max(Math.abs(r-lr),Math.abs(c-lc))!==1){words.selected=[index];renderWords();return}words.selected.push(index);const value=words.selected.map(i=>words.grid[i]).join('');const possible=words.targets.find(word=>!words.found.includes(word)&&word.startsWith(value));if(!possible){words.selected=[index]}else if(possible===value){words.found.push(value);words.selected=[];if(words.found.length===words.targets.length)award('words',40)}renderWords();}

  function spawnNumber(){const empty=numbers.cells.map((v,i)=>v?null:i).filter(i=>i!==null);if(empty.length)numbers.cells[empty[Math.floor(Math.random()*empty.length)]]=Math.random()<.9?2:4;}
  function startNumbers(){numbers={cells:Array(16).fill(0),score:0,rewarded:false};spawnNumber();spawnNumber();renderNumbers();}
  function renderNumbers(){gameShell('numbers',`<div class="number-grid">${numbers.cells.map(value=>`<div class="number-${value||0}">${value||''}</div>`).join('')}</div><div class="number-controls"><button data-number-move="up">↑</button><span><button data-number-move="left">←</button><button data-number-move="down">↓</button><button data-number-move="right">→</button></span></div><div class="game-status">Score ${numbers.score} · Combine equal numbers.</div>`,'Slide the board with the arrow buttons or keyboard. Reach 128 to win.');}
  function slideLine(line){const compact=line.filter(Boolean);for(let i=0;i<compact.length-1;i++){if(compact[i]===compact[i+1]){compact[i]*=2;numbers.score+=compact[i];compact.splice(i+1,1)}}return [...compact,...Array(4-compact.length).fill(0)]}
  function moveNumbers(direction){const before=numbers.cells.join(','),result=Array(16).fill(0);for(let n=0;n<4;n++){let indices;if(direction==='left')indices=[0,1,2,3].map(c=>n*4+c);if(direction==='right')indices=[3,2,1,0].map(c=>n*4+c);if(direction==='up')indices=[0,1,2,3].map(r=>r*4+n);if(direction==='down')indices=[3,2,1,0].map(r=>r*4+n);const moved=slideLine(indices.map(i=>numbers.cells[i]));indices.forEach((i,j)=>result[i]=moved[j])}numbers.cells=result;if(numbers.cells.join(',')!==before)spawnNumber();if(!numbers.rewarded&&numbers.cells.some(value=>value>=128)){numbers.rewarded=true;award('numbers',40)}renderNumbers();}

  function startMemory(){const flowers=['🌷','🌻','🌸','🌹','🌼','🪻'];memory={cards:[...flowers,...flowers].sort(()=>Math.random()-.5),open:[],matched:[],moves:0,locked:false};renderMemory()}
  function renderMemory(){gameShell('memory',`<div class="memory-grid">${memory.cards.map((flower,i)=>`<button data-memory-card="${i}" class="${memory.open.includes(i)||memory.matched.includes(i)?'open':''}" ${memory.matched.includes(i)?'disabled':''}><span>${memory.open.includes(i)||memory.matched.includes(i)?flower:'?'}</span></button>`).join('')}</div><div class="game-status">${memory.matched.length===12?'Every flower has a pair!':`Moves ${memory.moves} · Find all six flower pairs.`}</div>`,'Turn over two cards. Matching cottage flowers stay open.')}
  function flipMemory(index){if(memory.locked||memory.open.includes(index)||memory.matched.includes(index))return;memory.open.push(index);if(memory.open.length===2){memory.moves++;const[a,b]=memory.open;if(memory.cards[a]===memory.cards[b]){memory.matched.push(a,b);memory.open=[];if(memory.matched.length===12)award('memory',35);renderMemory()}else{memory.locked=true;renderMemory();setTimeout(()=>{memory.open=[];memory.locked=false;renderMemory()},650)}}else renderMemory()}

  function startCatch(){butterfly={score:0,spot:Math.floor(Math.random()*20),rewarded:false};renderCatch()}
  function renderCatch(){gameShell('catch',`<div class="butterfly-garden">${Array.from({length:20},(_,i)=>`<button data-catch-spot="${i}" class="${i===butterfly.spot?'flutter':''}">${i===butterfly.spot?'🦋':'🌿'}</button>`).join('')}</div><div class="game-status">Butterflies greeted ${butterfly.score}/10 · Follow the fluttering butterfly.</div>`,'Tap the butterfly as it visits different flowers. Greet ten to win.')}
  function catchButterfly(index){if(index!==butterfly.spot)return;butterfly.score++;let next;do{next=Math.floor(Math.random()*20)}while(next===butterfly.spot);butterfly.spot=next;if(butterfly.score>=10&&!butterfly.rewarded){butterfly.rewarded=true;award('catch',30)}renderCatch()}

  const patternColors=['rose','sage','gold','blue'];
  function startPattern(){pattern={sequence:[Math.floor(Math.random()*4),Math.floor(Math.random()*4),Math.floor(Math.random()*4)],input:[],round:1,rewarded:false};renderPattern()}
  function renderPattern(){gameShell('pattern',`<div class="fairy-sequence">${pattern.sequence.map((color,i)=>`<i class="pattern-${patternColors[color]}">${i+1}</i>`).join('')}</div><div class="pattern-buttons">${patternColors.map((color,i)=>`<button data-pattern-color="${i}" class="pattern-${color}" ${pattern.rewarded?'disabled':''}>${color}</button>`).join('')}</div><div class="game-status">${pattern.rewarded?'All five fairy patterns complete!':`Round ${pattern.round}/5 · Repeat the glowing color order.`}</div>`,'Read the numbered fairy lights from left to right, then press the matching colors.')}
  function playPattern(color){if(pattern.rewarded)return;const expected=pattern.sequence[pattern.input.length];if(color!==expected){pattern.input=[];toast('The lights twinkled away · try the sequence again');renderPattern();return}pattern.input.push(color);if(pattern.input.length===pattern.sequence.length){pattern.round++;pattern.input=[];if(pattern.round>5){pattern.rewarded=true;award('pattern',40);renderPattern();return}pattern.sequence.push(Math.floor(Math.random()*4))}renderPattern()}

  const starters={tic:startTic,fruit:startFruit,colors:startBlocks,water:startWater,words:startWords,numbers:startNumbers,memory:startMemory,catch:startCatch,pattern:startPattern};
  const previousInteract = interactPhysical;
  interactPhysical = function (element) {
    const name = element.querySelector('.object-name')?.textContent.trim();
    if (current === 'park' && name === 'Mini games') { openHub(); return; }
    previousInteract(element);
  };

  document.addEventListener('click', event => {
    const game=event.target.closest('[data-park-game]');if(game){starters[game.dataset.parkGame]();return}
    if(event.target.closest('[data-park-tea-animation]')){window.openParkTeaParty?.();return}
    if(event.target.closest('[data-park-hub]')){openHub();return}
    const reset=event.target.closest('[data-reset-park-game]');if(reset){starters[reset.dataset.resetParkGame]();return}
    const ticCell=event.target.closest('[data-tic-cell]');if(ticCell){playTic(Number(ticCell.dataset.ticCell));return}
    const fruitCell=event.target.closest('[data-fruit-cell]');if(fruitCell){mergeFruit(Number(fruitCell.dataset.fruitCell));return}
    const colorCell=event.target.closest('[data-color-cell]');if(colorCell){playBlocks(Number(colorCell.dataset.colorCell));return}
    const tube=event.target.closest('[data-water-tube]');if(tube){pourWater(Number(tube.dataset.waterTube));return}
    const letter=event.target.closest('[data-word-cell]');if(letter){selectLetter(Number(letter.dataset.wordCell));return}
    const move=event.target.closest('[data-number-move]');if(move){moveNumbers(move.dataset.numberMove)}
    const memoryCard=event.target.closest('[data-memory-card]');if(memoryCard){flipMemory(Number(memoryCard.dataset.memoryCard));return}
    const catchSpot=event.target.closest('[data-catch-spot]');if(catchSpot){catchButterfly(Number(catchSpot.dataset.catchSpot));return}
    const patternButton=event.target.closest('[data-pattern-color]');if(patternButton){playPattern(Number(patternButton.dataset.patternColor))}
  });

  document.addEventListener('keydown',event=>{if(activeGame!=='numbers'||document.getElementById('modal-wrap').hidden)return;const direction={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key];if(direction){event.preventDefault();event.stopImmediatePropagation();moveNumbers(direction)}},true);
})();
