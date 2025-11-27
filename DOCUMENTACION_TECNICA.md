# Documentación Técnica - Atlántico Noticias

## Descripción General
Sitio web de noticias locales para Necochea y Quequén, Buenos Aires, Argentina.
Sistema completo de gestión de noticias con panel administrativo, categorización, clima en tiempo real y diseño profesional estilo periódico digital.

---

## Estructura de Archivos

### HTML Principal
- **index.html** - Página principal del sitio

### CSS
- **css/styles-professional.css** - Hoja de estilos principal (ACTIVA)
- **css/styles.css** - Versión anterior (no en uso)
- **css/styles-premium.css** - Versión alternativa (no en uso)

### JavaScript
- **js/config.js** - Configuración de APIs y credenciales
- **js/supabase-client.js** - Cliente de Supabase
- **js/auth.js** - Sistema de autenticación administrativa
- **js/weather-alternative.js** - Sistema de clima con WeatherAPI.com
- **js/main.js** - Funcionalidad principal del sitio

---

## Configuración (config.js)

### Supabase (Base de Datos)
```javascript
SUPABASE_CONFIG = {
    url: 'https://qrwxulufpddqlpwguwfg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### Código de Administración
```javascript
ADMIN_CODE = 'Cerati123'
```

### Weather API
```javascript
WEATHER_API_KEY = 'b4a0029d8cbd4cb1a16185916252711'
```
- Provider: WeatherAPI.com
- Location: Necochea, Buenos Aires, Argentina
- Forecast: 5 días
- Idioma: Español

---

## Sistema de Estilos (styles-professional.css)

### Variables CSS Principales
```css
--primary-color: #002B49 (azul oscuro marino)
--secondary-color: #003D5C (azul medio)
--accent-color: #FFB81C (amarillo/dorado)
--text-main: #1A202C (texto principal)
--text-muted: #4A5568 (texto secundario)
--font-heading: 'Playfair Display', serif
--font-body: 'Source Sans Pro', sans-serif
```

### Layout Principal
- **Max-width contenedor**: 1280px
- **Padding lateral**: 1.5rem
- **Sistema**: CSS Grid + Flexbox

### Estructura de Navegación
```css
nav {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
}

.nav-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1.5rem;
}

.nav-menu {
    display: flex;
    gap: 2rem;
}
```

**IMPORTANTE**: El `<nav>` está FUERA del `<header>` para que funcione el sticky positioning correctamente.

### Tipografía
```css
/* Títulos de noticias principales */
.news-card-content h3: 1.65rem

/* Título destacado */
.featured-overlay h2: 2.5rem

/* Títulos pequeños destacados */
.featured-small h3: 1.45rem

/* Texto de resumen */
.news-card-content p: 1.1rem

