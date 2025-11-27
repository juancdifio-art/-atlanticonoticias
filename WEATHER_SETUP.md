# 🌤️ Configuración del Clima en Tiempo Real

El widget de clima está integrado con **OpenWeatherMap** para mostrar el clima actual de Necochea, Argentina.

## 🔑 Obtener API Key de OpenWeatherMap (GRATIS)

### Paso 1: Crear cuenta

1. Ve a [https://openweathermap.org/api](https://openweathermap.org/api)
2. Haz clic en **"Get API Key"** o **"Sign Up"**
3. Completa el registro (gratis)
4. Verifica tu email

### Paso 2: Obtener la API Key

1. Inicia sesión en [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)
2. Verás tu **Default API Key** (algo como: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)
3. Cópiala

### Paso 3: Configurar en el proyecto

1. Abre el archivo `js/weather.js`
2. Busca la línea:
   ```javascript
   const WEATHER_API_KEY = 'TU_API_KEY_AQUI';
   ```
3. Reemplázala con tu API Key:
   ```javascript
   const WEATHER_API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';
   ```
4. Guarda el archivo

### Paso 4: Probar

1. Recarga tu página
2. El widget de clima debería mostrar el clima real de Necochea

---

## 🌍 Cambiar la ubicación

Si quieres mostrar el clima de otra ciudad, edita `js/weather.js`:

```javascript
// Coordenadas de tu ciudad
const NECOCHEA_COORDS = {
    lat: -38.5545,  // Latitud
    lon: -58.7395,  // Longitud
    city: 'Necochea' // Nombre a mostrar
};
```

**Para encontrar coordenadas:**
1. Ve a [https://www.latlong.net/](https://www.latlong.net/)
2. Busca tu ciudad
3. Copia lat y lon

---

## 📊 Límites del plan gratuito

- ✅ **1,000 llamadas/día** (más que suficiente)
- ✅ Actualización cada 10 minutos
- ✅ Datos en tiempo real
- ✅ Sin costo

---

## 🔧 Características implementadas

- 🌡️ Temperatura actual
- ☀️ Ícono según condición climática
- 📍 Nombre de la ciudad
- 🔄 Actualización automática cada 10 minutos
- 🌍 Datos en español

---

## 🆘 Solución de problemas

### El clima no se actualiza

1. **Verifica la API Key** en `js/weather.js`
2. **Abre la consola** (F12) y busca errores
3. **Espera unos minutos** - Las API keys nuevas tardan ~10 minutos en activarse

### Muestra clima estático

- Significa que la API Key aún no está configurada
- Revisa que la reemplazaste correctamente en `weather.js`

### Error 401 Unauthorized

- Tu API Key es incorrecta o no está activada
- Verifica en [https://home.openweathermap.org/api_keys](https://home.openweathermap.org/api_keys)

---

## 🎨 Personalización

El widget se encuentra en el HTML en esta sección:

```html
<div class="sidebar-widget weather-widget">
    <h3><i class="fas fa-cloud-sun"></i> El Tiempo</h3>
    <div class="weather-icon">☀️</div>
    <div class="weather-temp">24°C</div>
    <div class="weather-location">Tu Ciudad</div>
</div>
```

Los estilos están en `css/styles.css` bajo `.weather-widget`
