// =============================
// MENÚ MÓVIL
// =============================
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.getElementById('nav-links');

menuToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('active'));
});

document.getElementById('year').textContent = new Date().getFullYear();



// =============================
// BOT INTERACTIVO (PRESUPUESTADOR)
// =============================

const botToggle = document.getElementById('bot-toggle');
const megaBot   = document.getElementById('mega-bot');
const botClose  = document.getElementById('bot-close');
const progressBar = document.getElementById('bot-progress-bar');

// Datos del usuario
let userData = {
    name: '',
    service: '',
    urgency: '',
    details: ''
};

let currentStep = 1;
const totalSteps = 4;

// ABRIR / CERRAR
botToggle?.addEventListener('click', () => {
    megaBot.style.display = 'block';
    botToggle.style.display = 'none'; // Ocultar botón al abrir
});

botClose?.addEventListener('click', () => {
    megaBot.style.display = 'none';
    botToggle.style.display = 'flex'; // Mostrar botón al cerrar
});

// NAVEGACIÓN ENTRE PASOS
function showStep(step) {
    document.querySelectorAll('.bot-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    
    // Actualizar barra de progreso
    progressBar.style.width = `${(step / totalSteps) * 100}%`;
    currentStep = step;
}

// --- PASO 1: NOMBRE ---
const nameInput = document.getElementById('bot-name');
const nameNextBtn = document.getElementById('btn-name-next');

nameNextBtn?.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if(name.length < 2) {
        nameInput.style.borderColor = 'red'; // Feedback visual simple
        return;
    }
    nameInput.style.borderColor = '#ccc';
    userData.name = name;
    
    // Actualizar placeholders con el nombre
    document.querySelectorAll('.name-placeholder').forEach(span => span.textContent = name);
    
    showStep(2);
});

// --- PASO 2: SERVICIO (Botones) ---
document.querySelectorAll('#step-2 .bot-opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        userData.service = e.target.dataset.service; // Guardar servicio
        showStep(3); // Avanzar automático
    });
});

// --- PASO 3: URGENCIA (Botones) ---
document.querySelectorAll('#step-3 .bot-opt-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        userData.urgency = e.target.dataset.urgency; // Guardar urgencia
        showStep(4); // Avanzar automático
    });
});

// --- BOTONES ATRÁS ---
document.querySelectorAll('.btn-back').forEach(btn => {
    btn.addEventListener('click', () => {
        if(currentStep > 1) showStep(currentStep - 1);
    });
});

// --- PASO 4: ENVIAR WHATSAPP (GENERACIÓN DE MENSAJE HUMANO) ---
document.getElementById('bot-send')?.addEventListener('click', () => {
    userData.details = document.getElementById('bot-details').value.trim();

    if(userData.details === "") {
        document.getElementById('bot-details').style.borderColor = 'red';
        return;
    }

    // Lógica de texto según urgencia para que suene natural
    let introUrgencia = "";
    
    if (userData.urgency === "Muy Urgente") {
        introUrgencia = "Te escribo porque tengo una *urgencia*";
    } else if (userData.urgency === "Urgente") {
        introUrgencia = "Quería consultarte por un trabajo que necesito realizar *lo antes posible*";
    } else {
        introUrgencia = "Quería pedirte presupuesto para un trabajo (sin apuro inmediato)";
    }

    // Construcción del mensaje
    const mensaje = 
`Hola Luis, mi nombre es *${userData.name}*. 👋
${introUrgencia} de *${userData.service}*.

📝 *Te comento el detalle:*
"${userData.details}"

¿Podrías decirme disponibilidad o un estimado?
¡Gracias!`;

    // Enviar
    const url = `https://wa.me/5493462558290?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
    
    // Opcional: Cerrar bot después de enviar
    setTimeout(() => {
        megaBot.style.display = 'none';
        botToggle.style.display = 'flex';
        // Resetear form si quieres (opcional)
    }, 2000);
});
