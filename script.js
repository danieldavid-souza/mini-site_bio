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
});