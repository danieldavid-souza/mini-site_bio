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
});