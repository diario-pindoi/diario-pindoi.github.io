document.addEventListener('DOMContentLoaded', () => {
    console.log('PINDOI cargado correctamente.');
    
    // Precargar imágenes
    const imagenesPrecargar = [
        'recursos/Logo.png',
        'recursos/Diario.webp',
        'img/feria-libro-1.webp',
        'img/presentacion-escolar-1.webp'
    ];
    
    imagenesPrecargar.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Efecto de carga suave
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Actualizar fecha y hora en tiempo real
    function actualizarFechaHora() {
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        const ahora = new Date();
        document.getElementById('fechaHora').textContent = 
            ahora.toLocaleDateString('es-AR', opciones);
    }
    
    setInterval(actualizarFechaHora, 60000); // Actualizar cada minuto
    actualizarFechaHora();
    
    // Cargar horóscopo
    function cargarHoroscopo() {
        const signos = [
            {
                nombre: "Aries",
                icono: "♈",
                prediccion: "Un día para tomar iniciativas. Su energía los llevará lejos.",
                fecha: "21 Mar - 19 Abr"
            },
            {
                nombre: "Tauro",
                icono: "♉",
                prediccion: "Mantén la calma y sigue adelante. La paciencia es tu virtud.",
                fecha: "20 Abr - 20 May"
            },
            {
                nombre: "Géminis",
                icono: "♊",
                prediccion: "Comunicación fluida. Excelente día para reuniones importantes.",
                fecha: "21 May - 20 Jun"
            },
            {
                nombre: "Cáncer",
                icono: "♋",
                prediccion: "Las emociones estarán a flor de piel. Busca equilibrio interior.",
                fecha: "21 Jun - 22 Jul"
            },
            {
                nombre: "Leo",
                icono: "♌",
                prediccion: "Buen momento para proyectos creativos. Brilla con luz propia.",
                fecha: "23 Jul - 22 Ago"
            },
            {
                nombre: "Virgo",
                icono: "♍",
                prediccion: "Día para organizar. Los detalles marcarán la diferencia.",
                fecha: "23 Ago - 22 Sep"
            },
            {
                nombre: "Libra",
                icono: "♎",
                prediccion: "Armonía en las relaciones. Toma decisiones con el corazón.",
                fecha: "23 Sep - 22 Oct"
            },
            {
                nombre: "Escorpio",
                icono: "♏",
                prediccion: "Transformación personal. Deja atrás lo que ya no sirve.",
                fecha: "23 Oct - 21 Nov"
            },
            {
                nombre: "Sagitario",
                icono: "♐",
                prediccion: "Aventuras en el horizonte. Viajes o nuevos aprendizajes.",
                fecha: "22 Nov - 21 Dic"
            },
            {
                nombre: "Capricornio",
                icono: "♑",
                prediccion: "Enfoque en metas a largo plazo. Tu disciplina dará frutos.",
                fecha: "22 Dic - 19 Ene"
            },
            {
                nombre: "Acuario",
                icono: "♒",
                prediccion: "Ideas innovadoras. Comparte tus pensamientos con el mundo.",
                fecha: "20 Ene - 18 Feb"
            },
            {
                nombre: "Piscis",
                icono: "♓",
                prediccion: "Intuición agudizada. Confía en tus sentimientos internos.",
                fecha: "19 Feb - 20 Mar"
            }
        ];
        
        const contenedor = document.getElementById('signosHoroscopo');
        contenedor.innerHTML = '';
        
        signos.forEach(signo => {
            const elemento = document.createElement('div');
            elemento.className = 'signo-item';
            elemento.innerHTML = `
                <div class="signo-icono">${signo.icono}</div>
                <div class="signo-content">
                    <div class="signo-nombre">${signo.nombre}</div>
                    <div class="signo-prediccion">${signo.prediccion}</div>
                    <div class="signo-fecha">${signo.fecha}</div>
                </div>
            `;
            contenedor.appendChild(elemento);
        });
    }
    
    cargarHoroscopo();
    
    // Mejorar accesibilidad de las imágenes
    document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
            img.alt = 'Imagen ilustrativa del diario PINDOI';
        }
    });
    
    // Efecto hover para elementos interactivos
    document.querySelectorAll('.signo-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});