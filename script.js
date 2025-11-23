document.addEventListener('DOMContentLoaded', () => {
  // Seleciona todos os botões "Solicitar" dentro dos cartões de produto
  const productWhatsappButtons = document.querySelectorAll('.product-card .card-wp');

  /**
   * Abre o link do WhatsApp com uma mensagem personalizada.
   * @param {string} phone - O número de telefone do destinatário.
   * @param {string} message - A mensagem a ser enviada.
   */
  const openWhatsApp = (phone, message) => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  // Adiciona um evento de clique a cada botão "Solicitar"
  productWhatsappButtons.forEach(button => {
    button.addEventListener('click', () => {
      const phone = button.dataset.phone;
      const message = button.dataset.msg;
      openWhatsApp(phone, message);
    });
  });

  // --- Funcionalidade dos Botões de WhatsApp do Rodapé ---
  const footerWaMarli = document.getElementById('footerWaMarli');
  const footerWaDaniel = document.getElementById('footerWaDaniel');

  if (footerWaMarli) {
    footerWaMarli.addEventListener('click', (event) => {
      event.preventDefault(); // Previne o comportamento padrão do link '#'
      const phone = footerWaMarli.dataset.phone;
      const message = "Olá, Marli! Vi o contato no mini site e gostaria de mais informações sobre os produtos personalizados da Lima Calixto.";
      openWhatsApp(phone, message);
    });
  }

  if (footerWaDaniel) {
    footerWaDaniel.addEventListener('click', (event) => {
      event.preventDefault(); // Previne o comportamento padrão do link '#'
      const phone = footerWaDaniel.dataset.phone;
      const message = "Olá, Daniel! Vi o contato no mini site e gostaria de mais informações sobre os serviços de manutenção da Lima Lima.";
      openWhatsApp(phone, message);
    });
  }

  // --- Funcionalidade de Compartilhamento ---
  const shareToggle = document.getElementById('shareToggle');
  const shareOptions = document.getElementById('shareOptions');
  const shareThanks = document.getElementById('shareThanks');
  const shareWhatsApp = document.getElementById('shareWhatsApp');
  const shareTelegram = document.getElementById('shareTelegram');

  if (shareToggle) {
    shareToggle.addEventListener('click', () => {
      // Alterna a visibilidade das opções de compartilhamento
      const isHidden = shareOptions.style.display === 'none' || shareOptions.style.display === '';
      shareOptions.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // Define o conteúdo a ser compartilhado
  const shareUrl = window.location.href;
  const shareTitle = "Confira o mini site da Lima Calixto & Lima Lima! Encontre produtos personalizados e serviços de manutenção de computadores.";

  // Configura os links de compartilhamento
  if (shareWhatsApp) {
    shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;
  }
  if (shareTelegram) {
    shareTelegram.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  }

  // Exibe a mensagem de agradecimento após o clique
  [shareWhatsApp, shareTelegram].forEach(button => button?.addEventListener('click', () => {
    shareOptions.style.display = 'none';
    shareThanks.style.display = 'block';
    setTimeout(() => {
      shareThanks.style.display = 'none';
    }, 3000); // A mensagem de agradecimento some após 3 segundos
  }));

  // --- Funcionalidade do Botão Voltar ao Topo ---
  const backToTopButton = document.getElementById('backToTop');

  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      // Mostra o botão se o usuário rolar mais de 300px para baixo
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    backToTopButton.addEventListener('click', () => {
      // Rola suavemente para o topo da página
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Funcionalidade de Alterar Tema ---
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Função para aplicar o tema e atualizar o ícone
  const applyTheme = (theme) => {
    if (theme === 'light') {
      body.classList.add('light-theme');
      themeIcon?.classList.replace('fa-moon', 'fa-sun');
    } else {
      body.classList.remove('light-theme');
      themeIcon?.classList.replace('fa-sun', 'fa-moon');
    }
    localStorage.setItem('theme', theme);
  };

  // Verifica o tema salvo no carregamento da página
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
      applyTheme(newTheme);
    });
  }

  // --- Funcionalidade do Lightbox ---
  const lightboxLinks = document.querySelectorAll('a.lightbox');
  const images = Array.from(lightboxLinks).map(link => ({
    src: link.href,
    alt: link.querySelector('img').alt
  }));
  let currentIndex = 0;
  let lightboxElement = null;

  const createLightbox = () => {
    const lightboxHTML = `
      <div class="lightbox-overlay">
        <div class="lightbox-wrapper">
          <button class="lightbox-close" title="Fechar (Esc)">&times;</button>
          <img src="" alt="" class="lightbox-image">
          <div class="lightbox-controls">
            <button class="lightbox-prev" title="Anterior (←)">&lsaquo;</button>
            <button class="lightbox-next" title="Próxima (→)">&rsaquo;</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    lightboxElement = document.querySelector('.lightbox-overlay');

    // Adiciona eventos aos controles
    lightboxElement.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightboxElement.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    lightboxElement.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    lightboxElement.addEventListener('click', (e) => {
      if (e.target === lightboxElement) {
        closeLightbox();
      }
    });
  };

  const openLightbox = (index) => {
    if (!lightboxElement) {
      createLightbox();
    }
    currentIndex = index;
    updateImage();
    lightboxElement.style.display = 'flex';
    document.addEventListener('keydown', handleKeyboard);
  };

  const closeLightbox = () => {
    if (lightboxElement) {
      lightboxElement.style.display = 'none';
      document.removeEventListener('keydown', handleKeyboard);
    }
  };

  const updateImage = () => {
    const img = lightboxElement.querySelector('.lightbox-image');
    img.src = images[currentIndex].src;
    img.alt = images[currentIndex].alt;
  };

  const showNextImage = () => {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
  };

  const showPrevImage = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
  };

  const handleKeyboard = (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  };

  lightboxLinks.forEach((link, index) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });
});