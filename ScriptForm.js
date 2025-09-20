document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('menu-overlay');

  if (!hamburger || !navMenu || !overlay) return;

  const BODY_LOCK_CLASS = 'is-locked';

  function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    overlay.hidden = false;
    document.body.classList.add(BODY_LOCK_CLASS);
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    // esconde após a transição (300ms) para não “pular”
    setTimeout(() => { overlay.hidden = true; }, 300);
    document.body.classList.remove(BODY_LOCK_CLASS);
  }

  function toggleMenu() {
    if (navMenu.classList.contains('active')) closeMenu();
    else openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);

  // Fecha ao clicar em um link
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao clicar no overlay
  overlay.addEventListener('click', closeMenu);

  // Fecha ao clicar fora (desktop/mobile)
  document.addEventListener('click', function (e) {
    const clickedOutside = !hamburger.contains(e.target) && !navMenu.contains(e.target);
    if (clickedOutside && navMenu.classList.contains('active')) closeMenu();
  });

  // Fecha com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Fecha ao redimensionar para desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) closeMenu();
  });
});
