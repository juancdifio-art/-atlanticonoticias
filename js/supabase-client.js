// Cliente de Supabase para manejar todas las operaciones de base de datos

let supabase;

// Inicializar cliente de Supabase
function initSupabase() {
    const { url, anonKey } = window.CONFIG.supabase;
    supabase = window.supabase.createClient(url, anonKey);
    console.log('✅ Supabase inicializado correctamente');
}

// ========== FUNCIONES PARA NOTICIAS ==========

// Obtener todas las noticias
async function getAllNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        showToast('Error al cargar las noticias', 'error');
        return [];
    }
}

// Obtener noticias por categoría
async function getNewsByCategory(category) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error al obtener noticias por categoría:', error);
        return [];
    }
}

// Obtener una noticia por ID
async function getNewsById(id) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        return null;
    }
}

// Crear una nueva noticia
async function createNews(newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .insert([{
                title: newsData.title,
                category: newsData.category,
                author: newsData.author,
                summary: newsData.summary,
                content: newsData.content,
                image_url: newsData.image,
                featured: newsData.featured || false,
                views: 0
            }])
            .select();

        if (error) throw error;
        showToast('Noticia publicada correctamente', 'success');
        return data[0];
    } catch (error) {
        console.error('Error al crear noticia:', error);
        showToast('Error al publicar la noticia', 'error');
        return null;
    }
}

// Actualizar una noticia existente
async function updateNews(id, newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .update({
                title: newsData.title,
                category: newsData.category,
                author: newsData.author,
                summary: newsData.summary,
                content: newsData.content,
                image_url: newsData.image,
                featured: newsData.featured || false
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        showToast('Noticia actualizada correctamente', 'success');
        return data[0];
    } catch (error) {
        console.error('Error al actualizar noticia:', error);
        showToast('Error al actualizar la noticia', 'error');
        return null;
    }
}

// Eliminar una noticia
async function deleteNews(id) {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);

        if (error) throw error;
        showToast('Noticia eliminada', 'success');
        return true;
    } catch (error) {
        console.error('Error al eliminar noticia:', error);
        showToast('Error al eliminar la noticia', 'error');
        return false;
    }
}

// Eliminar todas las noticias (uso administrativo)
async function deleteAllNews() {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .neq('id', 0); // condición trivial para cumplir con la API

        if (error) throw error;
        showToast('Todas las noticias fueron eliminadas', 'success');
        return true;
    } catch (error) {
        console.error('Error al eliminar todas las noticias:', error);
        showToast('Error al eliminar todas las noticias', 'error');
        return false;
    }
}

// Incrementar vistas de una noticia
async function incrementViews(id) {
    try {
        // Primero obtenemos las vistas actuales
        const { data: news } = await supabase
            .from('news')
            .select('views')
            .eq('id', id)
            .single();

        if (!news) return;

        // Incrementamos las vistas
        const { error } = await supabase
            .from('news')
            .update({ views: (news.views || 0) + 1 })
            .eq('id', id);

        if (error) throw error;
    } catch (error) {
        console.error('Error al incrementar vistas:', error);
    }
}

// ========== FUNCIONES PARA STORAGE (IMÁGENES) ==========

// Subir imagen a Supabase Storage
async function uploadImage(file) {
    try {
        const cfg = window.CONFIG && window.CONFIG.cloudinary ? window.CONFIG.cloudinary : null;
        if (!cfg || !cfg.cloudName || !cfg.uploadPreset) {
            console.error('Cloudinary no está configurado correctamente');
            showToast('Error de configuración de imágenes', 'error');
            return null;
        }

        console.log('🌥️ Subiendo imagen a Cloudinary...', {
            cloudName: cfg.cloudName,
            uploadPreset: cfg.uploadPreset,
            fileName: file && file.name
        });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cfg.uploadPreset);

        const endpoint = `https://api.cloudinary.com/v1_1/${cfg.cloudName}/image/upload`;
        const response = await fetch(endpoint, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error al subir imagen a Cloudinary:', errorText);
            showToast('Error al subir la imagen', 'error');
            return null;
        }

        const data = await response.json();
        const url = data.secure_url || data.url || null;
        if (!url) {
            console.error('Cloudinary no devolvió una URL válida', data);
            showToast('Error al subir la imagen', 'error');
            return null;
        }

        console.log('✅ Imagen subida a Cloudinary. URL usada en la noticia:', url);
        return url;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        showToast('Error al subir la imagen', 'error');
        return null;
    }
}

// Eliminar imagen del storage
async function deleteImage(imageUrl) {
    try {
        // Extraer el path de la URL
        const urlParts = imageUrl.split('/');
        const filePath = `news-images/${urlParts[urlParts.length - 1]}`;

        const { error } = await supabase.storage
            .from('images')
            .remove([filePath]);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        return false;
    }
}