(function () {
  var d = document;
  var $ = function (s) { return d.querySelector(s); };
  var $$ = function (s) { return [].slice.call(d.querySelectorAll(s)); };

  var EMAIL = 'tiago.alvessilva67@gmail.com';
  var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ano do rodapé
  $('#y').textContent = new Date().getFullYear();

  // Textos animados: guarda o texto original (leitores de tela leem o texto certo)
  var sc = $$('[data-scramble]');
  sc.forEach(function (el) {
    var t = el.textContent.trim();
    el.dataset.t = t;
    el.innerHTML = '<span class="vis" aria-hidden="true">' + t + '</span><span class="sr-only">' + t + '</span>';
  });

  // Atalho certo para cada sistema (Ctrl ou ⌘)
  var mac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $$('.kbd').forEach(function (k) { k.textContent = mac ? '⌘ K' : 'Ctrl K'; });

  // ===== Menu mobile =====
  var m = $('#menu'), b = $('#bg');
  function tog(o) {
    m.classList.toggle('open', o);
    b.classList.toggle('x', o);
    b.setAttribute('aria-expanded', o);
  }
  b.onclick = function () { tog(!m.classList.contains('open')); };
  m.addEventListener('click', function (e) { if (e.target.closest('a')) tog(false); });

  // ===== Aviso rápido (toast) =====
  function toast(msg) {
    var el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.classList.remove('show'); }, 1800);
  }

  // ===== Copiar e-mail =====
  function copyEmail(cb) {
    function ok() { toast('E-mail copiado'); if (cb) cb(); }
    function fallback() {
      var t = d.createElement('textarea');
      t.value = EMAIL;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      d.body.appendChild(t);
      t.select();
      try { d.execCommand('copy'); ok(); } catch (e) { toast('Não foi possível copiar'); }
      d.body.removeChild(t);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(EMAIL).then(ok, fallback);
    } else {
      fallback();
    }
  }
  var cp = $('#copy');
  cp.addEventListener('click', function () {
    copyEmail(function () {
      cp.textContent = 'Copiado ✓';
      setTimeout(function () { cp.textContent = 'Copiar'; }, 1800);
    });
  });

  // ===== Menu de comandos (Ctrl/⌘ + K) =====
  var cmds = [
    { t: 'Ir para Projetos', k: 'projetos trabalhos', h: 'seção', go: '#projetos' },
    { t: 'Ir para Sobre mim', k: 'sobre tecnologias', h: 'seção', go: '#sobre' },
    { t: 'Ir para Contato', k: 'contato', h: 'seção', go: '#contato' },
    { t: 'Enviar e-mail', k: 'email gmail', h: 'ação', href: 'mailto:' + EMAIL },
    { t: 'Copiar e-mail', k: 'copiar email', h: 'ação', copy: true },
    { t: 'Abrir WhatsApp', k: 'whatsapp telefone', h: 'externo', href: 'https://wa.me/5561994176285', blank: true },
    { t: 'Abrir LinkedIn', k: 'linkedin', h: 'externo', href: 'https://www.linkedin.com/in/tiago-alvesdasilva/', blank: true },
    { t: 'Abrir GitHub', k: 'github codigo', h: 'externo', href: 'https://github.com/tiagoalvesdasilva', blank: true }
  ];
  var pal = $('#pal'), inp = $('#pal-in'), list = $('#pal-list');
  var opener = null, idx = 0, shown = cmds;

  function render() {
    var q = inp.value.trim().toLowerCase();
    shown = cmds.filter(function (c) { return (c.t + ' ' + c.k).toLowerCase().indexOf(q) > -1; });
    if (idx >= shown.length) idx = 0;
    list.innerHTML = shown.map(function (c, i) {
      return '<li role="option" id="o' + i + '" data-i="' + i + '"' +
        (i === idx ? ' class="on" aria-selected="true"' : '') +
        '><span>' + c.t + '</span><small>' + c.h + '</small></li>';
    }).join('') || '<li class="none">Nenhum comando encontrado</li>';
    inp.setAttribute('aria-activedescendant', shown.length ? 'o' + idx : '');
    var on = list.querySelector('.on');
    if (on && on.scrollIntoView) on.scrollIntoView({ block: 'nearest' });
  }
  function openPal() {
    opener = d.activeElement;
    pal.hidden = false;
    d.body.style.overflow = 'hidden';
    inp.value = '';
    idx = 0;
    render();
    inp.focus();
  }
  function closePal() {
    pal.hidden = true;
    d.body.style.overflow = '';
    if (opener && opener.focus) opener.focus();
  }
  function run(c) {
    if (!c) return;
    closePal();
    if (c.go) {
      var s = $(c.go);
      if (s) s.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' });
    } else if (c.copy) {
      copyEmail();
    } else if (c.blank) {
      window.open(c.href, '_blank', 'noopener');
    } else {
      location.href = c.href;
    }
  }

  $('#pal-open').addEventListener('click', openPal);
  pal.addEventListener('click', function (e) { if (e.target === pal) closePal(); });
  inp.addEventListener('input', function () { idx = 0; render(); });
  inp.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); if (shown.length) { idx = (idx + 1) % shown.length; render(); } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) { idx = (idx - 1 + shown.length) % shown.length; render(); } }
    else if (e.key === 'Enter') { e.preventDefault(); run(shown[idx]); }
    else if (e.key === 'Tab') { e.preventDefault(); }
  });
  list.addEventListener('click', function (e) {
    var li = e.target.closest('li[data-i]');
    if (li) run(shown[+li.dataset.i]);
  });
  d.addEventListener('keydown', function (e) {
    var tag = d.activeElement ? d.activeElement.tagName : '';
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      pal.hidden ? openPal() : closePal();
    } else if (e.key === '/' && pal.hidden && tag !== 'INPUT' && tag !== 'TEXTAREA') {
      e.preventDefault();
      openPal();
    } else if (e.key === 'Escape' && !pal.hidden) {
      closePal();
    }
  });

  // ===== Daqui para baixo: animações (desligadas para quem prefere menos movimento) =====
  if (calm) return;
  d.documentElement.classList.add('js');

  // Efeito de texto "decodificando"
  var CH = '!<>-_\\/[]{}=+*^?#%&01';
  function scramble(el) {
    var v = el.querySelector('.vis'), txt = el.dataset.t, n = txt.length;
    var base = el.dataset.scramble === 'load' ? 350 : 120;
    var step = Math.min(70, 800 / n);
    var t0 = performance.now(), dl = [], end = 0, i;
    for (i = 0; i < n; i++) {
      dl[i] = base + i * step + Math.random() * 140;
      if (dl[i] > end) end = dl[i];
    }
    cancelAnimationFrame(el._r);
    (function f(now) {
      var t = now - t0, o = '', k;
      for (k = 0; k < n; k++) {
        var c = txt.charAt(k);
        o += (c === ' ' || t >= dl[k]) ? c : CH.charAt(Math.floor(Math.random() * CH.length));
      }
      v.textContent = o;
      if (t < end) el._r = requestAnimationFrame(f);
      else v.textContent = txt;
    })(t0);
  }

  sc.forEach(function (el) {
    var mode = el.dataset.scramble;
    if (mode === 'load') {
      scramble(el);
    } else if (mode === 'hover') {
      var host = el.closest('.card') || el;
      host.addEventListener('mouseenter', function () { scramble(el); });
      host.addEventListener('focus', function () { scramble(el); });
    }
  });

  // Entrada ao rolar: títulos, janela de código e cards
  var viewEls = sc.filter(function (el) { return el.dataset.scramble === 'view'; });
  var cs = $$('.card');
  var win = $('#win');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      if (el.matches('[data-scramble]')) scramble(el);
      else if (el === win) win.classList.add('in');
      else {
        var k = cs.indexOf(el);
        setTimeout(function () { el.classList.add('in'); }, (k % 3) * 100);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.2 });
  viewEls.forEach(function (el) { io.observe(el); });
  cs.forEach(function (c) { io.observe(c); });
  io.observe(win);

  // Cards: inclinação 3D leve (só com mouse)
  if (matchMedia('(pointer:fine)').matches) {
    cs.forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 5).toFixed(2) + 'deg');
        c.style.setProperty('--rx', (-((e.clientY - r.top) / r.height - 0.5) * 5).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', function () {
        c.style.setProperty('--rx', '0deg');
        c.style.setProperty('--ry', '0deg');
      });
    });
  }
})();