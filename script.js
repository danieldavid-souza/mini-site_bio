/* -------------------------
   Utilities (top-level)
------------------------- */
function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/[&<>"']/g, function (s) {
    return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]);
  });
}
function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g,'&quot;');
}

/* ---------- Lightbox (top-level functions) ---------- */
var lightLinks = [];
var currentIndex = 0;

function initLightboxHandlers() {
  lightLinks = Array.prototype.slice.call(document.querySelectorAll('.lightbox'));
  // clone nodes to avoid double-binding issues
  lightLinks.forEach(function(a){
    var clone = a.cloneNode(true);
    a.parentNode.replaceChild(clone, a);
  });
  lightLinks = Array.prototype.slice.call(document.querySelectorAll('.lightbox'));
  lightLinks.forEach(function(a,i){
    a.setAttribute('data-index', i);
    a.addEventListener('click', function(e){
      e.preventDefault();
      currentIndex = parseInt(this.getAttribute('data-index'), 10) || 0;
      openLightbox(currentIndex);
    });
  });
}

function openLightbox(idx) {
  closeLightbox();
  if (!lightLinks || lightLinks.length === 0) return;
  idx = Math.max(0, Math.min(idx, lightLinks.length - 1));
  var href = lightLinks[idx] && lightLinks[idx].href ? lightLinks[idx].href : '';
  var altText = '';
  try {
    var imgEl = lightLinks[idx] && lightLinks[idx].querySelector && lightLinks[idx].querySelector('img');
    altText = imgEl && imgEl.alt ? imgEl.alt : 'Imagem';
  } catch (e) { altText = 'Imagem'; }

  var overlay = document.createElement('div'); overlay.className = 'lightbox-overlay'; overlay.id = 'lightboxOverlay';
  var wrapper = document.createElement('div'); wrapper.className = 'lightbox-wrapper';
  var img = document.createElement('img'); img.className = 'lightbox-image'; img.src = href; img.alt = altText;
  var ctrls = document.createElement('div'); ctrls.className = 'lightbox-controls';
  var prev = document.createElement('button'); prev.textContent = '◀ Anterior'; prev.type = 'button';
  prev.addEventListener('click', function(){ navigateLightbox(-1); });
  var closeBtn = document.createElement('button'); closeBtn.textContent = '✖ Fechar'; closeBtn.type = 'button';
  closeBtn.addEventListener('click', closeLightbox);
  var next = document.createElement('button'); next.textContent = 'Próxima ▶'; next.type = 'button';
  next.addEventListener('click', function(){ navigateLightbox(1); });
  ctrls.appendChild(prev); ctrls.appendChild(closeBtn); ctrls.appendChild(next);
  wrapper.appendChild(img); wrapper.appendChild(ctrls); overlay.appendChild(wrapper);
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', handleKey, false);
  currentIndex = idx;
}

function closeLightbox() {
  var o = document.getElementById('lightboxOverlay');
  if (o) o.parentNode.removeChild(o);
  document.removeEventListener('keydown', handleKey, false);
}

function navigateLightbox(direction) {
  if (!lightLinks || lightLinks.length === 0) return;
  currentIndex = (currentIndex + direction + lightLinks.length) % lightLinks.length;
  var overlay = document.getElementById('lightboxOverlay');
  if (!overlay) return;
  var img = overlay.querySelector && overlay.querySelector('img.lightbox-image');
  if (!img) return;
  // small fade effect
  img.style.opacity = '0.2';
  setTimeout(function(){
    img.src = (lightLinks[currentIndex] && lightLinks[currentIndex].href) ? lightLinks[currentIndex].href : '';
    var maybeImg = lightLinks[currentIndex] && lightLinks[currentIndex].querySelector && lightLinks[currentIndex].querySelector('img');
    img.alt = maybeImg && maybeImg.alt ? maybeImg.alt : 'Imagem';
    img.style.opacity = '';
  }, 180);
}

function handleKey(e) {
  var overlayExists = !!document.getElementById('lightboxOverlay');
  if (!overlayExists) return;
  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'Escape') closeLightbox();
}

