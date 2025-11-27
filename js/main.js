// Archivo principal con toda la lógica de la aplicación

let newsDatabase = [];
let currentCategory = 'todas';
let currentNewsId = null;

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', async function() {
    // Inicializar Supabase
    initSupabase();

    // Inicializar autenticación
    initAuth();

    // Cargar y mostrar noticias
    await loadNewsFromDatabase();

    // Actualizar fecha actual
    updateCurrentDate();

    // Configurar filtros de categoría
    setupCategoryFilters();

    // Inicializar event listeners
    initEventListeners();
});

// Cargar noticias desde Supabase
async function loadNewsFromDatabase() {
    newsDatabase = await getAllNews();
    renderAllNews();
}

// Actualizar fecha actual en el header
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date().toLocaleDateString('es-ES', options);
    document.getElementById('currentDate').textContent = date.charAt(0).toUpperCase() + date.slice(1);
}

// ========== RENDERIZADO ==========

// Renderizar todo el contenido
function renderAllNews() {
    renderFeaturedNews();
    renderNewsGrid();
    renderPopularNews();
    updateNewsTicker();
    renderAdminNewsList();
}

// Renderizar noticias destacadas
function renderFeaturedNews() {
    const featuredSection = document.getElementById('featuredSection');
    if (!featuredSection) return;

    if (!newsDatabase || newsDatabase.length === 0) {
        featuredSection.style.display = 'none';
        featuredSection.innerHTML = '';
        return;
    }

    // Noticias de la categoría actual (prioritarias)
    const inCategory = currentCategory === 'todas'
        ? [...newsDatabase]
        : newsDatabase.filter(n => n.category === currentCategory);

    // Noticias de otras categorías (fallback si faltan destacadas)
    const otherNews = currentCategory === 'todas'
        ? []
        : newsDatabase.filter(n => n.category !== currentCategory);

    const sortByDateDesc = (a, b) => new Date(b.created_at) - new Date(a.created_at);

    let pool = [];

    // 1) Destacadas de la categoría actual
    const catFeatured = inCategory.filter(n => n.featured).sort(sortByDateDesc);
    const catNonFeatured = inCategory.filter(n => !n.featured).sort(sortByDateDesc);
    pool.push(...catFeatured, ...catNonFeatured);

    // 2) Si aún faltan para llegar a 3, completar con otras secciones
    if (pool.length < 3 && otherNews.length > 0) {
        const otherFeatured = otherNews.filter(n => n.featured).sort(sortByDateDesc);
        const otherNonFeatured = otherNews.filter(n => !n.featured).sort(sortByDateDesc);
        const fallback = [...otherFeatured, ...otherNonFeatured];

        for (const n of fallback) {
            if (!pool.some(p => p.id === n.id)) {
                pool.push(n);
                if (pool.length >= 3) break;
            }
        }
    }

    // Limitar a un máximo de 3
    const featured = pool.slice(0, Math.min(3, pool.length));

    if (featured.length === 0) {
        featuredSection.style.display = 'none';
        return;
    }

    featuredSection.style.display = 'grid';

    let html = '';

    // Noticia Principal (Grande)
    if (featured[0]) {
        const mainImg = featured[0].image_url || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png';
        html += `
            <div class="featured-main" style="background-image: url('${mainImg}')" onclick="openNewsDetail(${featured[0].id})">
                <img src="${mainImg}" alt="${featured[0].title}" loading="lazy">
                <div class="featured-overlay">
                    <span class="category">${featured[0].category}</span>
                    <h2>${featured[0].title}</h2>
                    <p class="meta"><i class="fas fa-clock"></i> ${formatDate(featured[0].created_at)} | Por ${featured[0].author}</p>
                </div>
            </div>
        `;
    }

    // Noticias Secundarias (Barra lateral)
    if (featured.length > 1) {
        html += '<div class="featured-sidebar">';
        for (let i = 1; i < featured.length; i++) {
            const smallImg = featured[i].image_url || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png';
            html += `
                <div class="featured-small" style="background-image: url('${smallImg}')" onclick="openNewsDetail(${featured[i].id})">
                    <img src="${smallImg}" alt="${featured[i].title}" loading="lazy">
                    <div class="featured-overlay">
                        <span class="category" style="font-size: 0.6rem; padding: 2px 8px; margin-bottom: 5px;">${featured[i].category}</span>
                        <h3>${featured[i].title}</h3>
                    </div>
                </div>
            `;
        }
        html += '</div>';
    }

    featuredSection.innerHTML = html;
}

