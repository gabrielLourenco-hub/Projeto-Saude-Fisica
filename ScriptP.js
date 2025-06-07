let videoIndex = 0;
const slides = document.querySelectorAll('.video-slide');
function mostrarVideo(n) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === n);
    if (i !== n) {
      // Pausa o vídeo do YouTube ao trocar de slide
      const iframe = slide.querySelector('iframe');
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  });
}
function mudarVideo(n) {
  videoIndex += n;
  if (videoIndex >= slides.length) videoIndex = 0;
  if (videoIndex < 0) videoIndex = slides.length - 1;
  mostrarVideo(videoIndex);
}
mostrarVideo(videoIndex);