/* ---------- Modals (top-level open/close) ---------- */
function openOrderModal(opts) {
  opts = opts || {};
  var phone = opts.phone || '';
  var prod = opts.prod || '';
  var baseMsg = opts.baseMsg || '';

  var host = document.getElementById('orderModal');
  if (!host) return;
  host.innerHTML = ''
    + '<div class="modal-overlay" id="modalOverlayOrder">'
    + '  <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="orderModalTitle">'
    + '    <button class="modal-close" aria-label="Fechar modal">&times;</button>'
    + '    <h3 id="orderModalTitle" style="margin-bottom: 1rem; color: var(--primary-color);">Solicitar: ' + escapeHtml(prod || 'Produto/Serviço') + '</h3>'
    + '    <div class="field"><label>Mensagem inicial</label><input type="text" id="modalBaseMsg" value="' + escapeAttr(baseMsg || '') + '" /></div>'
    + '    <div class="form-row">'
    + '      <div class="col field"><label>Quantidade</label><input id="modalQty" placeholder="Ex: 10" /></div>'
    + '      <div class="col field"><label>Cor / Design</label><input id="modalColor" placeholder="Ex: Vermelho / Foto da família" /></div>'
    + '    </div>'
    + '    <div class="field" style="margin-top:8px"><label>Prazo desejado</label><input id="modalWhen" placeholder="Ex: 7 dias / Urgente" /></div>'
    + '    <div class="field" style="margin-top:8px"><label>Observações</label><textarea id="modalObs" rows="3" placeholder="Ex: Enviar para ... (opcional)"></textarea></div>'
    + '    <div class="modal-actions">'
    + '      <button class="card-actions-btn" id="modalCancelOrder" type="button">Fechar</button>'
    + '      <button class="card-actions-btn primary-small" id="modalSendOrder" type="button"><i class="fa-brands fa-whatsapp"></i> Enviar por WhatsApp</button>'
    + '    </div>'
    + '  </div>'
    + '</div>';
  host.style.display = 'block';
  host.setAttribute('aria-hidden', 'false');

  var cancel = document.getElementById('modalCancelOrder');
  if (cancel) cancel.addEventListener('click', closeOrderModal, false);
  var overlay = document.getElementById('modalOverlayOrder');
  if (overlay) overlay.addEventListener('click', function(e){ if (e.target && e.target.id === 'modalOverlayOrder') closeOrderModal(); }, false);

  var send = document.getElementById('modalSendOrder');
  if (send) {
    send.addEventListener('click', function(){
      var qty = (document.getElementById('modalQty') && document.getElementById('modalQty').value.trim()) || '[ ]';
      var color = (document.getElementById('modalColor') && document.getElementById('modalColor').value.trim()) || '[ ]';
      var when = (document.getElementById('modalWhen') && document.getElementById('modalWhen').value.trim()) || '[ ]';
      var obs = (document.getElementById('modalObs') && document.getElementById('modalObs').value.trim()) || '';
      var base = (document.getElementById('modalBaseMsg') && document.getElementById('modalBaseMsg').value.trim()) || '';

      var message = base ? base + ' ' : '';
      if (prod) message += prod + ' — ';
      message += 'Quantidade: ' + qty + ' | Cor/Design: ' + color + ' | Prazo: ' + when;
      if (obs) message += ' | Observações: ' + obs;
      var dest = (phone && phone.length >= 8) ? phone : '5532991657472';
      var url = 'https://wa.me/' + dest + '?text=' + encodeURIComponent(message);
      window.open(url, '_blank');
      closeOrderModal();
    }, false);
  }

  setTimeout(function(){ var el = document.getElementById('modalQty'); if (el) el.focus(); }, 80);
}

function closeOrderModal() {
  var host = document.getElementById('orderModal');
  if (!host) return;
  host.innerHTML = '';
  host.style.display = 'none';
  host.setAttribute('aria-hidden', 'true');
}