// Renderizar grid de noticias
function renderNewsGrid() {
    const newsGrid = document.getElementById('newsGrid');
    let filteredNews = currentCategory === 'todas'
        ? newsDatabase
        : newsDatabase.filter(n => n.category === currentCategory);

    filteredNews = filteredNews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    if (filteredNews.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <i class="fas fa-newspaper"></i>
                <h3>No hay noticias aún</h3>
                <p>Haz clic en "Nueva Noticia" para agregar la primera</p>
            </div>
        `;
        return;
    }

    let html = '';
    filteredNews.forEach(news => {
        const imgSrc = news.image_url || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png';
        html += `
            <article class="news-card" onclick="openNewsDetail(${news.id})">
                <div class="news-card-image" style="background-image: url('${imgSrc}')">
                    <img src="${imgSrc}" alt="${news.title}" loading="lazy">
                    <span class="category">${news.category}</span>
                </div>
                <div class="news-card-content">
                    <h3>${news.title}</h3>
                    <p>${news.summary}</p>
                    <div class="news-card-footer">
                        <span class="news-meta">
                            <i class="fas fa-calendar"></i> ${formatDate(news.created_at)}
                        </span>
                        <span class="news-meta">
                            ${news.views > 0 ? `<i class="fas fa-eye"></i> ${news.views} lectura${news.views === 1 ? '' : 's'}` : '<span class="badge-new">Nueva</span>'}
                        </span>
                        <div class="share-buttons" onclick="event.stopPropagation()">
                            <button class="share-btn facebook" onclick="shareOnFacebook(${news.id})">
                                <i class="fab fa-facebook-f"></i>
                            </button>
                            <button class="share-btn whatsapp" onclick="shareOnWhatsApp(${news.id})">
                                <i class="fab fa-whatsapp"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    });

    newsGrid.innerHTML = html;
}

// Renderizar noticias populares
function renderPopularNews() {
    const popularNews = document.getElementById('popularNews');
    const sorted = [...newsDatabase].sort((a, b) => b.views - a.views).slice(0, 5);

    if (sorted.length === 0) {
        popularNews.innerHTML = '<p style="color: #888; text-align: center;">Sin noticias aún</p>';
        return;
    }

    let html = '';
    sorted.forEach(news => {
        html += `
            <div class="popular-news-item" onclick="openNewsDetail(${news.id})">
                <div class="popular-news-info">
                    <h4 class="popular-news-title">${news.title}</h4>
                    <span class="popular-news-meta">
                        <i class="fas fa-calendar"></i> ${formatDate(news.created_at)}
                    </span>
                </div>
            </div>
        `;
    });

    popularNews.innerHTML = html;
}

// Actualizar ticker de noticias
function updateNewsTicker() {
    const ticker = document.getElementById('newsTicker');
    const latest = newsDatabase.slice(0, 5);

    if (latest.length === 0) {
        ticker.innerHTML = '<span>Bienvenido a Noticias Local - Agrega tu primera noticia</span>';
        return;
    }

    let html = '';
    latest.forEach(news => {
        html += `<span>${news.title}</span>`;
    });
    html += html; // Duplicar para loop infinito

    ticker.innerHTML = html;
}

