# 📰 Portal de Noticias Locales

Portal de noticias moderno y responsive con panel de administración, integrado con Supabase para almacenamiento en la nube y listo para desplegar en Vercel.

## ✨ Características

- 📱 **Diseño responsive** - Se adapta a todos los dispositivos
- 🎨 **Diseño elegante** - Con gradientes modernos y tipografía Playfair Display
- 📝 **Gestión de noticias** - Crear, editar y eliminar noticias
- 🏷️ **Categorías** - Local, Política, Deportes, Cultura, Economía, Sociedad
- ⭐ **Noticias destacadas** - Marca las más importantes
- 📊 **Estadísticas de vistas** - Contador de visualizaciones
- 🔒 **Panel admin protegido** - Con código de acceso
- 📤 **Compartir en redes** - Facebook, Twitter, WhatsApp
- 🖼️ **Subida de imágenes** - A Supabase Storage o por URL
- 🔄 **Base de datos en tiempo real** - Powered by Supabase

## 📁 Estructura del Proyecto

```
Proyecto Noticias/
├── index-new.html          # HTML principal (renombrar a index.html)
├── css/
│   └── styles.css          # Todos los estilos
├── js/
│   ├── config.js           # Configuración (Supabase URL y código admin)
│   ├── supabase-client.js  # Cliente de Supabase
│   ├── auth.js             # Sistema de autenticación
│   └── main.js             # Lógica principal
├── vercel.json             # Configuración de Vercel
├── SUPABASE_SETUP.md       # Instrucciones de configuración de Supabase
├── .gitignore              # Archivos a ignorar en Git
└── README.md               # Este archivo
```

## 🚀 Guía de Instalación

### Paso 1: Configurar Supabase

1. **Crea tu base de datos y storage**
   - Sigue las instrucciones en [SUPABASE_SETUP.md](SUPABASE_SETUP.md)
   - Ejecuta el SQL para crear la tabla `news`
   - Crea el bucket `images` en Storage

2. **Obtén tus credenciales**
   - Ve a Project Settings → API en Supabase
   - Copia tu `Project URL` y `anon/public key`

3. **Configura el proyecto**
   - Abre `js/config.js`
   - Reemplaza `TU_SUPABASE_URL_AQUI` con tu URL
   - Reemplaza `TU_SUPABASE_ANON_KEY_AQUI` con tu anon key
   - Cambia el `ADMIN_CODE` por un código secreto que solo tú conozcas

```javascript
const SUPABASE_CONFIG = {
    url: 'https://tu-proyecto.supabase.co',  // ← Tu URL aquí
    anonKey: 'tu-anon-key-super-larga'       // ← Tu anon key aquí
};

const ADMIN_CODE = 'MiCodigoSecreto123';     // ← Cambia esto
```

### Paso 2: Preparar el proyecto

1. **Renombra el archivo HTML**
   ```bash
   # Renombra index-new.html a index.html
   mv index-new.html index.html
   ```
   O hazlo manualmente en tu explorador de archivos.

### Paso 3: Probar localmente

1. **Abre el proyecto**
   - Simplemente abre `index.html` en tu navegador
   - O usa Live Server en VS Code

2. **Prueba el código de acceso**
   - Haz clic en "Nueva Noticia"
   - Ingresa tu código de acceso
   - Crea tu primera noticia

### Paso 4: Desplegar en Vercel

#### Opción A: Desde la terminal (requiere Git)

```bash
# 1. Inicializa Git si no lo has hecho
git init

# 2. Agrega los archivos
git add .

# 3. Haz tu primer commit
git commit -m "Initial commit - Portal de Noticias"

# 4. Sube a GitHub
# Primero crea un repositorio en GitHub, luego:
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main

# 5. Conecta con Vercel
# Ve a vercel.com, conecta tu repositorio y despliega
```

#### Opción B: Desde la web (más fácil)

1. **Sube tu proyecto a GitHub**
   - Crea un nuevo repositorio en GitHub
   - Sube todos los archivos (puedes usar GitHub Desktop o la web)

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente la configuración
   - Haz clic en "Deploy"