function openContactModal(opts) {
  opts = opts || {};
  var contact = (opts.contact || 'marli').toLowerCase();
  var phone = opts.phone || '';
  var initial = '';
  if (contact === 'marli') {
    initial = 'Prezada Marli, bom dia/tarde/noite. Gostaria de solicitar informações sobre produtos e pedidos. Segue a descrição:';
  } else if (contact === 'daniel') {
    initial = 'Prezado Daniel, bom dia/tarde/noite. Preciso de suporte/atendimento em manutenção de equipamento. Segue a descrição:';
  } else {
    initial = 'Olá, gostaria de mais informações. Segue a descrição:';
  }

  var host = document.getElementById('contactModalHost');
  if (!host) return;
  host.innerHTML = ''
    + '<div class="modal-overlay" id="modalOverlayContact">' // Overlay
    + '  <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="contactModalTitle">'
    + '    <button class="modal-close" aria-label="Fechar modal">&times;</button>' // Botão de fechar
    + '    <h2 id="contactModalTitle"><i class="fab fa-whatsapp"></i> Fale com ' + escapeHtml(contact === 'marli' ? 'Marli' : 'Daniel') + '</h2>'
    + '    <p>Preencha a mensagem abaixo para iniciar a conversa no WhatsApp.</p>'
    + '    <textarea id="contactMsg" class="whatsapp-message" placeholder="Escreva sua mensagem aqui...">' + escapeHtml(initial) + '</textarea>'
    + '    <a id="contactSend" class="whatsapp-send-btn" href="#" target="_blank" rel="noopener noreferrer">'
    + '      <i class="fab fa-whatsapp"></i> Enviar via WhatsApp'
    + '    </a>'
    + '  </div>'
    + '</div>';
  host.style.display = 'block';
  host.setAttribute('aria-hidden', 'false');

  // Adiciona a classe 'active' para mostrar o modal com animação
  setTimeout(function() {
    var overlay = document.getElementById('modalOverlayContact');
    if (overlay) overlay.classList.add('active');
  }, 10);

  var cancel = host.querySelector('.modal-close');
  if (cancel) cancel.addEventListener('click', closeContactModal, false);
  var overlay = document.getElementById('modalOverlayContact');
  if (overlay) overlay.addEventListener('click', function(e){ if (e.target && e.target.id === 'modalOverlayContact') closeContactModal(); }, false);

  var send = document.getElementById('contactSend');
  if (send) {
    // Atualiza o link dinamicamente em vez de usar um evento de clique para navegação
    function updateWhatsAppLink() {
    var msg = (document.getElementById('contactMsg') && document.getElementById('contactMsg').value.trim()) || '';
      var dest = (phone && phone.length >= 8) ? phone : (contact === 'daniel' ? '5532991992905' : '5532991657472');
      var url = 'https://wa.me/' + dest + '?text=' + encodeURIComponent(msg);
      send.href = url;
    }

    // Atualiza o link quando o texto muda e ao abrir
    var textarea = document.getElementById('contactMsg');
    if (textarea) textarea.addEventListener('input', updateWhatsAppLink);
    updateWhatsAppLink(); // Define o link inicial

    // Fecha o modal após o clique
    send.addEventListener('click', function() {
      setTimeout(closeContactModal, 300); // Pequeno delay para garantir que a navegação ocorra
    });
  }

  setTimeout(function(){ var el = document.getElementById('contactMsg'); if (el) el.focus(); }, 80);
}

function closeContactModal() {
  var host = document.getElementById('contactModalHost');
  if (!host) return;
  var overlay = document.getElementById('modalOverlayContact');

  if (overlay) {
    overlay.classList.remove('active');
    // Aguarda a animação de saída terminar antes de limpar o HTML
    setTimeout(function() {
      host.innerHTML = '';
      host.style.display = 'none';
    }, 300); // Deve corresponder ao tempo de transição no CSS
  }
}

