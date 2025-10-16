// Variáveis globais
const whatsappBtn = document.getElementById("whatsappBtn");
let selectedService = "";

// Função para mostrar informações e atualizar o botão do WhatsApp
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
  }

  infoBox.textContent = content;
  updateWhatsAppLink();
}

// Função para atualizar o link do botão do WhatsApp
function updateWhatsAppLink() {
  const phone = "5532991992905"; // seu número com DDD e país
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

// Formulário de contato
document.getElementById("contactForm").addEventListener("submit", function(e) {
  e.preventDefault();
  document.getElementById("formMessage").textContent = "Mensagem enviada! Entraremos em contato.";
});

function openLightbox(index) {
  const overlay = document.createElement('div');
  overlay.classList.add('lightbox-overlay');
  overlay.setAttribute('id', 'lightbox');
  overlay.setAttribute('tabindex', '0');

  // Container interno para imagem e botões
  const content = document.createElement('div');
  content.style.display = 'flex';
  content.style.flexDirection = 'column';
  content.style.alignItems = 'center';

  // Imagem ampliada
  const img = document.createElement('img');
  img.src = images[index].getAttribute('href');
  img.classList.add('lightbox-image');
  content.appendChild(img);

  // Botões de navegação
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
  content.appendChild(controls);

  overlay.appendChild(content);
  document.body.appendChild(overlay);
  overlay.focus();

  overlay.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') navigateLightbox(1);
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'Escape') closeLightbox();
  });
}