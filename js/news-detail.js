// Página de detalle de noticia

let currentNewsId = null;
let currentNews = null;

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

// Construir URL canónica de la noticia
function getNewsUrl(id) {
    const url = new URL(window.location.href);
    url.search = '';
    url.pathname = url.pathname.replace(/noticia\.html?$/, 'noticia.html');
    url.searchParams.set('id', id || currentNewsId);
    return url.toString();
}

async function initNewsDetail() {
    initSupabase();

    // Fecha en header
    try {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date().toLocaleDateString('es-ES', options);
        const dateEl = document.getElementById('currentDate');
        if (dateEl) {
            dateEl.textContent = date.charAt(0).toUpperCase() + date.slice(1);
        }
    } catch (e) {}

    const idParam = getQueryParam('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;

    if (!id || Number.isNaN(id)) {
        showNotFound('Noticia no encontrada', 'El enlace no contiene un identificador de noticia válido.');
        return;
    }

    currentNewsId = id;

    const news = await getNewsById(id);
    if (!news) {
        showNotFound('Noticia no encontrada', 'Es posible que haya sido eliminada o que el enlace sea incorrecto.');
        return;
    }

    currentNews = news;

    // Incrementar vistas en Supabase (no esperamos la respuesta)
    incrementViews(id).catch(console.error);

    renderNewsDetail(news);
    await renderSidebarBlocks(id);
}

function showNotFound(title, message) {
    const container = document.querySelector('main .container');
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
            <i class="fas fa-newspaper"></i>
            <h3>${title}</h3>
            <p>${message}</p>
        </div>
    `;
}

function renderNewsDetail(news) {
    const imageEl = document.getElementById('detailImage');
    const catEl = document.getElementById('detailCategory');
    const titleEl = document.getElementById('detailTitle');
    const authorEl = document.getElementById('detailAuthor');
    const dateEl = document.getElementById('detailDate');
    const viewsEl = document.getElementById('detailViews');
    const contentEl = document.getElementById('detailContent');

    const imgSrc = news.image_url || 'https://qrwxulufpddqlpwguwfg.supabase.co/storage/v1/object/public/AtlanticoNoticias/Header%20escollera.png';
    if (imageEl) {
        imageEl.src = imgSrc;
        const container = imageEl.parentElement;
        if (container && container.classList.contains('news-card-image')) {
            container.style.backgroundImage = `url('${imgSrc}')`;
        }
    }
    if (imageEl) imageEl.alt = news.title || '';
    if (catEl) catEl.textContent = news.category || '';
    if (titleEl) titleEl.textContent = news.title || '';
    if (authorEl) authorEl.textContent = news.author || '';

    if (dateEl && news.created_at) {
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        dateEl.textContent = new Date(news.created_at).toLocaleDateString('es-ES', options);
    }

    if (viewsEl) viewsEl.textContent = news.views ?? 0;

    if (contentEl) {
        const safeContent = (news.content || '').replace(/\n\n+/g, '</p><p>').replace(/\n/g, '<br>');
        contentEl.innerHTML = `<p>${safeContent}</p>`;
    }
}

async function renderSidebarBlocks(currentId) {
    const all = await getAllNews();
    if (!Array.isArray(all) || all.length === 0) return;

    const popularContainer = document.getElementById('sidebarPopular');
    const latestContainer = document.getElementById('sidebarLatest');

    // Populares por vistas
    if (popularContainer) {
        const popular = [...all]
            .filter(n => n.id !== currentId)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 4);

        if (popular.length === 0) {
            popularContainer.innerHTML = '<p style="color:#718096; font-size:0.9rem;">Sin noticias aún</p>';
        } else {
            let html = '';
            popular.forEach(news => {
                html += `
                    <div class="popular-news-item" onclick="window.location.href='noticia.html?id=${news.id}'">
                        <span class="popular-news-number">${news.views || 0}</span>
                        <div class="popular-news-info">
                            <h4>${(news.title || '').substring(0, 70)}${news.title && news.title.length > 70 ? '…' : ''}</h4>
                            <span><i class="fas fa-calendar"></i> ${formatDateForDetail(news.created_at)}</span>
                        </div>
                    </div>
                `;
            });
            popularContainer.innerHTML = html;
        }
    }

    // Últimas noticias
    if (latestContainer) {
        const latest = [...all]
            .filter(n => n.id !== currentId)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4);

        let html = '';
        latest.forEach(news => {
            html += `
                <div class="popular-news-item" onclick="window.location.href='noticia.html?id=${news.id}'">
                    <div class="popular-news-info">
                        <h4>${(news.title || '').substring(0, 70)}${news.title && news.title.length > 70 ? '…' : ''}</h4>
                        <span><i class="fas fa-calendar"></i> ${formatDateForDetail(news.created_at)}</span>
                    </div>
                </div>
            `;
        });
        latestContainer.innerHTML = html;
    }
}

function formatDateForDetail(dateString) {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

// ===== Compartir =====

function shareOnFacebook() {
    if (!currentNews) return;
    const url = encodeURIComponent(getNewsUrl(currentNewsId));
    const text = encodeURIComponent(currentNews.title || '');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareOnTwitter() {
    if (!currentNews) return;
    const url = encodeURIComponent(getNewsUrl(currentNewsId));
    const text = encodeURIComponent(currentNews.title || '');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'width=600,height=400');
}

function shareOnWhatsApp() {
    if (!currentNews) return;
    const fullUrl = getNewsUrl(currentNewsId);
    const text = encodeURIComponent(`${currentNews.title || ''}\n\n${currentNews.summary || ''}\n\n${fullUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
}

function copyLink() {
    const url = getNewsUrl(currentNewsId);
    navigator.clipboard.writeText(url).then(() => {
        showToast('¡Enlace copiado al portapapeles!', 'success');
    }).catch(() => {
        showToast('No se pudo copiar el enlace', 'error');
    });
}

// Inicializar cuando cargue la página
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initNewsDetail);
}
