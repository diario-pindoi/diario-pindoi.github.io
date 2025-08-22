document.addEventListener('DOMContentLoaded', () => {
  // --- Loader ---
  const loader = document.getElementById('loader');
  setTimeout(() => {
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(()=> loader.style.display='none', 220);
    }
  }, 320);

  // --- Fecha y hora ---
  function actualizarFechaHora(){
    const opciones = { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', hour12:false };
    const ahora = new Date();
    const texto = ahora.toLocaleDateString('es-AR', opciones).replace(/, /g, ', ');
    const nodo = document.getElementById('fechaHora');
    if (nodo) nodo.textContent = texto;
  }
  actualizarFechaHora();
  setInterval(actualizarFechaHora, 60000);

  // --- Precarga ligera de imágenes importantes ---
  ['recursos/Logo.png','recursos/Diario.webp','img/feria-libro-1.jpg','img/presentacion-escolar-1.jpg'].forEach(src => {
    const i = new Image(); i.src = src;
  });

  // --- Asegurar alt y lazy en imágenes ---
  document.querySelectorAll('img').forEach(img => {
    if (!img.alt || !img.alt.trim()) img.alt = 'Imagen ilustrativa del diario';
    img.decoding = 'async';
    if (!img.loading) img.loading = 'lazy';
  });

  // --- IntersectionObserver para revelar elementos (evita contenido "en blanco") ---
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.obs').forEach(el => io.observe(el));

  // --- Paginación ---
  const paginas = Array.from(document.querySelectorAll('.pagina'));
  const totalPaginas = paginas.length || 16;
  const spanTotal = document.getElementById('totalPaginas');
  if (spanTotal) spanTotal.textContent = String(totalPaginas);

  let paginaActual = 1;
  const indicador = document.getElementById('paginaActual');
  const btnPrev = document.getElementById('btnPaginaAnterior');
  const btnNext = document.getElementById('btnPaginaSiguiente');
  const paginadorNumerico = document.querySelector('.paginador-numerico');
  const contenedorPaginas = document.getElementById('contenedorPaginas');

  // Crear botones numericos
  function crearPills(){
    paginadorNumerico.innerHTML = '';
    for (let i=1;i<=totalPaginas;i++){
      const b = document.createElement('button');
      b.className = 'pill';
      b.type = 'button';
      b.setAttribute('aria-selected', i===1 ? 'true' : 'false');
      b.textContent = String(i);
      b.addEventListener('click', ()=> cambiarPagina(i));
      paginadorNumerico.appendChild(b);
    }
  }
  crearPills();

  // Revelar elementos dentro de una pagina (stagger)
  function revealElementsInPage(pageNum){
    const selector = `.pagina[data-pagina="${pageNum}"] .obs`;
    const elems = Array.from(document.querySelectorAll(selector));
    elems.forEach((el, idx) => {
      if (el.classList.contains('reveal')) return;
      setTimeout(()=> {
        el.classList.add('reveal');
        try { io.unobserve(el); } catch(e){}
      }, idx * 60);
    });
  }

  // Scroll al contenedor y foco al título
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
          setTimeout(()=> titulo.removeAttribute('tabindex'), 1200);
        }
      }
    }, 360);
  }

  // Cambiar de página (principal)
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
    });

    // actualizar hash sin forzar scroll del navegador
    history.replaceState(null, '', `#p${paginaActual}`);

    // revelar contenido de la pagina y desplazarse al contenedor (evita "irse al inicio")
    revealElementsInPage(paginaActual);
    scrollToContentAndFocus(paginaActual);
  }

  // Prev / Next
  if (btnPrev) btnPrev.addEventListener('click', ()=> cambiarPagina(paginaActual - 1));
  if (btnNext) btnNext.addEventListener('click', ()=> cambiarPagina(paginaActual + 1));

  // Atajos con flechas
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') cambiarPagina(paginaActual - 1);
    if (e.key === 'ArrowRight') cambiarPagina(paginaActual + 1);
  });

  // Enlaces del menu
  document.querySelectorAll('a[data-goto]').forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const n = Number(a.getAttribute('data-goto')) || 1;
      cambiarPagina(n);
    });
  });

  // Si hay hash al cargar, abrir esa página
  if (location.hash && /^#p(\d+)$/.test(location.hash)){
    const n = Number(location.hash.replace('#p',''));
    if (n >= 1 && n <= totalPaginas) cambiarPagina(n);
    else cambiarPagina(1);
  } else {
    // inicial
    cambiarPagina(1);
  }

  // Botón "Ir arriba"
  const btnTop = document.getElementById('btnTop');
  function toggleTop(){ if (window.scrollY > 450) btnTop.classList.add('show'); else btnTop.classList.remove('show'); }
  window.addEventListener('scroll', toggleTop);
  if (btnTop) btnTop.addEventListener('click', ()=> window.scrollTo({ top: 0, behavior: 'smooth' }));

});