/* ---------- Top-level helper for showInfo / whatsapp links ---------- */
var selectedService = '';
function updateTopWhatsAppLinks(service) {
  var phoneC = '5532991657472', phoneD = '5532991992905';
  var mC = '', mD = '';
  if (service === 'manutencao') {
    mC = 'Olá Marli! Gostaria de saber se vocês também fazem manutenção. Tipo do problema: [ ] | Modelo/Marca: [ ] | Prazo: [ ]';
    mD = 'Olá Daniel! Preciso de assistência em manutenção de computador/notebook. Tipo do problema: [ ] | Modelo/Marca: [ ] | Prazo: [ ]';
  } else {
    mC = 'Olá Marli! Vim pelo mini site e tenho interesse nos serviços. Produto/serviço: [ ] | Quantidade: [ ] | Prazo: [ ]';
    mD = 'Olá Daniel! Vim pelo mini site e gostaria de saber sobre estes serviços. Produto/serviço: [ ] | Quantidade: [ ] | Prazo: [ ]';
  }
  var elC = document.getElementById('whatsappBtnCalixto');
  var elD = document.getElementById('whatsappBtnLima');
  if (elC) elC.href = 'https://wa.me/' + phoneC + '?text=' + encodeURIComponent(mC);
  if (elD) elD.href = 'https://wa.me/' + phoneD + '?text=' + encodeURIComponent(mD);
}

function showInfo(service) {
  selectedService = service || '';
  var info = document.getElementById('info');
  var text = '';
  if (service === 'sublimacao') text = 'Sublimação: canecas, camisetas e peças com impressão térmica de alta qualidade — ideal para presentes e vendas.';
  else if (service === 'personalizados') text = 'Personalizados: brindes, lembrancinhas, tags e itens sob medida para seu evento ou empresa.';
  else if (service === 'convites') text = 'Convites digitais: layouts prontos e personalizáveis para envio via WhatsApp e redes sociais.';
  else if (service === 'manutencao') text = 'Manutenção: limpeza, formatação, upgrades e diagnósticos para computadores e notebooks.';
  else text = service || '';
  if (info) info.textContent = text;
  updateTopWhatsAppLinks(service);
}

