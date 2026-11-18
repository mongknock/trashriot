(() => {
  const button = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navigation');
  if (!button || !nav) return;

  function closeMenu() {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', '메뉴 열기');
    nav.classList.remove('is-open');
  }

  button.addEventListener('click', () => {
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    button.setAttribute('aria-label', opening ? '메뉴 닫기' : '메뉴 열기');
    nav.classList.toggle('is-open', opening);
  });

  nav.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !button.contains(event.target)) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 900) closeMenu();
  });
})();

(() => {
  const dialog = document.querySelector('.lightbox');
  const cards = Array.from(document.querySelectorAll('.gallery .screenshot-open'));
  if (!dialog || !cards.length || typeof dialog.showModal !== 'function') return;
  const picture = dialog.querySelector('.lightbox-image');
  const title = dialog.querySelector('.lightbox-title');
  const count = dialog.querySelector('.lightbox-count');
  let index = 0;
  let lastTrigger = null;

  function show(indexToShow) {
    index = (indexToShow + cards.length) % cards.length;
    const card = cards[index];
    const img = card.querySelector('img');
    picture.src = img.src.replace('-960.webp', '-1920.webp');
    picture.alt = img.alt;
    title.textContent = card.closest('figure').querySelector('.gallery-card-name').textContent;
    count.textContent = `${index + 1} / ${cards.length}`;
  }
  cards.forEach((card, idx) => card.addEventListener('click', () => {
    lastTrigger = card;
    show(idx);
    dialog.showModal();
  }));
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { picture.removeAttribute('src'); lastTrigger?.focus(); });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
  });
})();

// Videos are loaded only after the visitor presses the play button.
(() => {
  const frames = document.querySelectorAll('.video-frame[data-video-src]');
  frames.forEach(frame => {
    const launch = frame.querySelector('.video-launch');
    if (!launch) return;
    launch.addEventListener('click', () => {
      document.querySelectorAll('.video-frame video').forEach(player => player.pause());
      const video = document.createElement('video');
      video.controls = true;
      video.playsInline = true;
      video.preload = 'none';
      video.setAttribute('aria-label', frame.dataset.videoTitle || 'Trash Riot 영상');
      video.poster = frame.dataset.videoPoster;
      video.src = frame.dataset.videoSrc;
      video.addEventListener('error', () => {
        if (frame.querySelector('.video-error')) return;
        const error = document.createElement('div');
        error.className = 'video-error';
        error.textContent = '재생에 문제가 발생했습니다. 네트워크 연결을 확인해 주세요.';
        frame.appendChild(error);
      });
      frame.replaceChildren(video);
      const result = video.play();
      if (result && typeof result.catch === 'function') result.catch(() => { /* Browser controls can be used manually. */ });
    });
  });
})();
