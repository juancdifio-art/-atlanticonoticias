-- ========================================
-- CONFIGURACIÓN DE BASE DE DATOS SUPABASE
-- Portal de Noticias
-- ========================================

-- Crear tabla de noticias
CREATE TABLE news (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para mejorar las búsquedas por categoría
CREATE INDEX idx_news_category ON news(category);

-- Crear índice para ordenar por fecha
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- Crear índice para noticias destacadas
CREATE INDEX idx_news_featured ON news(featured) WHERE featured = true;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_news_updated_at
    BEFORE UPDATE ON news
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer noticias
CREATE POLICY "Permitir lectura pública de noticias"
    ON news FOR SELECT
    TO public
    USING (true);

-- Política: Todos pueden crear noticias
CREATE POLICY "Permitir creación de noticias"
    ON news FOR INSERT
    TO public
    WITH CHECK (true);

-- Política: Todos pueden actualizar noticias
CREATE POLICY "Permitir actualización de noticias"
    ON news FOR UPDATE
    TO public
    USING (true);

-- Política: Todos pueden eliminar noticias
CREATE POLICY "Permitir eliminación de noticias"
    ON news FOR DELETE
    TO public
    USING (true);

-- ========================================
-- POLÍTICAS PARA STORAGE (ejecutar después de crear el bucket)
-- ========================================

-- Política de lectura
CREATE POLICY "Permitir lectura pública de imágenes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- Política de carga
CREATE POLICY "Permitir subir imágenes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- Política de eliminación
CREATE POLICY "Permitir eliminar imágenes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');
