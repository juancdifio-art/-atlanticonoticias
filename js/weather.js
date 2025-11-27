// Sistema de clima en tiempo real

// API Key de OpenWeatherMap (reemplaza con tu propia key)
// Obtén una gratis en: https://openweathermap.org/api
const WEATHER_API_KEY = 'b7a064e271f22a03fbcad544ca219022';

// Coordenadas de Necochea, Argentina
const NECOCHEA_COORDS = {
    lat: -38.5545,
    lon: -58.7395,
    city: 'Necochea'
};

// Obtener clima actual
async function getCurrentWeather() {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${NECOCHEA_COORDS.lat}&lon=${NECOCHEA_COORDS.lon}&units=metric&lang=es&appid=${WEATHER_API_KEY}`
        );

        if (!response.ok) {
            throw new Error('Error al obtener clima');
        }

        const data = await response.json();
        return {
            temp: Math.round(data.main.temp),
            description: data.weather[0].description,
            icon: getWeatherIcon(data.weather[0].id),
            feelsLike: Math.round(data.main.feels_like),
            humidity: data.main.humidity,
            windSpeed: Math.round(data.wind.speed * 3.6) // Convertir m/s a km/h
        };
    } catch (error) {
        console.error('Error al obtener clima:', error);
        return null;
    }
}

// Obtener ícono según código de clima
function getWeatherIcon(weatherCode) {
    // Códigos de OpenWeatherMap
    if (weatherCode >= 200 && weatherCode < 300) return '⛈️'; // Tormenta
    if (weatherCode >= 300 && weatherCode < 400) return '🌧️'; // Llovizna
    if (weatherCode >= 500 && weatherCode < 600) return '🌧️'; // Lluvia
    if (weatherCode >= 600 && weatherCode < 700) return '❄️'; // Nieve
    if (weatherCode >= 700 && weatherCode < 800) return '🌫️'; // Atmósfera
    if (weatherCode === 800) return '☀️'; // Despejado
    if (weatherCode === 801) return '🌤️'; // Pocas nubes
    if (weatherCode === 802) return '⛅'; // Nubes dispersas
    if (weatherCode >= 803) return '☁️'; // Nublado
    return '🌡️';
}

// Actualizar widget de clima
async function updateWeatherWidget() {
    const weather = await getCurrentWeather();

    if (!weather) {
        console.log('No se pudo obtener el clima');
        return;
    }

    // Actualizar elementos del DOM
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherLocation = document.querySelector('.weather-location');

    if (weatherIcon) weatherIcon.textContent = weather.icon;
    if (weatherTemp) weatherTemp.textContent = `${weather.temp}°C`;
    if (weatherLocation) weatherLocation.textContent = NECOCHEA_COORDS.city;
}

// Inicializar clima cuando cargue la página
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Actualizar clima al cargar
        updateWeatherWidget();

        // Actualizar cada 10 minutos
        setInterval(updateWeatherWidget, 10 * 60 * 1000);
    });
}
