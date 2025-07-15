document.addEventListener('DOMContentLoaded', () => {
    console.log('PINDOI cargado correctamente.');
    
    // Precargar imágenes
    const imagenesPrecargar = [
        'recursos/fondo.webp',
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
            minute: '2-digit',
            second: '2-digit'
        };
        const ahora = new Date();
        document.getElementById('fechaHora').textContent = 
            ahora.toLocaleDateString('es-AR', opciones);
    }
    
    setInterval(actualizarFechaHora, 1000);
    actualizarFechaHora();
    
    // Simular datos del tiempo (actualización periódica)
    function actualizarTiempo() {
        const ahora = new Date();
        const horaActual = ahora.getHours();
        
        // Datos simulados variando según la hora del día
        const datosTiempo = {
            horaActualizacion: ahora.toLocaleTimeString('es-AR'),
            temperatura: 20 + Math.round(Math.sin(horaActual/24 * Math.PI) * 5),
            humedad: 60 + Math.round(Math.random() * 20),
            viento: 5 + Math.round(Math.random() * 15),
            descripciones: [
                "Despejado", "Parcialmente nublado", "Mayormente nublado", 
                "Niebla ligera", "Soleado", "Algo nublado"
            ],
            iconos: ["☀️", "⛅", "☁️", "🌫️", "🌤️"]
        };
        
        // Seleccionar descripción e icono basado en la hora
        const indiceDesc = Math.min(
            Math.floor(horaActual / 6), 
            datosTiempo.descripciones.length - 1
        );
        
        // Actualizar datos actuales
        document.getElementById('tiempoTemperatura').textContent = 
            `${datosTiempo.temperatura}°C`;
        document.getElementById('tiempoDescripcion').textContent = 
            datosTiempo.descripciones[indiceDesc];
        document.getElementById('tiempoHumedad').textContent = 
            `Humedad: ${datosTiempo.humedad}%`;
        document.getElementById('tiempoViento').textContent = 
            `Viento: ${datosTiempo.viento} km/h`;
        document.getElementById('tiempoIcono').textContent = 
            datosTiempo.iconos[indiceDesc];
        document.getElementById('tiempoActualizado').textContent = 
            `Hoy ${ahora.toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit'})}`;
        
        // Generar pronóstico próximas horas
        const contenedorPronostico = document.getElementById('tiempoProximasHoras');
        contenedorPronostico.innerHTML = '';
        
        for (let i = 0; i < 4; i++) {
            const hora = (horaActual + i) % 24;
            const temp = datosTiempo.temperatura + i - 2;
            const iconIndex = Math.min(
                Math.floor(hora / 6), 
                datosTiempo.iconos.length - 1
            );
            
            const elemento = document.createElement('div');
            elemento.className = 'hora-item';
            elemento.innerHTML = `
                <span>${hora}h</span>
                <span>${temp}°C</span>
                <span>${datosTiempo.iconos[iconIndex]}</span>
            `;
            contenedorPronostico.appendChild(elemento);
        }
    }
    
    // Actualizar cada 30 minutos (simulación)
    actualizarTiempo();
    setInterval(actualizarTiempo, 1800000);
    
    // Mejorar accesibilidad de las imágenes
    document.querySelectorAll('img').forEach(img => {
        if (!img.alt) {
            img.alt = 'Imagen ilustrativa del diario PINDOI';
        }
    });
});