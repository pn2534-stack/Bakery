(() => {
  const cookieModel = (className, label) => `<model-viewer class="${className}" src="cookies.glb" alt="${label}" loading="lazy" auto-rotate rotation-per-second="18deg" camera-orbit="25deg 65deg auto" shadow-intensity="1" interaction-prompt="none"></model-viewer>`;

  function installFinishedCookiePreview() {
    const dish = document.querySelector('.finished-dish[aria-label="Cookies"]');
    if (!dish || dish.querySelector('model-viewer')) return;
    dish.classList.add('finished-cookie-dish');
    dish.innerHTML = cookieModel('finished-cookie-model', 'Finished cookies');
  }

  const modalContent = document.getElementById('modal-content');
  if (modalContent) new MutationObserver(installFinishedCookiePreview).observe(modalContent, { childList: true, subtree: true });
  installFinishedCookiePreview();

  const cookieRoomRender = renderRoom;
  renderRoom = function () {
    cookieRoomRender();
    if (current !== 'bakery' || currentTab !== 'Kitchen' || (state.stock.Cookies || 0) < 1) return;
    document.querySelector('.physical-shell')?.insertAdjacentHTML('beforeend', cookieModel('finished-cookie-product', 'Finished cookies on the serving table'));
  };
})();
