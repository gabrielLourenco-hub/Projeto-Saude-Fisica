document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const overlay = document.getElementById('menu-overlay');
  const BODY_LOCK = 'is-locked';

  if (!hamburger || !navMenu || !overlay) return;

  function openMenu() {
    hamburger.classList.add('active');
    navMenu.classList.add('active');
    overlay.classList.add('active');
    overlay.hidden = false;
    document.body.classList.add(BODY_LOCK);
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu de navegação');
  }

  function closeMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    overlay.classList.remove('active');
    // espera a transição para esconder de vez
    setTimeout(() => {
      overlay.hidden = true;
    }, 300);
    document.body.classList.remove(BODY_LOCK);
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu de navegação');
  }

  function toggleMenu() {
    if (navMenu.classList.contains('active')) closeMenu();
    else openMenu();
  }

  // Abre/fecha no clique
  hamburger.addEventListener('click', toggleMenu);

  // Acessibilidade: Enter ou Espaço no hambúrguer
  hamburger.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Fecha ao clicar em um link
  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Fecha ao clicar no overlay
  overlay.addEventListener('click', closeMenu);

  // Fecha ao clicar fora do nav/hambúrguer
  document.addEventListener('click', function (e) {
    if (
      !hamburger.contains(e.target) &&
      !navMenu.contains(e.target) &&
      navMenu.classList.contains('active')
    ) {
      closeMenu();
    }
  });

  // Fecha com ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  // Fecha ao ir para desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 768) closeMenu();
  });
});
