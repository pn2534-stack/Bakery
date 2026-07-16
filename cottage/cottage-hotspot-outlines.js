(() => {
  'use strict';

  const ROOM_KEY = 'cottage|Living room';
  const SVG_URL = 'cottage/living-room-outlines.svg';
  const OUTLINED_OBJECTS = new Set([
    'Fireplace',
    'Television',
    'Bookshelf',
    'Armchair',
    'Cottage sofa',
    'Coffee table',
    'Pet bed',
    'Indoor plants'
  ]);

  let svgMarkupPromise;
  let clickedHotspotName = '';

  const roomKey = () => `${current}|${currentTab}`;

  function objectName(object) {
    const label = object?.querySelector('.object-name');
    return label?.querySelector('span')?.textContent.trim()
      || object?.dataset.objectName?.replace(/-/g, ' ')
      || label?.textContent.trim()
      || '';
  }

  function loadOutlineMarkup() {
    if (!svgMarkupPromise) {
      svgMarkupPromise = fetch(SVG_URL, { cache: 'force-cache' })
        .then(response => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.text();
        })
        .catch(error => {
          console.warn(
            '[Cottage outlines] SVG could not be loaded. Existing cottage interactions remain active.',
            error
          );
          return '';
        });
    }
    return svgMarkupPromise;
  }

  function outlineFor(overlay, name) {
    return [...overlay.querySelectorAll('[data-hotspot-key]')]
      .find(path => path.dataset.hotspotKey === name);
  }

  function setActiveOutline(room, activeName = '') {
    const overlay = room?.querySelector('.cottage-outline-overlay');
    if (!overlay) return;

    overlay.querySelectorAll('[data-hotspot-key]').forEach(path => {
      path.classList.toggle('is-active', path.dataset.hotspotKey === activeName);
    });
  }

  function hoveredHotspot(room, target) {
    const object = target?.closest?.('.physical-stage > .physical-object');
    return object && room.contains(object) ? object : null;
  }

  function bindPointerState(room) {
    if (room.dataset.cottageOutlineEvents === 'true') return;
    room.dataset.cottageOutlineEvents = 'true';

    /*
     * Read the same transparent buttons used by the existing click handlers.
     * Direct pointer tracking is more reliable here than querying :hover after
     * a delayed animation frame on overlapping, transparent hit regions.
     */
    room.addEventListener('pointerover', event => {
      const object = hoveredHotspot(room, event.target);
      if (object) setActiveOutline(room, objectName(object));
    }, { passive: true });

    room.addEventListener('pointermove', event => {
      const object = hoveredHotspot(room, event.target);
      setActiveOutline(room, object ? objectName(object) : clickedHotspotName);
    }, { passive: true });

    room.addEventListener('pointerout', event => {
      const leaving = hoveredHotspot(room, event.target);
      const entering = hoveredHotspot(room, event.relatedTarget);
      if (leaving && !entering) setActiveOutline(room, clickedHotspotName);
    }, { passive: true });

    room.addEventListener('pointerleave', () => {
      setActiveOutline(room, clickedHotspotName);
    }, { passive: true });

    room.addEventListener('click', event => {
      const object = hoveredHotspot(room, event.target);
      clickedHotspotName = object ? objectName(object) : '';
      setActiveOutline(room, clickedHotspotName);
    });

    room.addEventListener('focusin', event => {
      const object = hoveredHotspot(room, event.target);
      if (object) setActiveOutline(room, objectName(object));
    });

    room.addEventListener('focusout', event => {
      const entering = hoveredHotspot(room, event.relatedTarget);
      setActiveOutline(room, entering ? objectName(entering) : clickedHotspotName);
    });
  }

  async function applyCottageOutlines() {
    const room = document.querySelector('#room.physical-room');
    if (!room || roomKey() !== ROOM_KEY || !room.classList.contains('cottage-living-room')) {
      return;
    }

    const shell = room.querySelector('.physical-shell');
    const objects = [...room.querySelectorAll('.physical-stage > .physical-object')];
    if (!shell || !objects.length) return;

    /*
     * Validate against the existing object list. The SVG never creates,
     * renames or repositions a hotspot.
     */
    objects.forEach(object => {
      const name = objectName(object);
      if (OUTLINED_OBJECTS.has(name)) object.dataset.cottageOutline = name;
    });

    let overlay = shell.querySelector('.cottage-outline-overlay');
    if (!overlay) {
      const markup = await loadOutlineMarkup();
      if (!markup || roomKey() !== ROOM_KEY || !room.isConnected) return;

      const template = document.createElement('template');
      template.innerHTML = markup.trim();
      overlay = template.content.firstElementChild;
      if (!overlay || overlay.localName !== 'svg') return;

      overlay.classList.add('cottage-outline-overlay');
      overlay.setAttribute('focusable', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      shell.appendChild(overlay);
    }

    room.classList.add('cottage-outline-room');
    bindPointerState(room);

    const missingObjects = [...OUTLINED_OBJECTS]
      .filter(name => !objects.some(object => objectName(object) === name));
    const missingPaths = [...OUTLINED_OBJECTS]
      .filter(name => !outlineFor(overlay, name));

    if (missingObjects.length || missingPaths.length) {
      console.warn('[Cottage outlines] Object/path mismatch.', {
        missingObjects,
        missingPaths
      });
    }

    setActiveOutline(room, clickedHotspotName);
  }

  /*
   * Load after the existing render wrappers. This wrapper adds presentation
   * only and delegates all room creation to the established implementation.
   */
  if (typeof window.renderRoom === 'function') {
    const previousRenderRoom = window.renderRoom;
    window.renderRoom = function cottageOutlineRenderRoom(...args) {
      const result = previousRenderRoom.apply(this, args);
      queueMicrotask(applyCottageOutlines);
      return result;
    };
  }

  document.addEventListener('pointerover', event => {
    if (event.target.closest?.('#room.cottage-living-room')) {
      const room = document.querySelector('#room.cottage-living-room');
      if (room && !room.classList.contains('cottage-outline-room')) {
        applyCottageOutlines();
      }
    }
  }, { passive: true });

  applyCottageOutlines();
})();
