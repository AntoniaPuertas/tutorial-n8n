/* Tutorial n8n — script común: índice, progreso, copiar código, pestañas, quiz, checklist y diagramas */
{
  const root = document.body.dataset.root || '';
  const page = document.body.dataset.page || '';

  const MODULOS = [
    { id: 'm1', t: '¿Qué es n8n?', f: 'modulos/01-que-es-n8n.html', d: 'Conceptos y ejemplos' },
    { id: 'm2', t: 'Instalación con Docker', f: 'modulos/02-instalacion-docker.html', d: 'n8n en tu ordenador' },
    { id: 'm3', t: 'El editor', f: 'modulos/03-el-editor.html', d: 'Lienzo, nodos y ejecución' },
    { id: 'm4', t: 'Primer workflow', d: 'Próximamente' },
    { id: 'm5', t: 'Datos y expresiones', d: 'Próximamente' },
    { id: 'm6', t: 'Triggers', d: 'Próximamente' },
    { id: 'm7', t: 'Lógica y bucles', d: 'Próximamente' },
    { id: 'm8', t: 'Credenciales e integraciones', d: 'Próximamente' },
    { id: 'm9', t: 'El nodo Code', d: 'Próximamente' },
    { id: 'm10', t: 'IA en n8n', d: 'Próximamente' },
    { id: 'm11', t: 'Errores y depuración', d: 'Próximamente' },
    { id: 'm12', t: 'Proyecto final', d: 'Próximamente' }
  ];

  /* ---- Almacenamiento seguro (puede no estar disponible) ---- */
  const store = {
    get(k, def) { try { const v = localStorage.getItem('n8n-tuto:' + k); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(k, v) { try { localStorage.setItem('n8n-tuto:' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ } }
  };
  let hechos = store.get('hechos', []);

  /* ---- Índice lateral ---- */
  const side = document.getElementById('indice');
  if (side) {
    side.innerHTML = '<h4>Contenido del tutorial</h4><ol>' + MODULOS.map(m =>
      m.f
        ? `<li><a href="${root}${m.f}" data-id="${m.id}"${m.id === page ? ' aria-current="page"' : ''}><div>${m.t}<small>${m.d}</small></div></a></li>`
        : `<li><span>${m.t}</span></li>`
    ).join('') + '</ol>';
  }

  /* ---- Mostrar / ocultar menú lateral ---- */
  const cabecera = document.querySelector('.top');
  if (side && cabecera) {
    const movil = window.matchMedia('(max-width: 900px)');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'menu-btn';
    btn.setAttribute('aria-controls', 'indice');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
      '<path class="h" d="M4 7h16M4 12h16M4 17h16"/><path class="x" d="M6 6l12 12M18 6L6 18"/></svg>';
    cabecera.prepend(btn);
    const fondo = document.createElement('div');
    fondo.className = 'backdrop';
    document.body.appendChild(fondo);

    const abierto = () => movil.matches ? document.body.classList.contains('side-open') : !document.body.classList.contains('side-off');
    const pintar = () => {
      const a = abierto();
      btn.setAttribute('aria-expanded', a);
      btn.setAttribute('aria-label', a ? 'Ocultar el índice' : 'Mostrar el índice');
      btn.title = btn.getAttribute('aria-label');
      if (movil.matches) side.toggleAttribute('inert', !a); else side.removeAttribute('inert');
    };
    const cerrarMovil = () => { document.body.classList.remove('side-open'); pintar(); };

    if (store.get('lateral-oculto', false)) document.body.classList.add('side-off');
    btn.addEventListener('click', () => {
      if (movil.matches) {
        document.body.classList.toggle('side-open');
        if (abierto()) { const a = side.querySelector('a'); if (a) a.focus(); }
      } else {
        document.body.classList.toggle('side-off');
        store.set('lateral-oculto', document.body.classList.contains('side-off'));
      }
      pintar();
    });
    fondo.addEventListener('click', cerrarMovil);
    side.addEventListener('click', e => { if (movil.matches && e.target.closest('a')) cerrarMovil(); });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && movil.matches && abierto()) { cerrarMovil(); btn.focus(); }
    });
    movil.addEventListener('change', () => { document.body.classList.remove('side-open'); pintar(); });
    pintar();
  }

  /* ---- Lista de módulos en la portada ---- */
  const lista = document.getElementById('lista-modulos');
  if (lista) {
    lista.innerHTML = MODULOS.map((m, i) => {
      const n = i + 1;
      if (!m.f) return `<div class="mod soon"><span class="n">${n}</span><div><strong>${m.t}</strong><p>${m.d}</p></div><span class="st">En preparación</span></div>`;
      return `<a class="mod" data-id="${m.id}" href="${root}${m.f}"><span class="n">${n}</span><div><strong>${m.t}</strong><p>${m.d}</p></div><span class="st">Empezar →</span></a>`;
    }).join('');
  }

  /* ---- Progreso ---- */
  const pintarProgreso = () => {
    const disponibles = MODULOS.filter(m => m.f).length;
    const n = hechos.filter(id => MODULOS.some(m => m.id === id && m.f)).length;
    const bar = document.querySelector('.bar i');
    const txt = document.querySelector('.prog span');
    if (bar) bar.style.width = (n / disponibles * 100) + '%';
    if (txt) txt.textContent = `${n} de ${disponibles} módulos completados`;
    document.querySelectorAll('[data-id]').forEach(el => {
      const ok = hechos.includes(el.dataset.id);
      el.classList.toggle('done', ok);
      const st = el.querySelector('.st');
      if (st) st.textContent = ok ? 'Completado ✓' : 'Empezar →';
    });
    const b = document.querySelector('[data-marcar]');
    if (b) b.textContent = hechos.includes(page) ? 'Módulo completado ✓ (pulsa para desmarcar)' : 'Marcar módulo como completado';
  };
  const marcar = document.querySelector('[data-marcar]');
  if (marcar) marcar.addEventListener('click', () => {
    hechos = hechos.includes(page) ? hechos.filter(x => x !== page) : [...hechos, page];
    store.set('hechos', hechos);
    pintarProgreso();
  });
  pintarProgreso();

  /* ---- Botón copiar en bloques de código ---- */
  document.querySelectorAll('.code').forEach(bloque => {
    const btn = bloque.querySelector('.copy');
    const code = bloque.querySelector('pre');
    if (!btn || !code) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.innerText.trim());
        btn.textContent = 'Copiado ✓';
      } catch (e) {
        const r = document.createRange(); r.selectNodeContents(code);
        const s = getSelection(); s.removeAllRanges(); s.addRange(r);
        btn.textContent = 'Seleccionado: pulsa Ctrl+C';
      }
      setTimeout(() => { btn.textContent = 'Copiar'; }, 2200);
    });
  });

  /* ---- Pestañas accesibles ---- */
  document.querySelectorAll('.tabs').forEach((tabs, ti) => {
    const btns = [...tabs.querySelectorAll('[role=tab]')];
    const panels = [...tabs.querySelectorAll('[role=tabpanel]')];
    const clave = 'tab-' + page + '-' + ti;
    const activar = (i, foco) => {
      btns.forEach((b, j) => { b.setAttribute('aria-selected', j === i); b.tabIndex = j === i ? 0 : -1; });
      panels.forEach((p, j) => { p.hidden = j !== i; });
      if (foco) btns[i].focus();
      store.set(clave, i);
    };
    btns.forEach((b, i) => {
      b.addEventListener('click', () => activar(i));
      b.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') activar((i + 1) % btns.length, true);
        if (e.key === 'ArrowLeft') activar((i - 1 + btns.length) % btns.length, true);
      });
    });
    const guardada = store.get(clave, 0);
    activar(guardada < btns.length ? guardada : 0);
  });

  /* ---- Diagramas de nodos ---- */
  const FLUJOS = window.FLUJOS || {};
  document.querySelectorAll('.flow[data-flujo]').forEach(el => {
    const nodos = FLUJOS[el.dataset.flujo] || [];
    el.innerHTML = nodos.map((n, i) =>
      (i ? `<span class="wire" style="--d:${(i * 0.35).toFixed(2)}s" aria-hidden="true"></span>` : '') +
      `<div class="node ${n.tipo || ''}"><b>${n.ico}</b><strong>${n.t}</strong><span>${n.d}</span></div>`
    ).join('');
    el.setAttribute('role', 'img');
    el.setAttribute('aria-label', 'Workflow: ' + nodos.map(n => n.t).join(' → '));
  });

  /* ---- Quiz ---- */
  const quiz = document.getElementById('quiz');
  if (quiz && window.QUIZ) {
    const Q = window.QUIZ;
    let aciertos = 0, respondidas = 0;
    quiz.innerHTML = Q.map((q, i) => `
      <div class="q" data-q="${i}">
        <h3>${i + 1}. ${q.p}</h3>
        <div class="opts">${q.o.map((o, j) => `<button type="button" data-o="${j}">${o}</button>`).join('')}</div>
        <p class="fb" aria-live="polite"></p>
      </div>`).join('') + '<p class="score" id="nota" aria-live="polite"></p><button class="btn ghost" type="button" id="reiniciar" hidden>Repetir el test</button>';
    quiz.addEventListener('click', e => {
      const b = e.target.closest('button[data-o]');
      if (!b) return;
      const caja = b.closest('.q');
      const q = Q[+caja.dataset.q];
      const ok = +b.dataset.o === q.c;
      caja.querySelectorAll('button').forEach((x, j) => { x.disabled = true; if (j === q.c) x.classList.add('right'); });
      if (!ok) b.classList.add('wrong');
      caja.querySelector('.fb').textContent = (ok ? '¡Correcto! ' : 'No exactamente. ') + q.e;
      respondidas++; if (ok) aciertos++;
      if (respondidas === Q.length) {
        document.getElementById('nota').textContent = `Resultado: ${aciertos} de ${Q.length} aciertos.` + (aciertos === Q.length ? ' ¡Perfecto!' : ' Repasa las explicaciones y vuelve a intentarlo.');
        document.getElementById('reiniciar').hidden = false;
      }
    });
    quiz.addEventListener('click', e => {
      if (e.target.id !== 'reiniciar') return;
      aciertos = 0; respondidas = 0;
      quiz.querySelectorAll('.q button').forEach(x => { x.disabled = false; x.classList.remove('right', 'wrong'); });
      quiz.querySelectorAll('.fb').forEach(x => { x.textContent = ''; });
      document.getElementById('nota').textContent = '';
      e.target.hidden = true;
    });
  }

  /* ---- Checklist ---- */
  const check = document.getElementById('checklist');
  if (check) {
    const cajas = [...check.querySelectorAll('input[type=checkbox]')];
    const guardado = store.get('check-' + page, []);
    const msg = document.getElementById('check-msg');
    const actualizar = () => {
      const marcados = cajas.map((c, i) => c.checked ? i : -1).filter(i => i >= 0);
      store.set('check-' + page, marcados);
      if (msg) msg.textContent = marcados.length === cajas.length ? '¡Todo listo! Ya tienes n8n funcionando en tu equipo.' : `${marcados.length} de ${cajas.length} comprobaciones hechas`;
    };
    cajas.forEach((c, i) => { c.checked = guardado.includes(i); c.addEventListener('change', actualizar); });
    actualizar();
  }
}