// Renderizar lista de noticias en el panel admin
function renderAdminNewsList() {
    const adminList = document.getElementById('adminNewsList');
    if (!adminList) return;

    if (!newsDatabase || newsDatabase.length === 0) {
        adminList.innerHTML = '<p style="color: #888; text-align: center;">No hay noticias publicadas</p>';
        return;
    }

    let filtered = [...newsDatabase];

    const searchInput = document.getElementById('adminSearchInput');
    const query = searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '';

    if (query) {
        filtered = filtered.filter(n => (n.title || '').toLowerCase().includes(query));
    }

    if (filtered.length === 0) {
        adminList.innerHTML = '<p style="color: #888; text-align: center;">No se encontraron noticias</p>';
        return;
    }

    filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Si no hay búsqueda activa, mostrar solo las últimas 10 para que la lista no sea interminable
    if (!query) {
        filtered = filtered.slice(0, 10);
    }

    let html = '';
    filtered.forEach(news => {
        html += `
            <div class="admin-news-item">
                <img src="${news.image_url || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png'}" alt="${news.title}" loading="lazy">
                <div class="admin-news-info">
                    <h4>${news.title.substring(0, 50)}...</h4>
                    <span>${news.category} | ${formatDate(news.created_at)}</span>
                </div>
                <div class="admin-news-actions">
                    <button class="btn-edit" onclick="editNews(${news.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-delete" onclick="handleDeleteNews(${news.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });

    adminList.innerHTML = html;
}

// ========== FILTROS Y NAVEGACIÓN ==========

// Configurar filtros de categoría
function setupCategoryFilters() {
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('nav a').forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderFeaturedNews();
            renderNewsGrid();
        });
    });
}

// ========== MODAL DE ADMINISTRACIÓN ==========

// Abrir panel de administración
function openAdminPanel() {
    document.getElementById('adminModal').classList.add('active');
    document.getElementById('modalTitle').textContent = 'Nueva Noticia';
    document.getElementById('newsForm').reset();
    document.getElementById('newsId').value = '';
    document.getElementById('imagePreview').style.display = 'none';
}

// Cerrar panel de administración
function closeAdminPanel() {
    document.getElementById('adminModal').classList.remove('active');
}

// Vista previa de imagen
function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Manejar envío del formulario de noticias
async function handleNewsFormSubmit(e) {
    e.preventDefault();

    const newsId = document.getElementById('newsId').value;
    const imageFile = document.getElementById('newsImage').files[0];
    const imageUrl = document.getElementById('newsImageUrl').value;
    const preview = document.getElementById('imagePreview');

    let imageToSave = imageUrl;

    // Si hay un archivo de imagen, subirlo a Supabase Storage
    if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
            imageToSave = uploadedUrl;
        }
    } else if (preview.style.display !== 'none' && !imageUrl) {
        imageToSave = preview.src;
    }

    const newsData = {
        title: document.getElementById('newsTitle').value,
        category: document.getElementById('newsCategory').value,
        author: document.getElementById('newsAuthor').value,
        summary: document.getElementById('newsSummary').value,
        content: document.getElementById('newsContent').value,
        image: imageToSave || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
        featured: document.getElementById('isFeatured').checked
    };

    if (newsId) {
        // Actualizar noticia existente
        await updateNews(parseInt(newsId), newsData);
    } else {
        // Crear nueva noticia
        await createNews(newsData);
    }

    // Recargar noticias y cerrar modal
    await loadNewsFromDatabase();
    closeAdminPanel();
}

// Editar noticia
function editNews(id) {
    const news = newsDatabase.find(n => n.id === id);
    if (!news) return;

    document.getElementById('modalTitle').textContent = 'Editar Noticia';
    document.getElementById('newsId').value = news.id;
    document.getElementById('newsTitle').value = news.title;
    document.getElementById('newsCategory').value = news.category;
    document.getElementById('newsAuthor').value = news.author;
    document.getElementById('newsSummary').value = news.summary;
    document.getElementById('newsContent').value = news.content;
    document.getElementById('newsImageUrl').value = news.image_url || '';
    document.getElementById('isFeatured').checked = news.featured;

    const preview = document.getElementById('imagePreview');
    if (news.image_url) {
        preview.src = news.image_url;
        preview.style.display = 'block';
    }

    document.getElementById('adminModal').classList.add('active');
}

// Eliminar noticia
async function handleDeleteNews(id) {
    if (confirm('¿Estás seguro de eliminar esta noticia?')) {
        const success = await deleteNews(id);
        if (success) {
            await loadNewsFromDatabase();
        }
    }
}

// ========== RESETEAR CON NOTICIAS DE IA (DEMO) ==========

async function resetNewsWithAINews() {
    const confirmed = confirm('Esto eliminará TODAS las noticias actuales y cargará noticias de ejemplo sobre IA. ¿Continuar?');
    if (!confirmed) return;

    const ok = await deleteAllNews();
    if (!ok) return;

    const demoNews = [
        {
            title: 'Gobierno analiza marco regulatorio para la IA generativa en Argentina',
            category: 'politica',
            author: 'Redacción Atlántico IA',
            summary: 'Funcionarios, académicos y empresas tecnológicas se reúnen para discutir límites éticos y oportunidades económicas de la inteligencia artificial generativa.',
            content:
`Autoridades nacionales y provinciales analizan por estas horas distintos borradores de un posible marco regulatorio para la inteligencia artificial generativa.

El objetivo es equilibrar la innovación tecnológica con la protección de los derechos de los ciudadanos: privacidad, propiedad intelectual y transparencia en el uso de algoritmos.

En la mesa de trabajo también participan universidades públicas, cámaras empresarias y organizaciones de la sociedad civil, que piden reglas claras pero flexibles para no frenar las oportunidades económicas que abre la IA.`,
            image: 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
            featured: true
        },
        {
            title: 'Comercios de Necochea prueban asistentes virtuales para atender consultas las 24 horas',
            category: 'economia',
            author: 'Redacción Atlántico IA',
            summary: 'Pequeños y medianos comercios locales empiezan a usar chatbots impulsados por IA para responder preguntas frecuentes y tomar pedidos fuera del horario comercial.',
            content:
`Emprendimientos gastronómicos, tiendas de ropa y servicios profesionales de Necochea comenzaron a implementar asistentes virtuales basados en IA.

Los sistemas se integran con WhatsApp y formularios web, responden consultas sobre precios, horarios de atención y disponibilidad de productos, y en algunos casos permiten iniciar pedidos simples.

Los comerciantes destacan que la herramienta no reemplaza la atención humana, pero les permite no perder oportunidades de venta durante la noche o los fines de semana.`,
            image: 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
            featured: true
        },
        {
            title: 'Docentes de la región usan IA para planificar clases y material didáctico',
            category: 'cultura',
            author: 'Redacción Atlántico IA',
            summary: 'Profesores de escuelas secundarias y terciarios incorporan herramientas de IA para crear guías de estudio, ejercicios y explicaciones adaptadas al nivel de cada curso.',
            content:
`Cada vez más docentes de Necochea y Quequén experimentan con plataformas de inteligencia artificial para preparar sus clases.

Las herramientas permiten generar ejemplos, resúmenes y actividades en pocos minutos, que luego el docente adapta y corrige según las necesidades del curso.

Especialistas en educación recuerdan que la IA debe verse como un apoyo al trabajo del profesor y no como un reemplazo, y subrayan la importancia de enseñar a los estudiantes a usarla de manera crítica y responsable.`,
            image: 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
            featured: false
        },
        {
            title: 'Hospital incorpora sistema de IA para priorizar turnos de pacientes complejos',
            category: 'sociedad',
            author: 'Redacción Atlántico IA',
            summary: 'Un algoritmo analiza datos clínicos para ayudar a los equipos médicos a identificar casos que requieren seguimiento más urgente, sin reemplazar el criterio profesional.',
            content:
`Un hospital de la región comenzó a usar inteligencia artificial para mejorar la gestión de turnos y el seguimiento de pacientes con patologías crónicas.

El sistema analiza información clínica básica y señales de alarma reportadas por los propios pacientes para sugerir prioridades de atención.

Desde la institución aclaran que la decisión final siempre queda en manos del equipo médico, pero que la IA ayuda a detectar patrones y casos que podrían pasar desapercibidos en grandes volúmenes de datos.`,
            image: 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
            featured: false
        },
        {
            title: 'Atlántico Noticias lanza laboratorio de periodismo asistido por IA',
            category: 'local',
            author: 'Redacción Atlántico IA',
            summary: 'El portal local experimenta con herramientas de IA para análisis de datos, apoyo en redacción y generación de visualizaciones, manteniendo la revisión editorial humana.',
            content:
`Atlántico Noticias presentó un pequeño laboratorio interno para explorar usos responsables de la IA en el trabajo periodístico.

Entre los proyectos en marcha se encuentran el análisis automatizado de datos públicos, la generación de borradores de notas a partir de gacetillas y la creación de gráficos interactivos.

La redacción remarca que cada contenido sigue pasando por revisión humana y que la prioridad es mantener la calidad, el contexto local y la verificación de la información.`,
            image: 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png',
            featured: false
        }
    ];

    for (const item of demoNews) {
        await createNews(item);
    }

    await loadNewsFromDatabase();
    showToast('Noticias reemplazadas por un set demo sobre IA', 'success');
}

// ========== DETALLE DE NOTICIA ==========

// Abrir detalle de noticia (redirige a la página de detalle)
function openNewsDetail(id) {
    if (!id) return;
    window.location.href = `noticia.html?id=${id}`;
}

// Cerrar detalle de noticia (modal ya no se usa, función vacía por compatibilidad)
function closeNewsDetail() {}

// ========== FUNCIONES DE COMPARTIR ==========

// Construir URL de detalle de noticia a partir de un id
function buildNewsUrl(id) {
    const base = window.location.origin;
    let path = window.location.pathname;
    // Quitar index.html si estuviera
    path = path.replace(/index\.html?$/, '');
    return `${base}${path}noticia.html?id=${id || currentNewsId}`;
}

function shareOnFacebook(id) {
    const news = id ? newsDatabase.find(n => n.id === id) : newsDatabase.find(n => n.id === currentNewsId);
    if (!news) return;
    const url = encodeURIComponent(buildNewsUrl(news.id));
    const text = encodeURIComponent(news.title);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter(id) {
    const news = id ? newsDatabase.find(n => n.id === id) : newsDatabase.find(n => n.id === currentNewsId);
    if (!news) return;
    const url = encodeURIComponent(buildNewsUrl(news.id));
    const text = encodeURIComponent(news.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp(id) {
    const news = id ? newsDatabase.find(n => n.id === id) : newsDatabase.find(n => n.id === currentNewsId);
    if (!news) return;
    const link = buildNewsUrl(news.id);
    const text = encodeURIComponent(`${news.title}\n\n${news.summary}\n\n${link}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink(id) {
    const news = id ? newsDatabase.find(n => n.id === id) : newsDatabase.find(n => n.id === currentNewsId);
    const link = news ? buildNewsUrl(news.id) : window.location.href;
    navigator.clipboard.writeText(link);
    showToast('¡Enlace copiado al portapapeles!', 'success');
}

// ========== UTILIDADES ==========

// Formatear fecha
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// Mostrar notificación toast
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ========== EVENT LISTENERS ==========

// Inicializar todos los event listeners
function initEventListeners() {
    // Formulario de noticias
    const newsForm = document.getElementById('newsForm');
    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsFormSubmit);
    }

    // Cerrar modales con Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAdminPanel();
            closeNewsDetail();
            closeAuthModal();
        }
    });

    // Cerrar modales al hacer clic fuera
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeAdminPanel();
                closeNewsDetail();
            }
        });
    });
}
