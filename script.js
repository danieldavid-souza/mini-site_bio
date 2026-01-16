// Adiciona um ouvinte de evento que espera o conteúdo HTML da página ser totalmente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

  // --- FUNCIONALIDADE DO MODAL DE CONTATO E WHATSAPP ---

  // Seleciona os elementos do modal
  const contactModal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const whatsappMessage = document.getElementById('whatsappMessage');
  const whatsappSendBtn = document.getElementById('whatsappSendBtn');
  const modalContactName = document.getElementById('modalContactName');

  /**
   * Abre o modal de contato e o configura com as informações necessárias.
   * @param {string} phone - O número de telefone do destinatário.
   * @param {string} message - A mensagem pré-definida.
   * @param {string} contactName - O nome do contato para exibição no modal.
   */
  const openContactModal = (phone, message, contactName) => {
    if (!contactModal) return;

    // Preenche as informações no modal
    modalContactName.textContent = contactName;
    whatsappMessage.value = message;
    
    // Armazena o telefone no botão para uso no evento de clique
    whatsappSendBtn.dataset.phone = phone;

    // Exibe o modal
    contactModal.classList.add('active');
  };

  // Adiciona o ouvinte de clique ao botão de enviar (apenas uma vez)
  if (whatsappSendBtn) {
    whatsappSendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const phone = whatsappSendBtn.dataset.phone;
      if (!phone) return;

      // Feedback visual
      whatsappSendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecionando...';
      whatsappSendBtn.style.pointerEvents = 'none'; // Desabilita cliques

      const encodedMessage = encodeURIComponent(whatsappMessage.value);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        closeContactModal();
        // Restaura o botão
        whatsappSendBtn.innerHTML = '<i class="fab fa-whatsapp"></i> Enviar mensagem';
        whatsappSendBtn.style.pointerEvents = 'auto';
      }, 500);
    });
  }

  /**
   * Fecha o modal de contato.
   */
  const closeContactModal = () => {
    contactModal?.classList.remove('active');
  };

  // Ouvintes de evento para fechar o modal
  modalClose?.addEventListener('click', closeContactModal);
  contactModal?.addEventListener('click', (e) => {
    if (e.target === contactModal) { // Fecha se clicar no overlay
      closeContactModal();
    }
  });

  // Função auxiliar para configurar os links de contato do rodapé
  const setupFooterContact = (elementId, message, contactName) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('click', (event) => {
        event.preventDefault();
        const phone = element.dataset.phone;
        openContactModal(phone, message, contactName);
      });
    }
  };

  // Configura os contatos do rodapé para abrir o modal
  setupFooterContact('footerWaMarli', "Olá, Marli! Vi o contato no mini site e gostaria de mais informações sobre os produtos personalizados da Foto ART Personalizados.", "Marli (Foto ART )");
  // setupFooterContact('footerWaDaniel', "Olá, Daniel! Vi o contato no mini site e gostaria de mais informações sobre os serviços de manutenção da Lima Lima.", "Daniel (Lima Lima)");

  // --- FUNCIONALIDADE DE COMPARTILHAMENTO ---

  // Seleciona os elementos HTML necessários para a funcionalidade de compartilhamento.
  const shareToggle = document.getElementById('shareToggle');
  const shareOptions = document.getElementById('shareOptions');
  const shareThanks = document.getElementById('shareThanks');
  const shareWhatsApp = document.getElementById('shareWhatsApp');
  const shareTelegram = document.getElementById('shareTelegram');

  // Verifica se o botão principal de compartilhamento existe.
  if (shareToggle) {
    // Adiciona um ouvinte de clique a ele.
    shareToggle.addEventListener('click', () => {
      // Verifica se as opções de compartilhamento estão ocultas.
      const isHidden = shareOptions.style.display === 'none' || shareOptions.style.display === '';
      // Alterna a visibilidade das opções (mostra se estiver oculto, oculta se estiver visível).
      shareOptions.style.display = isHidden ? 'flex' : 'none';
    });
  }

  // Define o conteúdo a ser compartilhado.
  const shareUrl = window.location.href; // Pega a URL atual da página.
  const shareTitle = "Confira o mini site da Lima Calixto & Lima Lima! Encontre produtos personalizados e serviços de manutenção de computadores."; // Título padrão.

  // Configura o link de compartilhamento do WhatsApp.
  if (shareWhatsApp) {
    shareWhatsApp.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`;
  }
  // Configura o link de compartilhamento do Telegram.
  if (shareTelegram) {
    shareTelegram.href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
  }

  // Adiciona um ouvinte de clique aos botões de WhatsApp e Telegram.
  [shareWhatsApp, shareTelegram].forEach(button => {
    if (button) {
      button.addEventListener('click', () => {
        if (shareOptions) shareOptions.style.display = 'none';
        if (shareThanks) {
          shareThanks.style.display = 'block';
          setTimeout(() => {
            shareThanks.style.display = 'none';
          }, 3000);
        }
      });
    }
  });

  // --- FUNCIONALIDADE DO BOTÃO "VOLTAR AO TOPO" ---

  // Seleciona o botão "Voltar ao Topo".
  const backToTopButton = document.getElementById('backToTop');

  // Verifica se o botão existe.
  if (backToTopButton) {
    // Adiciona um ouvinte de evento de rolagem na janela.
    window.addEventListener('scroll', () => {
      // Se o usuário rolou mais de 300 pixels para baixo...
      if (window.scrollY > 300) {
        // ...mostra o botão.
        backToTopButton.style.display = 'block';
      } else {
        // ...senão, oculta o botão.
        backToTopButton.style.display = 'none';
      }
    });

    // Adiciona um ouvinte de clique ao botão.
    backToTopButton.addEventListener('click', () => {
      // Rola a página suavemente para o topo.
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- FUNCIONALIDADE DE ALTERAR TEMA (CLARO/ESCURO) ---

  // Seleciona os elementos necessários para a troca de tema.
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  /**
   * Função para aplicar um tema (claro ou escuro) e salvar a preferência.
   * @param {string} theme - O nome do tema ('light' ou 'dark').
   */
  const applyTheme = (theme) => {
    if (theme === 'light') {
      // Adiciona a classe 'light-theme' ao body para aplicar os estilos do tema claro.
      body.classList.add('light-theme');
      // Troca o ícone de lua por um de sol.
      themeIcon?.classList.replace('fa-moon', 'fa-sun');
    } else {
      // Remove a classe 'light-theme' para voltar aos estilos do tema escuro (padrão).
      body.classList.remove('light-theme');
      // Troca o ícone de sol por um de lua.
      themeIcon?.classList.replace('fa-sun', 'fa-moon');
    }
    // Salva a preferência de tema no armazenamento local do navegador.
    localStorage.setItem('theme', theme);
  };

  // Verifica se há um tema salvo no armazenamento local; se não, usa 'dark' como padrão.
  const savedTheme = localStorage.getItem('theme') || 'dark';
  // Aplica o tema salvo (ou o padrão) ao carregar a página.
  applyTheme(savedTheme);

  // Adiciona um ouvinte de clique ao botão de alternar tema.
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      // Determina qual será o novo tema com base no tema atual.
      const newTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
      // Aplica o novo tema.
      applyTheme(newTheme);
    });
  }

});