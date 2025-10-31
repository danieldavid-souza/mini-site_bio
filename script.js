// WhatsApp dinâmico
const whatsappBtnCalixto = document.getElementById("whatsappBtnCalixto");
const whatsappBtnLima = document.getElementById("whatsappBtnLima");
const warning = document.getElementById("whatsappWarning");
let selectedService = "";

// Exibe descrição e atualiza links
function showInfo(service) {
  selectedService = service;
  const infoBox = document.getElementById("info");

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
  }

  infoBox.textContent = content;
  updateWhatsAppLinks();
}

// Gera links personalizados
function updateWhatsAppLinks() {
  const phoneCalixto = "5532991657472";
  const phoneLima = "5532991992905";

  let messageCalixto = "";
  let messageLima = "";

  switch (selectedService) {
    case "sublimacao":
    case "personalizados":
    case "convites":
      messageCalixto = "Olá Marli! Vim pelo mini site e tenho interesse em serviços de sublimação e/ou personalizados! Você pode dar mais detalhes?";
      messageLima = "Olá Daniel! Vim pelo mini site e tenho interesse em serviços de sublimação e/ou personalizados! Você pode dar mais detalhes?";
      break;
    case "manutencao":
      messageCalixto = "Olá Marli! Vim pelo mini site e gostaria de saber se vocês também oferecem manutenção.";
      messageLima = "Olá Daniel! Vim pelo mini site e tenho interesse em serviços de manutenção. Você pode dar mais detalhes?";
      break;
  }

  if (messageCalixto && whatsappBtnCalixto) {
    whatsappBtnCalixto.href = `https://wa.me/${phoneCalixto}?text=${encodeURIComponent(messageCalixto)}`;
  }

  if (messageLima && whatsappBtnLima) {
    whatsappBtnLima.href = `https://wa.me/${phoneLima}?text=${encodeURIComponent(messageLima)}`;
  }
}

// Bloqueia clique se nenhum serviço for escolhido
document.querySelectorAll('.whatsapp-link').forEach(btn => {
  btn.addEventListener('click', function (e) {
    if (!selectedService) {
      e.preventDefault();
      if (warning) {
        warning.style.display = "flex";
        warning.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Por favor, selecione um serviço antes de entrar em contato pelo WhatsApp. Clique em um botão com a descrição do serviço que você precisa de atendimento.`;
        setTimeout(() => {
          warning.style.display = "none";
        }, 10000);
      }
    }
  });
});

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
  closeLightbox();

  const overlay = document.createElement('div');
  overlay.classList.add('lightbox-overlay');
  overlay.id = 'lightbox';

  const wrapper = document.createElement('div');
  wrapper.classList.add('lightbox-wrapper');

  const img = document.createElement('img');
  img.src = images[index].getAttribute('href');
  img.alt = images[index].querySelector('img')?.alt || 'Imagem ampliada';
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
  currentIndex = (currentIndex + direction + images.length) % images.length;

  const overlay = document.getElementById('lightbox');
  const img = overlay.querySelector('img');

  img.classList.add('fade-out');
  setTimeout(() => {
    img.src = images[currentIndex].getAttribute('href');
    img.alt = images[currentIndex].querySelector('img')?.alt || 'Imagem ampliada';
    img.classList.remove('fade-out');
  }, 300);
}

// Navegação por teclado
document.addEventListener('keydown', e => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
});

// Navegação por rolagem
document.addEventListener('wheel', e => {
  const overlay = document.getElementById('lightbox');
  if (!overlay) return;

  e.deltaY > 0 ? navigateLightbox(1) : navigateLightbox(-1);
});

// Botão "Voltar ao topo"
document.addEventListener("DOMContentLoaded", () => {
  const backToTopBtn = document.getElementById("backToTop");

  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    backToTopBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

const shareBtn = document.getElementById("shareBtn");
const shareThanks = document.getElementById("shareThanks");

if (shareBtn && navigator.share) {
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Lima Calixto Personalizados",
      text: "Confira nosso mini site com serviços de sublimação, personalizados e manutenção!",
      url: "https://links-limacalixtopersonalizados.netlify.app/"
    }).then(() => {
      if (shareThanks) {
        shareThanks.style.display = "block";
        setTimeout(() => {
          shareThanks.style.display = "none";
        }, 5000);
      }
    }).catch((error) => {
      console.error("Erro ao compartilhar:", error);
    });
  });
} else if (shareBtn) {
  shareBtn.addEventListener("click", () => {
    alert("Seu navegador não suporta compartilhamento direto. Copie o link: https://links-limacalixtopersonalizados.netlify.app/");
  });
}