document.addEventListener('DOMContentLoaded', () => {
  // ---------- Loader ----------
  const loader = document.getElementById('loader');
  setTimeout(() => {
    if (loader) { loader.style.opacity = '0'; setTimeout(()=> loader.style.display = 'none', 220); }
  }, 300);

  // ---------- Fecha y hora ----------
  function actualizarFechaHora(){
    const opciones = { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false };
    const ahora = new Date();
    const fechaHora = ahora.toLocaleDateString('es-AR', opciones);
    const fh = fechaHora.replace(/, (\d{1,2}):(\d{2})$/, ' | $1:$2');
    const nodo = document.getElementById('fechaHora');
    if (nodo) nodo.textContent = fh;
  }
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 60000);

  // ---------- Precarga ligera ----------
  ['recursos/Logo.png','recursos/Diario.webp','img/feria-libro-1.jpg','img/presentacion-escolar-1.jpg'].forEach(src=>{
    const img = new Image(); img.src = src;
  });

  // ---------- Imagenes: accesibilidad & lazy ----------
  document.querySelectorAll('img').forEach(img=>{
    if (!img.alt || !img.alt.trim()) img.alt = 'Imagen ilustrativa del diario PINDOI';
    img.decoding = 'async';
    if (!img.loading) img.loading = 'lazy';
  });

  // ---------- IntersectionObserver para animaciones ----------
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.obs').forEach(el => io.observe(el));

  // ---------- Paginación ----------
  const paginas = Array.from(document.querySelectorAll('.pagina'));
  const totalPaginas = paginas.length || 16;
  const spanTotal = document.getElementById('totalPaginas');
  if (spanTotal) spanTotal.textContent = String(totalPaginas);

  let paginaActual = 1;
  const indicador = document.getElementById('paginaActual');
  const btnPrev = document.getElementById('btnPaginaAnterior');
  const btnNext = document.getElementById('btnPaginaSiguiente');
  const paginador = document.querySelector('.paginador-numerico');
  const contenedorPaginas = document.getElementById('contenedorPaginas');

  // Crear pills
  function crearPills(){
    paginador.innerHTML = '';
    for (let i=1;i<=totalPaginas;i++){
      const b = document.createElement('button');
      b.className = 'pill';
      b.type = 'button';
      b.role = 'tab';
      b.setAttribute('aria-selected', i===1 ? 'true' : 'false');
      b.tabIndex = i===1 ? 0 : -1;
      b.textContent = String(i);
      b.addEventListener('click', ()=> cambiarPagina(i));
      paginador.appendChild(b);
    }
  }
  crearPills();

  // Reveals dentro de una pagina (stagger)
  function revealElementsInPage(pageNum){
    const selector = `.pagina[data-pagina="${pageNum}"] .obs`;
    const elems = Array.from(document.querySelectorAll(selector));
    elems.forEach((el, idx) => {
      if (el.classList.contains('reveal')) return;
      setTimeout(()=> {
        el.classList.add('reveal');
        try { io.unobserve(el); } catch(e){}
      }, idx * 50);
    });
  }

  // Scroll al contenedor de páginas y focus al título
  function scrollToContentAndFocus(pageNum){
    if (contenedorPaginas) {
      contenedorPaginas.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(()=> {
      const activa = document.querySelector(`.pagina[data-pagina="${pageNum}"]`);
      if (activa) {
        const titulo = activa.querySelector('.seccion-titulo');
        if (titulo) {
          titulo.setAttribute('tabindex', '-1');
          titulo.focus({ preventScroll: true });
          setTimeout(()=> { titulo.removeAttribute('tabindex'); }, 1200);
        }
      }
    }, 350);
  }

  function cambiarPagina(nueva){
    if (nueva < 1 || nueva > totalPaginas) return;
    paginas.forEach(p => p.classList.remove('pagina-activa'));
    const activa = document.querySelector(`.pagina[data-pagina="${nueva}"]`);
    if (activa) activa.classList.add('pagina-activa');

    paginaActual = nueva;
    if (indicador) indicador.textContent = String(paginaActual);
    if (btnPrev) btnPrev.disabled = paginaActual === 1;
    if (btnNext) btnNext.disabled = paginaActual === totalPaginas;

    document.querySelectorAll('.pill').forEach((b, i) => {
      const sel = (i + 1) === paginaActual;
      b.setAttribute('aria-selected', String(sel));
      b.tabIndex = sel ? 0 : -1;
    });

    // actualizar hash sin saltar
    history.replaceState(null, '', `#p${paginaActual}`);

    // reveal y scroll/focus
    revealElementsInPage(paginaActual);
    scrollToContentAndFocus(paginaActual);
  }

  if (btnPrev) btnPrev.addEventListener('click', ()=> cambiarPagina(paginaActual - 1));
  if (btnNext) btnNext.addEventListener('click', ()=> cambiarPagina(paginaActual + 1));

  // Flechas teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') cambiarPagina(paginaActual - 1);
    if (e.key === 'ArrowRight') cambiarPagina(paginaActual + 1);
  });

  // Enlaces del menu
  document.querySelectorAll('a[data-goto]').forEach(a=>{
    a.addEventListener('click', (ev)=>{
      ev.preventDefault();
      const n = Number(a.getAttribute('data-goto')) || 1;
      cambiarPagina(n);
    });
  });

  // Abrir hash si existe
  if (location.hash && /^#p(\d+)$/.test(location.hash)){
    const n = Number(location.hash.replace('#p',''));
    if (n >= 1 && n <= totalPaginas) cambiarPagina(n);
    else cambiarPagina(1);
  } else {
    cambiarPagina(1);
  }

  // Botón "Ir arriba"
  const btnTop = document.getElementById('btnTop');
  function toggleTop(){ if (window.scrollY > 450) btnTop.classList.add('show'); else btnTop.classList.remove('show'); }
  window.addEventListener('scroll', toggleTop);
  if (btnTop) btnTop.addEventListener('click', ()=> {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

});
