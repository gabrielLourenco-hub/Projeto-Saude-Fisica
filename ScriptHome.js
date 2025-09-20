// Carrossel de Vídeos
document.addEventListener('DOMContentLoaded', function () {
  const videoContainer = document.getElementById('videoContainer');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicators = document.querySelectorAll('.indicator');
  const slides = document.querySelectorAll('.video-slide');

  let currentSlide = 0;
  const maxSlides = slides.length;

  // Função para mostrar slide específico
  function showSlide(slideIndex) {
    // Remove classe active de todos os slides e indicadores
    slides.forEach((slide) => slide.classList.remove('active'));
    indicators.forEach((indicator) => indicator.classList.remove('active'));

    // Adiciona classe active ao slide e indicador atual
    slides[slideIndex].classList.add('active');
    indicators[slideIndex].classList.add('active');

    // Calcula a posição do carrossel
    const slideWidth = slides[0].offsetWidth + 20; // largura + margin
    const containerWidth = videoContainer.offsetWidth;

    // Centraliza o slide ativo
    const translateX =
      -slideIndex * slideWidth + containerWidth / 2 - slideWidth / 2;

    // Aplica a transformação
    slides.forEach((slide, index) => {
      slide.style.transform = `translateX(${translateX}px)`;
    });

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
