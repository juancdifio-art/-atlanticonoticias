// Sistema de autenticación simple con código de acceso

// Verificar si el usuario está autenticado
function isAuthenticated() {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
}

// Autenticar con código
function authenticate(code) {
    if (code === window.CONFIG.adminCode) {
        sessionStorage.setItem('adminAuthenticated', 'true');
        return true;
    }
    return false;
}

// Cerrar sesión
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    showToast('Sesión cerrada', 'success');
}

// Mostrar modal de autenticación
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.add('active');
    document.getElementById('authCode').value = '';
    document.getElementById('authCode').focus();
}

// Cerrar modal de autenticación
function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

// Manejar el formulario de autenticación
function handleAuthSubmit(e) {
    e.preventDefault();
    const code = document.getElementById('authCode').value;

    if (authenticate(code)) {
        closeAuthModal();
        openAdminPanel();
    } else {
        showToast('Código incorrecto', 'error');
        document.getElementById('authCode').value = '';
        document.getElementById('authCode').focus();
    }
}

// Verificar autenticación antes de abrir panel admin
function checkAuthAndOpenPanel() {
    if (isAuthenticated()) {
        openAdminPanel();
    } else {
        showAuthModal();
    }
}

// Inicializar eventos de autenticación
function initAuth() {
    // Manejar formulario de autenticación
    const authForm = document.getElementById('authForm');
    if (authForm) {
        authForm.addEventListener('submit', handleAuthSubmit);
    }

    // Nota: El cierre con ESC y clic fuera se maneja en main.js
    // para evitar duplicar listeners
}
