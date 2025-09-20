// Menu Hambúrguer e Carrossel de Vídeos
document.addEventListener('DOMContentLoaded', function () {
  // ===========================
  // MENU HAMBÚRGUER
  // ===========================
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      z-index: 98;
    `;
    document.body.appendChild(overlay);

    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');

      // Previne scroll quando menu está aberto
      if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
      } else {
        document.body.style.overflow = '';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
      }
    });

    // Fecha menu ao clicar em um link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
      });
    });

    // Fecha menu ao clicar no overlay
    overlay.addEventListener('click', function () {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    });

    // Fecha menu ao clicar fora dele
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
      }
    });

    // Fecha menu ao redimensionar para desktop
    window.addEventListener('resize', function () {
      if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
      }
    });
  }

  // ===========================
  // CARROSSEL DE VÍDEOS
  // ===========================
  const videoContainer = document.getElementById('videoContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');
  const slides = document.querySelectorAll('.video-slide');

  let currentSlide = 0;
  const maxSlides = slides.length;

  // Função para mostrar slide específico
  function showSlide(slideIndex) {
    // Garantir que o índice está dentro dos limites
    if (slideIndex < 0) slideIndex = 0;
    if (slideIndex >= maxSlides) slideIndex = maxSlides - 1;

    currentSlide = slideIndex;

    // Remove classe active de todos os slides e indicadores
    slides.forEach((slide) => slide.classList.remove('active'));
    indicators.forEach((indicator) => indicator.classList.remove('active'));

    // Adiciona classe active ao slide e indicador atual
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');

    // Para mobile (768px ou menos), mostrar apenas um slide centralizado
    if (window.innerWidth <= 768) {
      const slideWidth = slides[0].offsetWidth + 20; // largura + margin
      const translateX = -slideIndex * slideWidth;

      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${translateX}px)`;
      });
    } else {
      // Para desktop/tablet, usar lógica de centralização
      const slideWidth = slides[0].offsetWidth + 20; // largura + margin
      const containerWidth = videoContainer.offsetWidth;
      const translateX =
        -slideIndex * slideWidth + containerWidth / 2 - slideWidth / 2;

      slides.forEach((slide, index) => {
        slide.style.transform = `translateX(${translateX}px)`;
      });
    }

    // Atualiza estado dos botões
    prevBtn.disabled = slideIndex === 0;
    nextBtn.disabled = slideIndex === maxSlides - 1;

    // Pausa todos os vídeos exceto o ativo
    slides.forEach((slide, index) => {
      const iframe = slide.querySelector('iframe');
      if (index !== slideIndex && iframe) {
        iframe.contentWindow.postMessage(
          '{"event":"command","func":"pauseVideo","args":""}',
          '*',
        );
      }
    });
  }

  // Função para ir para o próximo slide
  function nextSlide() {
    if (currentSlide < maxSlides - 1) {
      currentSlide++;
      showSlide(currentSlide);
    }
  }

  // Função para ir para o slide anterior
  function prevSlide() {
    if (currentSlide > 0) {
      currentSlide--;
      showSlide(currentSlide);
    }
  }

  // Event listeners para os botões
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Event listeners para os indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentSlide = index;
      showSlide(currentSlide);
    });
  });

  // Navegação por teclado
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Inicializa o carrossel
  if (slides.length > 0) {
    showSlide(currentSlide);
  }

  // Redimensionamento da janela
  window.addEventListener('resize', () => {
    if (slides.length > 0) {
      showSlide(currentSlide);
    }
  });

  // Touch/swipe support para mobile
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  if (videoContainer) {
    videoContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    videoContainer.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;

      const deltaX = startX - endX;
      const deltaY = startY - endY;

      // Verifica se o movimento foi mais horizontal que vertical
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 50) {
          // Swipe para esquerda - próximo slide
          nextSlide();
        } else if (deltaX < -50) {
          // Swipe para direita - slide anterior
          prevSlide();
        }
      }
    });
  }
});
