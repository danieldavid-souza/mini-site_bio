const images = Array.from(document.querySelectorAll('.lightbox'));
let currentIndex = 0;

images.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    currentIndex = parseInt(this.dataset.index);
    openLightbox(currentIndex);
  });
});

function openLightbox(index) {
  const overlay = document.createElement('div');
  overlay.classList.add('lightbox-overlay');
  overlay.setAttribute('id', 'lightbox');

  const wrapper = document.createElement('div');
  wrapper.classList.add('lightbox-wrapper');

  const img = document.createElement('img');
  img.src = images[index].getAttribute('href');
  img.classList.add('lightbox-image');
  wrapper.appendChild(img);

  const controls = document.createElement('div');
  controls.classList.add('lightbox-controls');

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '◀ Anterior';
  prevBtn.onclick = () => navigateLightbox(-1);

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖ Fechar';
  closeBtn.onclick = closeLightbox;

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Próxima ▶';
  nextBtn.onclick = () => navigateLightbox(1);

  controls.appendChild(prevBtn);
  controls.appendChild(closeBtn);
  controls.appendChild(nextBtn);
  wrapper.appendChild(controls);

  overlay.appendChild(wrapper);
  document.body.appendChild(overlay);

  // Fechar ao clicar fora da imagem
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeLightbox();
  });
}

function closeLightbox() {
  const overlay = document.getElementById('lightbox');
  if (overlay) overlay.remove();
}

function navigateLightbox(direction) {
  currentIndex += direction;
  if (currentIndex < 0) currentIndex = images.length - 1;
  if (currentIndex >= images.length) currentIndex = 0;

  const overlay = document.getElementById('lightbox');
  const img = overlay.querySelector('img');
  img.src = images[currentIndex].getAttribute('href');
}

// Navegação por teclado
document.addEventListener('keydown', e => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
});

// Navegação por rolagem do mouse
document.addEventListener('wheel', e => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  if (e.deltaY > 0) {
    navigateLightbox(1);
  } else {
    navigateLightbox(-1);
  }
});