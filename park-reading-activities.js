(() => {
  let butterflyActivity = null;

  const butterflySupplies = [
    ['Nectar flowers', '🌺'],
    ['Fresh water', '💧'],
    ['Sunny stone', '🪨']
  ];

  const books = [
    {
      title: 'Honeybell Recipe Book',
      icon: '📕',
      description: 'Study measuring, mixing, and decorating tips.',
      reward: '+8 Baking XP'
    },
    {
      title: 'Fairy Village Storybook',
      icon: '📗',
      description: 'Relax with a gentle story about the village.',
      reward: '+6 Energy'
    },
    {
      title: 'Cottage Garden Almanac',
      icon: '📘',
      description: 'Learn which herbs grow best this season.',
      reward: '+1 Mint'
    },
    {
      title: 'Honeybell Village News',
      icon: '📰',
      description: 'Read local events, bakery notices, and friendly updates.',
      reward: '+1 Friendship Star'
    }
  ];

  function openBookshelf() {
    modal(`<div class="bookshelf-reading">
      <header>
        <small>ROSEMARY COTTAGE BOOKSHELF</small>
        <h2>Choose Something to Read</h2>
        <p>Select a book and settle into a quiet reading moment.</p>
      </header>
      <div class="reading-room-scene">
        <i class="reading-window"></i>
        <i class="reading-chair"></i>
        <i class="reading-lamp"></i>
        <i class="reading-books"></i>
        <span>📖</span>
      </div>
      <section class="reading-options">
        ${books.map((book, index) => `<button data-bookshelf-read="${index}">
          <i>${book.icon}</i>
          <span><b>${book.title}</b><small>${book.description}</small></span>
          <em>${book.reward}</em>
        </button>`).join('')}
      </section>
    </div>`);
  }

  function readBook(index) {
    const book = books[index];
    if (!book) return;
    state.booksReadDays = state.booksReadDays || {};
    const key = `${state.day}:${index}`;
    const firstToday = !state.booksReadDays[key];

    state.minute = Math.min(1439, (state.minute || 540) + 15);
    if (firstToday) {
      state.booksReadDays[key] = true;
      if (index === 0) {
        state.bakingSkill = state.bakingSkill || { xp: 0 };
        state.bakingSkill.xp += 8;
      } else if (index === 1) {
        state.energy = Math.min(100, (state.energy || 100) + 6);
      } else if (index === 2) {
        state.inventory.Mint = (state.inventory.Mint || 0) + 1;
      } else {
        state.stars = (state.stars || 0) + 1;
      }
    }

    updateHUD();
    save();
    modal(`<div class="reading-finished">
      <div class="turning-pages">${book.icon}<i></i><i></i><i></i></div>
      <small>QUIET READING TIME</small>
      <h2>${book.title}</h2>
      <p>${firstToday ? `${book.reward} earned.` : 'You enjoy reading this book again.'}</p>
      <button data-reading-back>Choose another book</button>
    </div>`);
  }

  function openButterflyGarden() {
    butterflyActivity = { placed: new Set() };
    renderButterflyGarden();
  }

  function renderButterflyGarden() {
    const complete = butterflyActivity.placed.size === butterflySupplies.length;
    modal(`<div class="butterfly-habitat ${complete ? 'habitat-complete' : ''}">
      <header>
        <small>WILLOW PARK BUTTERFLY GARDEN</small>
        <h2>Prepare a Butterfly Habitat</h2>
        <p>Drag or tap each item to make the garden welcoming.</p>
      </header>
      <div class="butterfly-workspace">
        <aside>
          ${butterflySupplies.map(([name, icon], index) => `<button draggable="true"
            data-butterfly-supply="${index}"
            class="${butterflyActivity.placed.has(index) ? 'placed' : ''}"
            ${butterflyActivity.placed.has(index) ? 'disabled' : ''}>
            <i>${icon}</i><b>${name}</b><small>${butterflyActivity.placed.has(index) ? 'Placed' : 'Drag or tap'}</small>
          </button>`).join('')}
        </aside>
        <section class="butterfly-scene" data-butterfly-drop>
          <i class="habitat-sun"></i>
          <div class="habitat-flowers">🌷　🌼　🌸　🌺</div>
          <div class="habitat-butterflies">🦋　🦋　🦋　🦋</div>
          <div class="habitat-items">
            ${[...butterflyActivity.placed].map(index => `<span class="habitat-item item-${index}">${butterflySupplies[index][1]}</span>`).join('')}
          </div>
          <output>${complete ? 'The butterflies have arrived!' : `${butterflyActivity.placed.size} / ${butterflySupplies.length} habitat items placed`}</output>
        </section>
      </div>
      <button data-butterfly-finish ${complete ? '' : 'disabled'}>${complete ? 'Greet the butterflies' : 'Prepare the whole habitat'}</button>
    </div>`);
  }

  function addButterflySupply(index) {
    if (!butterflyActivity || !butterflySupplies[index]) return;
    butterflyActivity.placed.add(index);
    renderButterflyGarden();
  }

  function finishButterflyGarden() {
    if (!butterflyActivity || butterflyActivity.placed.size !== butterflySupplies.length) return;
    const firstToday = state.butterflyHabitatDay !== state.day;
    if (firstToday) {
      state.butterflyHabitatDay = state.day;
      state.coins += 25;
      state.stars += 2;
      updateHUD();
      save();
    }
    const status = document.querySelector('.butterfly-scene output');
    if (status) status.textContent = firstToday
      ? 'Butterflies greeted · +25 coins · +2 friendship stars'
      : 'The butterflies flutter around you happily.';
    document.querySelector('.butterfly-habitat')?.classList.add('butterfly-celebration');
  }

  function openPlayground() {
    modal(`<div class="willow-playground">
      <header>
        <small>WILLOW PARK PLAYGROUND</small>
        <h2>Choose a Playground Activity</h2>
        <p>Play on the equipment or invite a village friend to join.</p>
      </header>
      <div class="playground-scene">
        <i class="playground-cloud one"></i><i class="playground-cloud two"></i>
        <i class="playground-tree"></i>
        <i class="playground-swing"></i>
        <i class="playground-slide"></i>
        <i class="playground-hopscotch"></i>
      </div>
      <div class="playground-options">
        <button data-playground-activity="swing"><i>🌿</i><b>Flower Swing</b><span>Swing beneath the willow branches</span></button>
        <button data-playground-activity="slide"><i>🛝</i><b>Garden Slide</b><span>Climb up and slide through flower petals</span></button>
        <button data-playground-activity="hopscotch"><i>🌸</i><b>Fairy Hopscotch</b><span>Follow the glowing garden squares</span></button>
      </div>
    </div>`);
  }

  function playOnPlayground(kind) {
    const labels = {
      swing: ['Flower Swing', 'The swing glides gently beneath the willow tree.'],
      slide: ['Garden Slide', 'You race down the slide while flower petals float past.'],
      hopscotch: ['Fairy Hopscotch', 'The stepping stones glow as you hop across them.']
    };
    if (!labels[kind]) return;
    state.playgroundDays = state.playgroundDays || {};
    const key = `${state.day}:${kind}`;
    const firstToday = !state.playgroundDays[key];
    if (firstToday) {
      state.playgroundDays[key] = true;
      state.coins += 15;
      state.energy = Math.min(100, (state.energy || 100) + 5);
      updateHUD();
      save();
    }
    modal(`<div class="playground-playing activity-${kind}">
      <div class="playground-animation">
        <i class="animated-player"></i>
        <i class="petal p1">🌸</i><i class="petal p2">🌼</i><i class="petal p3">🌸</i>
      </div>
      <small>WILLOW PARK PLAYGROUND</small>
      <h2>${labels[kind][0]}</h2>
      <p>${labels[kind][1]}</p>
      <strong>${firstToday ? '+15 coins · +5 energy' : 'A cheerful extra playtime!'}</strong>
      <button data-playground-back>Choose another activity</button>
    </div>`);
  }

  document.addEventListener('dragstart', event => {
    const supply = event.target.closest('[data-butterfly-supply]');
    if (supply) event.dataTransfer.setData('text/butterfly-supply', supply.dataset.butterflySupply);
  });
  document.addEventListener('dragover', event => {
    if (event.target.closest('[data-butterfly-drop]')) event.preventDefault();
  });
  document.addEventListener('drop', event => {
    if (!event.target.closest('[data-butterfly-drop]')) return;
    event.preventDefault();
    addButterflySupply(Number(event.dataTransfer.getData('text/butterfly-supply')));
  });
  document.addEventListener('click', event => {
    const book = event.target.closest('[data-bookshelf-read]');
    if (book) { readBook(Number(book.dataset.bookshelfRead)); return; }
    if (event.target.closest('[data-reading-back]')) { openBookshelf(); return; }
    const supply = event.target.closest('[data-butterfly-supply]');
    if (supply) { addButterflySupply(Number(supply.dataset.butterflySupply)); return; }
    if (event.target.closest('[data-butterfly-finish]')) { finishButterflyGarden(); return; }
    const playground = event.target.closest('[data-playground-activity]');
    if (playground) { playOnPlayground(playground.dataset.playgroundActivity); return; }
    if (event.target.closest('[data-playground-back]')) openPlayground();
  }, true);

  const previousInteract = interactPhysical;
  interactPhysical = function (object) {
    const name = object?.querySelector('.object-name')?.textContent.trim() || '';
    if (current === 'cottage' && name === 'Bookshelf') {
      openBookshelf();
      return;
    }
    if (current === 'park' && currentTab === 'Gardens' && name === 'Butterfly garden') {
      openButterflyGarden();
      return;
    }
    if (current === 'park' && currentTab === 'Gardens' && name === 'Playground') {
      openPlayground();
      return;
    }
    previousInteract(object);
  };
})();
