# 🗄️ Configuración de Supabase

Este archivo contiene las instrucciones para configurar tu base de datos de Supabase.

## 📋 Paso 1: Crear la tabla de noticias

Ve a tu proyecto de Supabase → SQL Editor y ejecuta este código:

```sql
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

-- Política: Todos pueden crear noticias (puedes restringir esto más adelante)
CREATE POLICY "Permitir creación de noticias"
    ON news FOR INSERT
    TO public
    WITH CHECK (true);

-- Política: Todos pueden actualizar noticias (puedes restringir esto más adelante)
CREATE POLICY "Permitir actualización de noticias"
    ON news FOR UPDATE
    TO public
    USING (true);

-- Política: Todos pueden eliminar noticias (puedes restringir esto más adelante)
CREATE POLICY "Permitir eliminación de noticias"
    ON news FOR DELETE
    TO public
    USING (true);
```

## 📁 Paso 2: Configurar Storage para imágenes

1. Ve a **Storage** en tu proyecto de Supabase
2. Crea un nuevo bucket llamado **`images`**
3. Configúralo como **PÚBLICO** (marca la opción "Public bucket")
4. Ve a **Policies** del bucket
5. Habilita las siguientes políticas:

### Política de lectura (SELECT):
```sql
CREATE POLICY "Permitir lectura pública de imágenes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

### Política de carga (INSERT):
```sql
CREATE POLICY "Permitir subir imágenes"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');
```

### Política de eliminación (DELETE):
```sql
CREATE POLICY "Permitir eliminar imágenes"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'images');
```

## 🔑 Paso 3: Obtener las credenciales

1. Ve a **Project Settings** → **API**
2. Copia:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon/public key** (es la clave pública, puedes usarla en el frontend)

3. Pega estos valores en el archivo **`js/config.js`**:

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',  // Tu URL aquí
    anonKey: 'tu-anon-key-aqui'              // Tu anon key aquí
};
```

## ✅ Verificación

Para verificar que todo está configurado correctamente:

1. Ve a **Table Editor** en Supabase
2. Deberías ver la tabla `news` con todas las columnas
3. Ve a **Storage** y verifica que existe el bucket `images`

## 📝 Estructura de la tabla

| Columna      | Tipo      | Descripción                          |
|--------------|-----------|--------------------------------------|
| id           | BIGSERIAL | ID autoincremental (clave primaria)  |
| title        | TEXT      | Título de la noticia                 |
| category     | TEXT      | Categoría (local, deportes, etc)     |
| author       | TEXT      | Nombre del autor                     |
| summary      | TEXT      | Resumen corto                        |
| content      | TEXT      | Contenido completo                   |
| image_url    | TEXT      | URL de la imagen                     |
| featured     | BOOLEAN   | Si es noticia destacada              |
| views        | INTEGER   | Número de visualizaciones            |
| created_at   | TIMESTAMP | Fecha de creación                    |
| updated_at   | TIMESTAMP | Fecha de última actualización        |

## 🔒 Nota de seguridad

Actualmente, las políticas permiten que cualquiera pueda crear, editar y eliminar noticias. Esto es práctico para desarrollo, pero en producción deberías:

1. Implementar autenticación de Supabase Auth
2. Restringir las políticas solo a usuarios autenticados con rol de admin
3. Usar Row Level Security para proteger los datos

Por ahora, la seguridad viene del **código de acceso** en el frontend, que es suficiente para un sitio personal.