3. **¡Listo!** Tu sitio estará en línea en segundos

## 🔐 Seguridad

### Código de Acceso

El sistema usa un código de acceso simple almacenado en `js/config.js`:

- **Ventajas**: Muy simple, no requiere registro
- **Limitaciones**: El código está en el frontend (cualquiera podría verlo en el código fuente)

**Para mayor seguridad:**
- Considera implementar Supabase Auth con usuarios reales
- O usa Vercel Environment Variables para ocultar el código

### Variables de Entorno en Vercel (Opcional)

Para ocultar el código de acceso:

1. Ve a tu proyecto en Vercel → Settings → Environment Variables
2. Agrega:
   - `VITE_ADMIN_CODE` = tu-codigo-secreto
3. Modifica `js/config.js` para leer desde variables de entorno

## 📝 Uso

### Agregar una noticia

1. Haz clic en **"Nueva Noticia"**
2. Ingresa tu código de acceso
3. Completa el formulario:
   - Título (llamativo)
   - Categoría
   - Autor
   - Resumen (aparece en las tarjetas)
   - Contenido completo
   - Imagen (súbela o pega una URL)
   - Marca como destacada si quieres
4. Haz clic en **"Publicar Noticia"**

### Editar/Eliminar

- En el panel admin, verás todas las noticias publicadas
- Usa los botones "Editar" o el icono de eliminación

### Categorías

Las categorías disponibles son:
- **Local** - Noticias de tu ciudad
- **Política** - Asuntos políticos
- **Deportes** - Eventos deportivos
- **Cultura** - Arte, música, espectáculos
- **Economía** - Negocios y finanzas
- **Sociedad** - Temas sociales

Puedes agregar más en [index.html](index.html#L1171) y en el formulario.

## 🎨 Personalización

### Colores

Edita las variables CSS en `css/styles.css`:

```css
:root {
    --primary-color: #1a1a2e;     /* Color principal */
    --secondary-color: #16213e;   /* Color secundario */
    --accent-color: #e94560;      /* Color de acento */
    --text-color: #333;           /* Color del texto */
    --light-gray: #f5f5f5;        /* Gris claro */
}
```

### Logo y nombre

Edita el HTML en `index.html`:

```html
<a href="#" class="logo">Tu<span>Nombre</span></a>
```

### Footer

Cambia la información de contacto en el footer:

```html
<li><i class="fas fa-map-marker-alt"></i> Tu dirección</li>
<li><i class="fas fa-phone"></i> Tu teléfono</li>
<li><i class="fas fa-envelope"></i> tu@email.com</li>
```

## 🐛 Solución de Problemas

### Las noticias no se cargan

- Verifica que configuraste correctamente Supabase en `js/config.js`
- Abre la consola del navegador (F12) para ver errores
- Verifica que ejecutaste el SQL en Supabase

### No puedo subir imágenes

- Verifica que creaste el bucket `images` en Supabase Storage
- Asegúrate de que el bucket sea público
- Verifica las políticas de acceso del bucket

### El código de acceso no funciona

- Verifica que escribiste correctamente el código en `js/config.js`
- Asegúrate de que `auth.js` se está cargando correctamente
- Revisa la consola del navegador por errores

## 📚 Tecnologías Utilizadas

- **HTML5** - Estructura
- **CSS3** - Estilos con Grid y Flexbox
- **JavaScript (Vanilla)** - Sin frameworks
- **Supabase** - Base de datos PostgreSQL y Storage
- **Vercel** - Hosting y despliegue
- **Font Awesome** - Iconos
- **Google Fonts** - Tipografía Playfair Display

## 📄 Licencia

Este proyecto es de código abierto. Siéntete libre de usarlo y modificarlo como quieras.

## 🤝 Contribuciones

Si encuentras algún bug o tienes sugerencias, ¡abre un issue o pull request!

---

**¡Hecho con ❤️ para tu comunidad local!**
