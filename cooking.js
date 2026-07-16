(() => {
  const recipes2 = {
    'White Bread':{type:'bake',needs:{Flour:2,Milk:1,Eggs:1},minutes:30,temp:375},
    'Croissant':{type:'bake',needs:{Flour:2,Butter:2,Milk:1},minutes:22,temp:375},
    'Strawberry Cake':{type:'bake',needs:{Flour:2,Eggs:2,Milk:1,Sugar:2,Strawberries:2},minutes:40,temp:350},
    'Cookies':{type:'bake',needs:{Flour:1,Butter:1,Sugar:1,Eggs:1},minutes:15,temp:350},
    'Latte':{type:'drink',needs:{'Coffee Beans':1,Milk:1},minutes:5},
    'Lavender Tea':{type:'drink',needs:{'Tea Leaves':1,Honey:1,Vanilla:1},minutes:5},
    'Peach Tea':{type:'drink',needs:{'Tea Leaves':1,Honey:1},minutes:5},
    'Berry Smoothie':{type:'drink',needs:{Strawberries:2,Milk:1,Honey:1},minutes:5},
    'Apple Pie':{type:'bake',needs:{Flour:2,Butter:1,Sugar:1,Apples:3,Cinnamon:1},minutes:38,temp:375},
    'Blueberry Muffins':{type:'bake',needs:{Flour:2,Eggs:1,Milk:1,Sugar:1,Blueberries:2},minutes:24,temp:375},
    'Cinnamon Rolls':{type:'bake',needs:{Flour:2,Butter:1,Milk:1,Sugar:1,Cinnamon:2},minutes:26,temp:375},
    'Lemon Cupcakes':{type:'bake',needs:{Flour:2,Eggs:2,Sugar:1,Lemons:2,Vanilla:1},minutes:22,temp:350},
    'Chocolate Cake':{type:'bake',needs:{Flour:2,Eggs:2,Milk:1,Sugar:2,Cocoa:2},minutes:42,temp:350},
    'Oat Honey Cookies':{type:'bake',needs:{Oats:2,Butter:1,Honey:1,Eggs:1,Nuts:1},minutes:17,temp:350},
    'Hot Chocolate':{type:'drink',needs:{Cocoa:2,Milk:2,Sugar:1,Cream:1},minutes:6},
    'Vanilla Frappe':{type:'drink',needs:{'Coffee Beans':1,Milk:1,Cream:1,Vanilla:1,Sugar:1},minutes:5},
    'Peach Smoothie':{type:'drink',needs:{Peaches:2,Yogurt:1,Honey:1},minutes:5},
    'Spiced Apple Cider':{type:'drink',needs:{Apples:3,Cinnamon:1,Honey:1},minutes:7},
    'Caramel Latte':{type:'drink',needs:{'Coffee Beans':1,Milk:1,Caramel:1,Cream:1},minutes:5},
    'Raspberry Scones':{type:'bake',needs:{Flour:2,Butter:1,Milk:1,Raspberries:2,'Baking Powder':1},minutes:24,temp:375},
    'Pumpkin Bread':{type:'bake',needs:{Flour:2,Eggs:1,Pumpkin:2,'Brown Sugar':1,Cinnamon:1},minutes:38,temp:350},
    'Cherry Tart':{type:'bake',needs:{Flour:2,Butter:1,Sugar:1,Cherries:3,Vanilla:1},minutes:30,temp:375},
    'Matcha Cookies':{type:'bake',needs:{Flour:1,Butter:1,Sugar:1,Matcha:1,Eggs:1},minutes:16,temp:350},
    'Mocha':{type:'drink',needs:{'Coffee Beans':1,Milk:1,Cocoa:1,Cream:1},minutes:5},
    'Mint Tea':{type:'drink',needs:{'Tea Leaves':1,Mint:2,Honey:1},minutes:5},
    'Mango Smoothie':{type:'drink',needs:{Mango:2,Yogurt:1,Honey:1,Coconut:1},minutes:5}
    ,'Hazel’s Heirloom Buns':{type:'bake',needs:{Flour:2,Butter:1,Milk:1,Sugar:1,Cinnamon:2,Honey:1},minutes:28,temp:375,unlock:'Hazel’s Heirloom Buns'}
    ,'Lily’s Berry Birthday Cake':{type:'bake',needs:{Flour:2,Eggs:2,Milk:1,Sugar:2,Strawberries:3,Vanilla:1},minutes:44,temp:350,unlock:'Lily’s Berry Birthday Cake'}
    ,'Professor Maple’s Tea Cookies':{type:'bake',needs:{Flour:1,Butter:1,Sugar:1,Eggs:1,'Tea Leaves':1,Honey:1},minutes:18,temp:350,unlock:'Professor Maple’s Tea Cookies'}
    ,'Honeybell Berry Danish':{type:'bake',needs:{Flour:2,Butter:2,Sugar:1,Raspberries:2,Vanilla:1},minutes:25,temp:375,unlock:'Honeybell Berry Danish'}
    ,'Rose Garden Macarons':{type:'bake',needs:{Eggs:2,Sugar:2,Vanilla:1,Raspberries:2},minutes:20,temp:325,unlock:'Rose Garden Macarons'}
    ,'Festival Honey Cake':{type:'bake',needs:{Flour:2,Eggs:2,Butter:1,Honey:2,Cinnamon:1},minutes:38,temp:350,unlock:'Festival Honey Cake'}
  };
  const stationRecipes = {
    'Bread station':['White Bread','Cinnamon Rolls','Pumpkin Bread','Hazel’s Heirloom Buns'], 'Pastry station':['Croissant','Blueberry Muffins','Apple Pie','Raspberry Scones','Cherry Tart','Honeybell Berry Danish'],
    'Cake station':['Strawberry Cake','Chocolate Cake','Lily’s Berry Birthday Cake','Festival Honey Cake'], 'Cupcake station':['Lemon Cupcakes','Blueberry Muffins'],
    'Cookie station':['Cookies','Oat Honey Cookies','Matcha Cookies','Professor Maple’s Tea Cookies','Rose Garden Macarons'], 'Pie station':['Apple Pie','Cherry Tart'],
    'Coffee station':['Latte','Caramel Latte','Hot Chocolate','Vanilla Frappe','Mocha'],
    'Tea station':['Lavender Tea','Peach Tea','Mint Tea','Spiced Apple Cider'], 'Smoothie station':['Berry Smoothie','Peach Smoothie','Mango Smoothie'],
    Ovens:Object.keys(recipes2).filter(name => recipes2[name].type === 'bake')
  };
  const ingredients = [...new Set(Object.values(recipes2).flatMap(recipe => Object.keys(recipe.needs)))];
  ingredients.forEach(name => { if (state.inventory[name] == null) state.inventory[name] = 6; });
  state.bakingSkill = Object.assign({xp:0,batches:0,best:0}, state.bakingSkill || {});
  state.stockQuality = state.stockQuality || {};
  save();

  let cook = freshCook('White Bread', 'Bread station');
  let measureTimer = null, measureLockTimer = null;

  function freshCook(recipe, category) {
    return {recipe,category,stage:'intro',measureIndex:0,measureScores:[],techniqueScores:[],ovenScores:[],decorateScores:[],pipeHits:new Set(),pipePoints:[],kneadExpected:'left',kneadTaps:0,lastKnead:0,spent:false,result:null,collected:false};
  }
  function skillLevel() { return Math.min(10, 1 + Math.floor((state.bakingSkill.xp || 0) / 120)); }
  function skillProgress() { return (state.bakingSkill.xp || 0) % 120; }
  function available(name) { return state.inventory[name] || 0; }
  function canBake(recipe) { return Object.entries(recipe.needs).every(([name,amount]) => available(name) >= amount); }
  function isUnlocked(name) { const recipe=recipes2[name];return !recipe?.unlock||(state.unlockedRecipes||[]).includes(recipe.unlock); }
  function isDough(name) { return /Bread|Croissant|Cinnamon Roll|Bun|Pie/.test(name); }
  function needsDecorating(name) { return /Cake|Cupcake|Cookie|Muffin|Pie/.test(name); }
  function needsPiping(name) { return /Cake|Cupcake/.test(name); }
  function decorationProfile(name) {
    if (/Strawberry/i.test(name)) return {style:'strawberry',title:'Strawberries & cream',instruction:'Place fresh berries in a balanced flower pattern.',points:[[50,18],[26,39],[74,39],[35,70],[65,70]]};
    if (/Chocolate/i.test(name)) return {style:'chocolate',title:'Chocolate curls & truffles',instruction:'Arrange rich chocolate pieces around the ganache.',points:[[23,25],[50,18],[77,25],[33,62],[67,62]]};
    if (/Lemon|Cupcake/i.test(name)) return {style:'lemon',title:'Lemon blossoms',instruction:'Give each cupcake its own lemon-and-vanilla topper.',points:[[24,28],[50,22],[76,28],[35,68],[66,68]]};
    return {style:'classic',title:'Cottage finishing touches',instruction:'Place every decoration evenly across the bake.',points:[[22,30],[50,20],[76,32],[35,62],[67,64]]};
  }
  function pipingProfile(name) {
    if (/Strawberry/i.test(name)) return {style:'rosette',title:'Pipe a rosette wreath',instruction:'Circle the berry guides to create soft cream rosettes.',targets:[[50,15],[72,23],[84,48],[72,73],[50,83],[28,73],[16,48],[28,23]]};
    if (/Chocolate/i.test(name)) return {style:'zigzag',title:'Pipe a chocolate ribbon',instruction:'Sweep back and forth to form a glossy zigzag ribbon.',targets:[[18,22],[78,22],[22,38],[82,38],[18,56],[78,56],[22,74],[82,74]]};
    if (/Lemon|Cupcake/i.test(name)) return {style:'swirls',title:'Pipe five cupcake swirls',instruction:'Connect the swirl centers with light vanilla frosting.',targets:[[25,27],[50,19],[75,27],[34,67],[66,67],[25,47],[50,48],[75,47]]};
    return {style:'scallop',title:'Pipe a scalloped border',instruction:'Trace the guides to finish a neat cottage border.',targets:[[22,28],[50,20],[78,28],[31,52],[68,52],[22,76],[50,70],[78,76]]};
  }
  function categoryFor(prefer='') {
    const found = Object.keys(stationRecipes).sort((a,b)=>b.length-a.length).find(name => new RegExp(name.replace(/ station$/i,''),'i').test(prefer));
    return found || (/oven|bake/i.test(prefer) ? 'Ovens' : 'Bread station');
  }
  function spendIngredients() {
    if (cook.spent) return true;
    const recipe = recipes2[cook.recipe];
    if (!canBake(recipe)) return false;
    Object.entries(recipe.needs).forEach(([name,amount]) => state.inventory[name] -= amount);
    cook.spent = true; save(); return true;
  }
  function percent(score) { return Math.round((score || 0) * 100); }
  function average(values) { return values.length ? values.reduce((a,b)=>a+b,0) / values.length : 0; }
  function stageScores() {
    return [average(cook.measureScores),average(cook.techniqueScores),...cook.ovenScores,...cook.decorateScores].filter(Number.isFinite);
  }
  function grade(score) {
    if (score >= 94) return ['Masterpiece','✦✦✦✦✦'];
    if (score >= 84) return ['Excellent','✦✦✦✦'];
    if (score >= 70) return ['Lovely','✦✦✦'];
    if (score >= 55) return ['Good','✦✦'];
    return ['Rustic','✦'];
  }
  function processSteps() {
    const recipe = recipes2[cook.recipe];
    const steps = ['Measure ingredients',isDough(cook.recipe)?'Knead dough':'Mix evenly'];
    if (recipe.type === 'bake') steps.push('Time the oven');
    if (needsDecorating(cook.recipe)) steps.push(/Cake|Cupcake/.test(cook.recipe)?'Decorate cake':'Add finishing touches');
    if (needsPiping(cook.recipe)) steps.push('Pipe frosting');
    steps.push('Quality check');
    const order = ['intro','measure','technique','oven','decorate','pipe','result'];
    const current = order.indexOf(cook.stage);
    return steps.map((label,index)=>`<li class="${index < current-1 || cook.stage==='result' ? 'done' : index===Math.max(0,current-1) ? 'active' : ''}">${label}</li>`).join('');
  }
  function openCooking(prefer='') {
    const direct = recipes2[prefer]&&isUnlocked(prefer) ? prefer : null;
    const category = direct ? (Object.keys(stationRecipes).find(key => stationRecipes[key].includes(direct)) || 'Ovens') : categoryFor(prefer);
    const recipe = direct || stationRecipes[category].find(isUnlocked) || 'White Bread';
    cook = freshCook(recipe,category); renderCook();
  }
  window.openSkillBaking = openCooking;

  function stageMarkup() {
    const recipe = recipes2[cook.recipe];
    if (cook.stage === 'intro') return `<section class="skill-intro"><div class="recipe-hero ${recipe.type}"><i></i></div><h3>${cook.recipe}</h3><p>${recipe.type==='bake'?'Measure, prepare, bake and finish this recipe by hand.':'Measure and prepare this drink by hand.'}</p><div class="ingredient-check">${Object.entries(recipe.needs).map(([name,amount])=>`<span class="${available(name)>=amount?'ready':'missing'}"><b>${name}</b>${available(name)} / ${amount}</span>`).join('')}</div><button class="skill-primary" data-start-batch ${canBake(recipe)?'':'disabled'}>${canBake(recipe)?'Start interactive batch':'Buy missing ingredients first'}</button></section>`;
    if (cook.stage === 'measure') {
      const entries = Object.entries(recipe.needs), [name,amount] = entries[cook.measureIndex] || entries.at(-1);
      const target = 43 + (cook.measureIndex * 11) % 34, tolerance = 7 + skillLevel();
      return `<section class="measure-game"><p class="stage-kicker">STEP 1 · MEASURE</p><h3>${name} × ${amount}</h3><p>Hold the pour button and release inside the highlighted target.</p><div class="measure-cup"><i class="measure-fill" style="height:0%"></i><i class="measure-target" style="bottom:${target-tolerance/2}%;height:${tolerance}%"></i><b data-measure-readout>0</b></div><button class="skill-hold" data-measure-hold data-target="${target}">Hold to pour</button><div class="round-dots">${entries.map((_,index)=>`<i class="${index<cook.measureIndex?'done':index===cook.measureIndex?'active':''}"></i>`).join('')}</div></section>`;
    }
    if (cook.stage === 'technique' && isDough(cook.recipe)) return `<section class="knead-game"><p class="stage-kicker">STEP 2 · KNEAD</p><h3>Build a steady rhythm</h3><p>Alternate hands. Aim for one press every half second.</p><div class="dough-blob"><i></i></div><div class="knead-controls"><button data-knead="left" class="${cook.kneadExpected==='left'?'next':''}">← Left</button><button data-knead="right" class="${cook.kneadExpected==='right'?'next':''}">Right →</button></div><div class="knead-count">${cook.kneadTaps} / 8 folds</div></section>`;
    if (cook.stage === 'technique') return `<section class="mix-game"><p class="stage-kicker">STEP 2 · MIX</p><h3>Stop inside the green zone</h3><p>Four accurate stops make a smooth, even mixture.</p><div class="timing-track"><i class="good-zone"></i><b class="moving-whisk"></b></div><button class="skill-primary" data-mix-hit>Stop whisk · ${cook.techniqueScores.length}/4</button><div class="live-score">${cook.techniqueScores.map(score=>`<span>${percent(score)}%</span>`).join('')}</div></section>`;
    if (cook.stage === 'oven') {
      const running = !!cook.ovenStarted;
      return `<section class="oven-game ${running?'running':''}"><p class="stage-kicker">STEP 3 · OVEN</p><h3>${running?'Watch the bake':'Set the temperature'}</h3>${running?`<p>Take it out while the timer is inside the golden zone.</p><div class="oven-window"><i class="oven-food"></i></div><div class="oven-timer"><i data-oven-progress></i><b class="oven-good"></b></div><strong data-oven-clock>0.0s</strong><button class="skill-primary oven-take" data-oven-take>Take it out</button>`:`<p>The recipe calls for ${recipe.temp}°F. Set the dial as closely as possible.</p><input class="temperature-slider" data-oven-temp type="range" min="300" max="425" step="5" value="350"><output data-temp-output>350°F</output><button class="skill-primary" data-oven-start>Preheat and start timer</button>`}</section>`;
    }
    if (cook.stage === 'decorate') { const profile=decorationProfile(cook.recipe);return `<section class="decorate-game decoration-${profile.style}"><p class="stage-kicker">FINISHING · DECORATE</p><h3>${profile.title}</h3><p>${profile.instruction}</p><div class="decorate-board ${profile.style}">${profile.points.map((point,index)=>`<button data-decoration="${index}" class="${cook.decorations?.has(index)?'placed':''}" style="left:${point[0]}%;top:${point[1]}%" aria-label="Place ${profile.title} decoration ${index+1}"></button>`).join('')}</div><button class="skill-primary" data-finish-decorate ${(cook.decorations?.size||0)<profile.points.length?'disabled':''}>Finish decorating</button></section>`; }
    if (cook.stage === 'pipe') {
      const profile=pipingProfile(cook.recipe),targets=profile.targets;
      return `<section class="pipe-game piping-${profile.style}"><p class="stage-kicker">FINISHING · PIPE FROSTING</p><h3>${profile.title}</h3><p>${profile.instruction} Your frosting remains on the cake when you release.</p><div class="piping-board ${profile.style}" data-piping-board><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline data-pipe-line points="${cook.pipePoints.map(p=>p.join(',')).join(' ')}"></polyline></svg>${targets.map((point,index)=>`<i data-pipe-target="${index}" class="${cook.pipeHits.has(index)?'hit':''}" style="left:${point[0]}%;top:${point[1]}%"></i>`).join('')}<b class="piping-bag">▾</b></div><button class="skill-primary" data-finish-pipe ${cook.pipeHits.size<4?'disabled':''}>Finish piping · ${cook.pipeHits.size}/8</button></section>`;
    }
    const [label,stars] = grade(cook.result.score);
    const pipe=pipingProfile(cook.recipe),keptPiping=cook.pipePoints.length?`<div class="finished-cake-preview ${pipe.style}"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${cook.pipePoints.map(p=>p.join(',')).join(' ')}"></polyline></svg><small>Your ${pipe.style} piping</small></div>`:'';
    return `<section class="bake-result"><p class="stage-kicker">BATCH COMPLETE</p>${keptPiping}<div class="quality-medal"><b>${cook.result.score}</b><span>QUALITY</span></div><h3>${label} ${stars}</h3><p>${cook.recipe} · ${cook.result.note}</p><div class="score-breakdown">${cook.result.parts.map(part=>`<span><b>${part.value}%</b>${part.name}</span>`).join('')}</div><p class="skill-earned">Baking skill +${cook.result.xp} XP</p><button class="skill-primary" data-collect-batch ${cook.collected?'disabled':''}>${cook.collected?'Added to bakery stock':'Collect 3 finished items'}</button><button class="skill-secondary" data-bake-again>Bake another batch</button></section>`;
  }

  function renderCook() {
    const recipe = recipes2[cook.recipe], choices = (stationRecipes[cook.category] || Object.keys(recipes2)).filter(isUnlocked);
    modal(`<div class="skill-baking-modal"><header class="baking-header"><div><p>HONEYBELL KITCHEN</p><h2>Interactive baking</h2></div><div class="baking-level"><b>Skill ${skillLevel()}</b><span><i style="width:${skillProgress()/1.2}%"></i></span><small>${skillProgress()} / 120 XP</small></div><div class="quality-stock"><b>${state.stock[cook.recipe]||0}</b><small>in stock</small></div></header><div class="skill-bake-layout"><aside class="skill-recipes"><h3>${cook.category}</h3>${choices.map(name=>`<button class="${name===cook.recipe?'active':''}" data-skill-recipe="${name}">${name}</button>`).join('')}</aside><main class="skill-game-stage">${stageMarkup()}</main><aside class="baking-process"><h3>Recipe process</h3><ol>${processSteps()}</ol><div class="skill-tip"><b>Higher skill</b><p>Wider timing windows and a quality bonus make excellent pastries easier.</p></div>${cook.spent?'<small>Ingredients have been used for this batch.</small>':''}</aside></div></div>`);
  }

  function nextAfterTechnique() { cook.stage = recipes2[cook.recipe].type === 'bake' ? 'oven' : 'result'; if (cook.stage==='result') finishBatch(); else renderCook(); }
  function nextAfterOven() { cook.stage = needsDecorating(cook.recipe) ? 'decorate' : 'result'; if (cook.stage==='result') finishBatch(); else { cook.decorations = new Set(); renderCook(); } }
  function nextAfterDecorate() { cook.decorateScores.push((cook.decorations?.size||0)/5); cook.stage = needsPiping(cook.recipe) ? 'pipe' : 'result'; if (cook.stage==='result') finishBatch(); else renderCook(); }
  function finishBatch() {
    const named = [
      {name:'Measuring',value:percent(average(cook.measureScores))},
      {name:isDough(cook.recipe)?'Kneading':'Mixing',value:percent(average(cook.techniqueScores))}
    ];
    if (cook.ovenScores.length) named.push({name:'Oven',value:percent(average(cook.ovenScores))});
    if (cook.decorateScores.length) named.push({name:'Finishing',value:percent(average(cook.decorateScores))});
    const raw = named.reduce((sum,part)=>sum+part.value,0)/named.length;
    const score = Math.max(20,Math.min(100,Math.round(raw + (skillLevel()-1)*1.35 + (state.reputationEquipmentBonus||0) + (state.chefLessonDay===state.day?2:0))));
    const xp = 12 + Math.round(score/5);
    cook.result = {score,xp,parts:named,note:score>=84?'Customers will pay extra for this batch.':score>=60?'A dependable bakery-quality batch.':'Charming and rustic—practice will improve it.'};
    cook.stage='result'; renderCook();
  }

  function startMeasure(button, pointerEvent) {
    if (button.dataset.measuring) return;
    if (!spendIngredients()) return toast('Missing ingredients');
    const target = +button.dataset.target, started = performance.now();
    clearInterval(measureTimer);clearTimeout(measureLockTimer);
    button.classList.add('pouring');button.textContent='Keep holding…';
    measureTimer = setInterval(()=>{
      const value = Math.min(target,(performance.now()-started)/12);
      button.dataset.value = value;
      const fill=document.querySelector('.measure-fill'), readout=document.querySelector('[data-measure-readout]');
      if(fill) fill.style.height=`${value}%`; if(readout) readout.textContent=Math.round(value);
      if(value>=target){
        clearInterval(measureTimer);measureTimer=null;button.classList.add('on-target');button.textContent='Target reached!';
        measureLockTimer=setTimeout(()=>{if(button.isConnected&&button.dataset.measuring)stopMeasure(button)},420);
      }
    },16);
    button.setPointerCapture?.(pointerEvent.pointerId);
    button.dataset.measuring='true'; button.dataset.targetValue=target;
  }
  function stopMeasure(button) {
    if (!button?.dataset.measuring) return;
    delete button.dataset.measuring;clearInterval(measureTimer);clearTimeout(measureLockTimer);measureTimer=null;measureLockTimer=null;
    const value=+(button.dataset.value||0), target=+button.dataset.targetValue;
    const adjustedError=Math.max(0,Math.abs(value-target)-skillLevel()*1.2);
    cook.measureScores.push(Math.max(0,1-adjustedError/42));
    cook.measureIndex++;
    if(cook.measureIndex>=Object.keys(recipes2[cook.recipe].needs).length){cook.stage='technique';cook.mixStarted=performance.now();}
    renderCook();
  }

  document.addEventListener('pointerdown',event=>{
    const measure=event.target.closest('[data-measure-hold]'); if(measure){event.preventDefault();startMeasure(measure,event);return;}
    const board=event.target.closest('[data-piping-board]'); if(board){cook.piping=true;addPipePoint(event,board);board.setPointerCapture?.(event.pointerId);}
  });
  document.addEventListener('pointermove',event=>{const board=event.target.closest('[data-piping-board]');if(cook.piping&&board)addPipePoint(event,board)});
  function releasePointer(){const measure=document.querySelector('[data-measure-hold][data-measuring]');if(measure)stopMeasure(measure);cook.piping=false;}
  document.addEventListener('pointerup',releasePointer);
  document.addEventListener('pointercancel',releasePointer);
  window.addEventListener('blur',releasePointer);
  function addPipePoint(event,board){
    const rect=board.getBoundingClientRect(),x=Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)),y=Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100));
    cook.pipePoints.push([x.toFixed(1),y.toFixed(1)]); if(cook.pipePoints.length>160)cook.pipePoints.shift();
    pipingProfile(cook.recipe).targets.forEach((point,index)=>{if(Math.hypot(x-point[0],y-point[1])<10)cook.pipeHits.add(index)});
    const line=board.querySelector('[data-pipe-line]');if(line)line.setAttribute('points',cook.pipePoints.map(p=>p.join(',')).join(' '));
    board.querySelectorAll('[data-pipe-target]').forEach((target,index)=>target.classList.toggle('hit',cook.pipeHits.has(index)));
    const finish=document.querySelector('[data-finish-pipe]');if(finish){finish.disabled=cook.pipeHits.size<4;finish.textContent=`Finish piping · ${cook.pipeHits.size}/8`;}
  }

  document.addEventListener('input',event=>{if(event.target.matches('[data-oven-temp]'))document.querySelector('[data-temp-output]').textContent=`${event.target.value}°F`;});
  document.addEventListener('click',event=>{
    const button=event.target.closest('button'); if(!button)return;
    if(button.dataset.skillRecipe){clearInterval(cook.ovenInterval);cook=freshCook(button.dataset.skillRecipe,Object.keys(stationRecipes).find(key=>stationRecipes[key].includes(button.dataset.skillRecipe))||cook.category);renderCook();return;}
    if(button.dataset.startBatch!==undefined){if(!spendIngredients())return;cook.stage='measure';renderCook();return;}
    if(button.dataset.mixHit!==undefined){const cycle=1600,phase=((performance.now()-(cook.mixStarted||(cook.mixStarted=performance.now())))%cycle)/cycle,position=phase<.5?phase*200:(1-phase)*200;const error=Math.max(0,Math.abs(position-50)-skillLevel()*1.3);cook.techniqueScores.push(Math.max(0,1-error/50));if(cook.techniqueScores.length>=4)nextAfterTechnique();else{renderCook();cook.mixStarted=performance.now();}return;}
    if(button.dataset.knead){if(button.dataset.knead!==cook.kneadExpected)return toast(`Use the ${cook.kneadExpected} hand next`);const now=performance.now(),elapsed=cook.lastKnead?now-cook.lastKnead:500,error=Math.max(0,Math.abs(elapsed-500)-skillLevel()*12);cook.techniqueScores.push(Math.max(0,1-error/550));cook.lastKnead=now;cook.kneadExpected=cook.kneadExpected==='left'?'right':'left';cook.kneadTaps++;if(cook.kneadTaps>=8)nextAfterTechnique();else renderCook();return;}
    if(button.dataset.ovenStart!==undefined){const selected=+(document.querySelector('[data-oven-temp]')?.value||350),recipe=recipes2[cook.recipe],error=Math.max(0,Math.abs(selected-recipe.temp)-skillLevel()*2);cook.ovenScores.push(Math.max(0,1-error/80));cook.ovenStarted=performance.now();renderCook();cook.ovenInterval=setInterval(()=>{const elapsed=performance.now()-cook.ovenStarted,progress=Math.min(100,elapsed/65);const bar=document.querySelector('[data-oven-progress]'),clock=document.querySelector('[data-oven-clock]');if(bar)bar.style.width=`${progress}%`;if(clock)clock.textContent=`${(elapsed/1000).toFixed(1)}s`;},40);return;}
    if(button.dataset.ovenTake!==undefined){clearInterval(cook.ovenInterval);const elapsed=performance.now()-cook.ovenStarted,error=Math.max(0,Math.abs(elapsed-5200)-skillLevel()*90);cook.ovenScores.push(Math.max(0,1-error/3500));nextAfterOven();return;}
    if(button.dataset.decoration!==undefined){cook.decorations=cook.decorations||new Set();cook.decorations.add(+button.dataset.decoration);button.classList.add('placed');const finish=document.querySelector('[data-finish-decorate]');if(finish)finish.disabled=cook.decorations.size<5;return;}
    if(button.dataset.finishDecorate!==undefined){nextAfterDecorate();return;}
    if(button.dataset.finishPipe!==undefined){cook.decorateScores.push(cook.pipeHits.size/8);finishBatch();return;}
    if(button.dataset.collectBatch!==undefined&&!cook.collected){const score=cook.result.score;state.stock[cook.recipe]=(state.stock[cook.recipe]||0)+3;state.stockQuality[cook.recipe]=state.stockQuality[cook.recipe]||[];state.stockQuality[cook.recipe].push(score,score,score);state.bakingSkill.xp+=cook.result.xp;state.bakingSkill.batches++;state.bakingSkill.best=Math.max(state.bakingSkill.best||0,score);state.minute+=recipes2[cook.recipe].minutes;state.energy=Math.max(0,(state.energy||100)-4);cook.collected=true;updateHUD();save();toast(`${grade(score)[0]} ${cook.recipe} · +3 stock`);renderCook();return;}
    if(button.dataset.bakeAgain!==undefined){cook=freshCook(cook.recipe,cook.category);renderCook();}
  });

  document.addEventListener('click',event=>{const legacy=event.target.closest('[data-skill-launch-recipe]');if(legacy)openCooking(legacy.dataset.skillLaunchRecipe);},true);
  const previousKitchenRender=renderRoom;
  renderRoom=function(){previousKitchenRender();if(current==='bakery'&&currentTab==='Kitchen'&&(state.stock['Apple Pie']||0)>0)document.querySelector('.physical-shell')?.insertAdjacentHTML('beforeend','<div class="finished-pie-product" role="img" aria-label="One finished apple pie on the serving table"></div>');};
  const previousInteract=interactPhysical;
  interactPhysical=function(element){if(current==='bakery'&&currentTab==='Kitchen'){const action=element.dataset.actionName||'',name=element.querySelector('.object-name')?.textContent||'';if(/Bake|Coffee|Tea|Smoothie|Oven|Bread|Pastry|Cake|Cupcake|Cookie|Pie|Blend/i.test(`${action} ${name}`)){openCooking(`${action} ${name}`);return;}}previousInteract(element);};
})();