/* Categorías */
.category: 0.9rem
```

### Weather Bar
```css
.weather-bar {
    background: linear-gradient(135deg, #002B49 0%, #004D73 100%);
    color: white;
    padding: 1rem 0;
}

.weather-icon {
    font-size: 3rem; /* Tamaño grande para visibilidad */
}

/* Pronóstico inline - 5 días */
.forecast-days-inline {
    display: flex;
    gap: 1rem;
}

.forecast-day {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    padding: 0.5rem 0.75rem;
}
```

### Breaking News Ticker
```css
.ticker {
    animation: ticker 30s linear infinite;
}

@keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
```

### Responsive Breakpoints
Sistema de diseño responsive completo con 3 breakpoints principales:

- **Desktop**: > 1024px (layout completo)
- **Tablet**: 768px - 1024px (layout adaptado)
- **Tablet pequeño/Móvil grande**: 481px - 768px (layout vertical)
- **Móvil pequeño**: ≤ 480px (layout compacto)

#### Mejoras Responsive Implementadas

**Tablet (≤ 1024px):**
- Grid de noticias: minmax(280px, 1fr)
- Weather bar: spacing reducido
- Padding contenedores: 1.25rem

**Móvil (≤ 768px):**
- Header: max-height 120px
- Navegación: layout vertical, botones centrados
- Weather bar: layout vertical completo
- Pronóstico: grid de 3 columnas
- News grid: 1 columna
- Modales: 95% ancho, max-height 90vh
- Featured: altura reducida (320px main)
- Sidebar: debajo del contenido principal

**Móvil pequeño (≤ 480px):**
- Header: max-height 100px
- Nav links: 0.75rem
- Weather icon: 2rem
- Pronóstico: grid de 2 columnas
- Featured main: 280px altura
- Títulos más pequeños (responsive)
- Botones: padding reducido

#### Optimizaciones Táctiles
```css
/* Feedback táctil */
-webkit-tap-highlight-color: rgba(0, 43, 73, 0.1)
transform: scale(0.98) en :active

/* Desactivar hover en touch */
@media (hover: none) {
    /* Remover transformaciones hover */
}

/* Smooth scrolling */
scroll-behavior: smooth
```

---

## Sistema de Clima (weather-alternative.js)

### API: WeatherAPI.com

#### Endpoint Principal
```javascript
`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Necochea,Buenos Aires,Argentina&days=5&lang=es&aqi=no`
```

#### Datos Obtenidos
- Temperatura actual (°C)
- Sensación térmica (°C)
- Humedad (%)
- Velocidad del viento (km/h)
- Dirección del viento (traducida al español)
- Pronóstico extendido 5 días (max/min temp)

#### Funciones Principales
```javascript
getCurrentWeather()      // Obtiene clima actual
getForecast()            // Obtiene pronóstico 5 días
renderForecast()         // Renderiza pronóstico en HTML
updateWeatherWidget()    // Actualiza todo el widget
getWeatherIcon(code, isDay) // Mapea códigos a emojis
translateWindDirection(dir) // Traduce direcciones de viento
```

#### Mapeo de Iconos del Clima
```javascript
1000: ☀️/🌙 (Despejado)
1003: 🌤️ (Parcialmente nublado)
1006/1009: ☁️ (Nublado)
1030/1135/1147: 🌫️ (Niebla)
1063/1180/1183: 🌦️ (Lluvia ligera)
1186/1189/1192: 🌧️ (Lluvia moderada/fuerte)
1087/1273/1276: ⛈️ (Tormenta)
1066/1210/1213: 🌨️ (Nieve)
```

#### Actualización Automática
- Intervalo: Cada 30 minutos
- Al cargar la página: Inmediato

---

## Base de Datos (Supabase)

### Tabla: noticias

#### Campos Principales
```sql
id: uuid (PK)
title: text (Título de la noticia)
summary: text (Resumen breve)
content: text (Contenido completo)
category: text (local, politica, deportes, cultura, economia, sociedad)
author: text (Nombre del autor)
image_url: text (URL de la imagen)
is_featured: boolean (Noticia destacada)
created_at: timestamp
views: integer (Contador de lecturas)
```

---

## Categorías de Noticias

1. **Todas** - Vista general
2. **Local** - Noticias locales de Necochea/Quequén
3. **Política** - Actualidad política
4. **Deportes** - Eventos deportivos
5. **Cultura** - Cultura y eventos culturales
6. **Economía** - Noticias económicas
7. **Sociedad** - Temas sociales

### Colores por Categoría
```css
.category {
    background: var(--primary-color);
    color: white;
    padding: 0.35rem 0.85rem;
    font-size: 0.9rem;
    text-transform: uppercase;
}
```

---

## Funcionalidades Principales

### 1. Sistema de Noticias
- Crear/Editar/Eliminar noticias (admin)
- Vista de tarjetas (grid)
- Modal de detalle completo
- Contador de vistas
- Sistema de noticias destacadas (featured)

### 2. Autenticación Administrativa
- Código de acceso: 'Cerati123'
- Modal de autenticación
- Protección del panel admin
- Función: `checkAuthAndOpenPanel()`

### 3. Weather Widget
- Clima actual en tiempo real
- Pronóstico 5 días integrado
- Actualización automática cada 30 min
- Iconos emoji según condición climática

### 4. Breaking News Ticker
- Animación continua CSS
- Muestra últimos titulares
- 30 segundos por ciclo completo

### 5. Compartir Noticias
- Facebook
- Twitter
- WhatsApp
- Copiar enlace

---

## HTML: Estructura Importante

### Header y Navigation (CRÍTICO)
```html
<!-- Header (scrollea normalmente) -->
<header>
    <div class="header-banner">
        <img src="imagenes crudas/Header escollera.png">
        <div class="date-display">
            <i class="far fa-calendar-alt"></i>
            <span id="currentDate"></span>
        </div>
    </div>
</header>

<!-- Navigation (SEPARADO, sticky) -->
<nav>
    <div class="container nav-container">
        <ul class="nav-menu">
            <!-- Items de navegación -->
        </ul>
        <div class="header-actions">
            <button class="btn-admin">Nueva Noticia</button>
        </div>
    </div>
</nav>
```

**IMPORTANTE**: El `<nav>` debe estar FUERA del `<header>` para que el sticky funcione.

### Weather Bar Layout
```html
<div class="weather-bar">
    <div class="weather-bar-content">
        <!-- Sección izquierda: Clima actual -->
        <div class="weather-bar-current-section">
            <div class="weather-bar-location">Necochea</div>
            <div class="weather-bar-main">
                <div class="weather-bar-current">
                    <div class="weather-icon">☀️</div>
                    <div class="weather-bar-temp">
                        <span class="weather-temp">24°C</span>
                        <span class="weather-description">...</span>
                    </div>
                </div>
                <div class="weather-bar-details">
                    <!-- Sensación, Humedad, Viento -->
                </div>
            </div>
        </div>

        <!-- Sección derecha: Pronóstico 5 días -->
        <div class="weather-bar-forecast">
            <div class="forecast-days-inline" id="forecastDays">
                <!-- JS inserta días aquí -->
            </div>
        </div>
    </div>
</div>
```

---

## Scripts y Dependencias

### Librerías Externas
```html
<!-- Google Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Source+Sans+Pro:wght@400;600;700&display=swap">

<!-- Font Awesome 6.4.0 -->
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Supabase JS -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Orden de Carga de Scripts (IMPORTANTE)
```html
<script src="js/config.js"></script>
<script src="js/supabase-client.js"></script>
<script src="js/auth.js"></script>
<script src="js/weather-alternative.js"></script>
<script src="js/main.js"></script>
```

---

## Cambios Recientes Aplicados

### ✅ Mejoras Implementadas

1. **Display de fecha en header**
   - Ubicación: Esquina inferior derecha del banner
   - Estilo: Overlay semitransparente con backdrop-filter
   - Actualización: Automática vía JavaScript

2. **Navegación sticky mejorada**
   - Nav separado del header
   - Sticky positioning funcional
   - Botón "Nueva Noticia" alineado a la derecha

3. **Tipografía aumentada**
   - Títulos de noticias: 1.4rem → 1.65rem
   - Títulos destacados: 2.25rem → 2.5rem
   - Texto de resumen: 0.95rem → 1.1rem
   - Categorías: 0.7rem → 0.9rem

4. **Ticker animado**
   - Animación CSS continua
   - Velocidad: 30s por ciclo

5. **Pronóstico extendido integrado**
   - 5 días en la weather bar
   - Layout horizontal compacto
   - Responsive en móviles

6. **WeatherAPI.com implementado**
   - Datos reales de Necochea
   - Actualización cada 30 min
   - API key configurada

7. **Weather icon agrandado**
   - Tamaño: 3rem
   - Mejor visibilidad

8. **Diseño Responsive Completo** ✨
   - 3 breakpoints: 1024px, 768px, 480px
   - Layout vertical en móviles
   - Weather bar adaptativo (3 cols → 2 cols)
   - Navegación stack en móviles
   - Modales fullscreen en móviles
   - Grid de noticias: 1 columna en móviles
   - Tipografía responsive por breakpoint
   - Optimizaciones táctiles:
     - Tap highlight personalizado
     - Feedback :active en botones
     - Desactivar hover en touch devices
     - Smooth scrolling
     - Touch-friendly targets (min 44px)

---

## Consideraciones de Desarrollo

### CSS
- **NO modificar** `styles.css` o `styles-premium.css`
- **USAR SIEMPRE** `styles-professional.css`
- Mantener variables CSS para consistencia
- Todos los tamaños en rem (no px)

### JavaScript
- Actualización de clima: 30 min
- No hardcodear valores, usar CONFIG
- Manejo de errores en API calls
- Console logs informativos

### HTML
- Mantener semántica correcta
- Nav FUERA de header (sticky)
- IDs únicos para JavaScript
- Comentarios claros por sección

### Responsive
- Mobile-first approach
- 3 breakpoints: 1024px (tablet), 768px (móvil), 480px (móvil pequeño)
- Flexbox para layouts flexibles
- Grid para estructuras complejas
- Touch optimizations (@media hover: none)
- Viewport meta tag configurado
- Smooth scrolling habilitado
- Tap highlights personalizados
- Áreas de toque mínimas 44x44px (Apple HIG / Material Design)
- Tipografía escalable por breakpoint

---

## Próximas Mejoras Sugeridas

1. Sistema de comentarios en noticias
2. Búsqueda de noticias
3. Newsletter subscription
4. Modo oscuro
5. Caché de noticias para offline
6. Galería de imágenes en noticias
7. Relacionar noticias similares
8. Sistema de tags adicionales
9. Analytics de lecturas
10. Versión PWA (Progressive Web App)

---

## Comandos y Testing

### Verificar Clima
```javascript
// En console del navegador
getCurrentWeather().then(console.log)
getForecast()
```

### Verificar Supabase
```javascript
// En console del navegador
window.supabase.from('noticias').select('*').limit(5)
```

---

## Soporte y Contacto

- **Ubicación**: Necochea, Buenos Aires, Argentina
- **Zona horaria**: America/Argentina/Buenos_Aires (GMT-3)
- **Idioma**: Español

---

## Notas Finales

- Proyecto completamente funcional y en producción
- Base de código limpia y documentada
- APIs configuradas y testeadas
- Responsive y optimizado
- Ready para deploy

**Última actualización**: 27 de Noviembre, 2024
