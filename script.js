// Botões de serviço e WhatsApp
const whatsappBtn = document.getElementById("whatsappBtn");
let selectedService = "";

function showInfo(service) {
  const infoBox = document.getElementById("info");
  selectedService = service;

  let content = "";
  switch (service) {
    case "sublimacao":
      content = "Canecas, camisetas, almofadas e muito mais com estampas personalizadas!";
      break;
    case "personalizados":
      content = "Brindes, lembrancinhas e itens únicos para eventos e datas especiais.";
      break;
    case "convites":
      content = "Convites digitais interativos para aniversários, casamentos e eventos.";
      break;
    case "manutencao":
      content = "Serviços de manutenção, formatação e upgrades para computadores e notebooks.";
      break;
    default:
      content = "";
  }

  infoBox.textContent = content;
  updateWhatsAppLink();
}

function updateWhatsAppLink() {
  const phone = "5532991992905";
  let message = "Olá! Vim pelo mini site e tenho interesse em ";

  switch (selectedService) {
    case "sublimacao":
      message += "serviços de sublimação.";
      break;
    case "personalizados":
      message += "produtos personalizados.";
      break;
    case "convites":
      message += "convites digitais.";
      break;
    case "manutencao":
      message += "manutenção de computador ou notebook.";
      break;
    default:
      message += "seus serviços.";
  }

  const encodedMessage = encodeURIComponent(message);
  whatsappBtn.setAttribute("href", `https://wa.me/${phone}?text=${encodedMessage}`);
}

// Lightbox
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