/* ---------- Theme Toggle (top-level functions) ---------- */
function applyTheme(theme) {
  document.body.classList.toggle('light-theme', theme === 'light');
  const themeToggleIcon = document.querySelector('#themeToggle i');
  if (themeToggleIcon) {
    if (theme === 'light') {
      themeToggleIcon.classList.remove('fa-sun');
      themeToggleIcon.classList.add('fa-moon');
    } else {
      themeToggleIcon.classList.remove('fa-moon');
      themeToggleIcon.classList.add('fa-sun');
    }
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', newTheme);
  applyTheme(newTheme);
}



/* ---------- DOMContentLoaded: bind events and initialize ---------- */
document.addEventListener('DOMContentLoaded', function(){
  // stagger animation
  var animEls = document.querySelectorAll('.anim');
  for (var i=0;i<animEls.length;i++){
    animEls[i].style.animationDelay = (0.06 + i*0.03) + 's';
  }

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark
  applyTheme(savedTheme);

  // Theme toggle button event listener
  const themeToggleButton = document.getElementById('themeToggle');
  if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
  }

  // service buttons behavior (add click keyboard)
  var serviceBtns = document.querySelectorAll('.service-btn');
  Array.prototype.forEach.call(serviceBtns, function(s){
    if (!s.classList.contains('anim')) s.classList.add('anim');
    if (!s.classList.contains('hover-lift')) s.classList.add('hover-lift');
    s.addEventListener('click', function(ev){
      ev.preventDefault();
      var service = s.getAttribute('data-service') || (s.textContent && s.textContent.trim().toLowerCase());
      if (!service) return;

      // Remove 'selected' from all buttons
      Array.prototype.forEach.call(serviceBtns, function(btn) {
        btn.classList.remove('selected');
      });
      // Add 'selected' to the clicked button
      s.classList.add('selected');

      if (service.indexOf('sublim') !== -1) showInfo('sublimacao');
      else if (service.indexOf('personaliz') !== -1) showInfo('personalizados');
      else if (service.indexOf('convite') !== -1) showInfo('convites');
      else if (service.indexOf('manuten') !== -1) showInfo('manutencao');
      else showInfo(service);
    }, false);
    s.addEventListener('keydown', function(k){ if(k.key === 'Enter' || k.key === ' ') { k.preventDefault(); s.click(); } }, false);
  });

  // set initial top whatsapp placeholders to '#'
  var topWaLinks = document.querySelectorAll('.whatsapp-link');
  Array.prototype.forEach.call(topWaLinks, function(el){ el.setAttribute('href','#'); });

  // init lightbox
  initLightboxHandlers();

  // card view buttons
  var viewBtns = document.querySelectorAll('.card-view');
  Array.prototype.forEach.call(viewBtns, function(btn){
    btn.addEventListener('click', function(){
      var idx = Number(btn.getAttribute('data-index'));
      if (!isNaN(idx)) openLightbox(idx);
    }, false);
  });

  // card "Solicitar" opens order modal
  var wpBtns = document.querySelectorAll('.card-wp');
  Array.prototype.forEach.call(wpBtns, function(btn){
    btn.addEventListener('click', function(e){
      e.preventDefault();
      var phone = btn.getAttribute('data-phone') || '';
      var prod = btn.getAttribute('data-prod') || '';
      var baseMsg = btn.getAttribute('data-msg') || '';
      openOrderModal({ phone: phone, prod: prod, baseMsg: baseMsg });
    }, false);
  });

  // footer whatsapp & top social whatsapp open contact modal
  var contactTriggers = document.querySelectorAll('#footerWaMarli, #footerWaDaniel, .social-grid .whatsapp-link');
  Array.prototype.forEach.call(contactTriggers, function(el){
    el.addEventListener('click', function(e){
      e.preventDefault();
      var contact = el.getAttribute('data-contact') || el.dataset && el.dataset.contact || (el.id && el.id.toLowerCase().indexOf('marli') !== -1 ? 'marli' : 'daniel');
      contact = (contact || '').toLowerCase();
      var phone = el.getAttribute('data-phone') || el.dataset && el.dataset.phone || '';
      openContactModal({ contact: contact, phone: phone });
    }, false);
  });

  // share toggle
  var shareToggle = document.getElementById('shareToggle');
  if (shareToggle) shareToggle.addEventListener('click', function(){
    var s = document.getElementById('shareOptions');
    if (!s) return;
    s.style.display = (s.style.display === 'flex') ? 'none' : 'flex';
  }, false);

  var shareText = encodeURIComponent('Olá! Confira nosso mini site — Sublimação, personalizados, convites digitais e manutenção.');
  var shareUrl = encodeURIComponent(window.location.href);
  var sw = document.getElementById('shareWhatsApp');
  var st = document.getElementById('shareTelegram');
  if (sw) sw.href = 'https://wa.me/?text=' + shareText + '%20' + shareUrl;
  if (st) st.href = 'https://t.me/share/url?url=' + shareUrl + '&text=' + shareText;

  // back-to-top (robusto)
  var back = document.getElementById('backToTop');
  if (back) {
    var showThreshold = 300;
    var toggleBackVisibility = function(){
      back.style.display = (window.pageYOffset > showThreshold) ? 'block' : 'none';
    };
    toggleBackVisibility();
    window.addEventListener('scroll', toggleBackVisibility, { passive: true });
    window.addEventListener('resize', toggleBackVisibility);
    back.addEventListener('click', function(e){
      e.preventDefault();
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(function(){ document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }, 420);
      } catch (err) {
        document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
      }
    }, false);
  }

  // protect top whatsapp links when no service selected (global)
  document.addEventListener('click', function(e){
    if (!e.target) return;
    var waEl = e.target.closest ? e.target.closest('.whatsapp-link') : null;
    if (waEl) {
      var href = waEl.getAttribute('href');
      if ((href === '#' || href === '' || href === null) && !selectedService) {
        e.preventDefault();
        var w = document.getElementById('whatsappWarning');
        if (w) { w.style.display = 'flex'; w.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Por favor, selecione um serviço antes de entrar em contato pelo WhatsApp.'; setTimeout(function(){ w.style.display = 'none'; },7000); }
      }
    }
  }, false);

  // keyboard focus helper
  document.addEventListener('keydown', function(e){
    if (e.key === 'Tab') document.body.classList.add('show-focus');
  }, false);
}); // end DOMContentLoaded
