// Sistema de clima usando WeatherAPI.com

// Variable global para almacenar datos del clima
let weatherData = null;

// Obtener clima actual y pronóstico de Necochea
async function getCurrentWeather() {
    try {
        const apiKey = window.CONFIG?.weatherApiKey;

        if (!apiKey) {
            throw new Error('API key no configurada');
        }

        // WeatherAPI.com - Pronóstico de 5 días para Necochea, Buenos Aires
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=Necochea,Buenos Aires,Argentina&days=5&lang=es&aqi=no`
        );

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        weatherData = data; // Guardar datos completos para pronóstico extendido

        console.log('✅ Clima real obtenido de Necochea, Buenos Aires (WeatherAPI.com)');

        return {
            temp: Math.round(data.current.temp_c),
            description: data.current.condition.text,
            icon: getWeatherIcon(data.current.condition.code, data.current.is_day),
            feelsLike: Math.round(data.current.feelslike_c),
            humidity: data.current.humidity,
            windSpeed: Math.round(data.current.wind_kph),
            windDir: translateWindDirection(data.current.wind_dir),
            isReal: true
        };
    } catch (error) {
        console.error('❌ Error al obtener clima de WeatherAPI:', error.message);
        console.log('💡 Verifica tu API key en config.js');
        return null;
    }
}

// Obtener pronóstico extendido de 5 días
function getForecast() {
    if (!weatherData || !weatherData.forecast || !weatherData.forecast.forecastday) {
        return [];
    }

    const forecast = [];
    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    weatherData.forecast.forecastday.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Hoy' : daysOfWeek[date.getDay()];

        forecast.push({
            day: dayName,
            date: day.date,
            maxTemp: Math.round(day.day.maxtemp_c),
            minTemp: Math.round(day.day.mintemp_c),
            icon: getWeatherIcon(day.day.condition.code, 1), // Usar ícono de día
            description: day.day.condition.text
        });
    });

    return forecast;
}

// Traducir dirección del viento al español
function translateWindDirection(direction) {
    const translations = {
        'N': 'N',
        'NNE': 'NNE',
        'NE': 'NE',
        'ENE': 'ENE',
        'E': 'E',
        'ESE': 'ESE',
        'SE': 'SE',
        'SSE': 'SSE',
        'S': 'S',
        'SSW': 'SSO',
        'SW': 'SO',
        'WSW': 'OSO',
        'W': 'O',
        'WNW': 'ONO',
        'NW': 'NO',
        'NNW': 'NNO'
    };
    return translations[direction] || direction;
}

// Obtener ícono según código de WeatherAPI.com
function getWeatherIcon(code, isDay) {
    // Códigos de WeatherAPI.com
    // https://www.weatherapi.com/docs/weather_conditions.json

    // Soleado/Despejado
    if (code === 1000) return isDay ? '☀️' : '🌙';

    // Parcialmente nublado
    if (code === 1003) return isDay ? '🌤️' : '🌙';

    // Nublado
    if (code === 1006) return '☁️';

    // Muy nublado
    if (code === 1009) return '☁️';

    // Niebla
    if ([1030, 1135, 1147].includes(code)) return '🌫️';

    // Lluvia ligera
    if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1240].includes(code)) return '🌦️';

    // Lluvia moderada/fuerte
    if ([1186, 1189, 1192, 1195, 1243, 1246].includes(code)) return '🌧️';

    // Tormenta
    if ([1087, 1273, 1276, 1279, 1282].includes(code)) return '⛈️';

    // Nieve
    if ([1066, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return '🌨️';

    // Aguanieve
    if ([1069, 1072, 1198, 1201, 1204, 1207, 1237, 1249, 1252, 1261, 1264].includes(code)) return '🌨️';

    return '🌡️'; // Default
}

// Renderizar pronóstico extendido
function renderForecast() {
    const forecastContainer = document.getElementById('forecastDays');
    if (!forecastContainer) return;

    const forecast = getForecast();

    if (forecast.length === 0) {
        forecastContainer.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7); font-size: 0.85rem;">Cargando pronóstico...</p>';
        return;
    }

    let html = '';
    forecast.forEach(day => {
        html += `
            <div class="forecast-day">
                <div class="forecast-day-name">${day.day}</div>
                <div class="forecast-icon">${day.icon}</div>
                <div class="forecast-temps">
                    <span class="forecast-max">${day.maxTemp}°</span>
                    <span class="forecast-min">${day.minTemp}°</span>
                </div>
                <div class="forecast-description">${day.description}</div>
            </div>
        `;
    });

    forecastContainer.innerHTML = html;
}

// Actualizar widget de clima
async function updateWeatherWidget() {
    const weather = await getCurrentWeather();

    if (!weather) {
        console.log('No se pudo obtener el clima');
        // Mostrar mensaje de error
        const weatherDescription = document.querySelector('.weather-description');
        if (weatherDescription) {
            weatherDescription.textContent = 'Error al cargar clima';
        }
        return;
    }

    // Actualizar elementos del DOM
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherTemp = document.querySelector('.weather-temp');
    const weatherDescription = document.querySelector('.weather-description');
    const weatherFeels = document.querySelector('.weather-feels');
    const weatherHumidity = document.querySelector('.weather-humidity');
    const weatherWind = document.querySelector('.weather-wind');
    const weatherWindDir = document.querySelector('.weather-wind-dir');
    const weatherLocation = document.querySelector('.weather-location');

    if (weatherIcon) weatherIcon.textContent = weather.icon;
    if (weatherTemp) weatherTemp.textContent = `${weather.temp}°C`;
    if (weatherDescription) weatherDescription.textContent = weather.description;
    if (weatherFeels) weatherFeels.textContent = `${weather.feelsLike}°C`;
    if (weatherHumidity) weatherHumidity.textContent = `${weather.humidity}%`;
    if (weatherWind) weatherWind.textContent = `${weather.windSpeed} km/h`;
    if (weatherWindDir) weatherWindDir.textContent = `(${weather.windDir})`;
    if (weatherLocation) weatherLocation.textContent = 'Necochea, BA';

    // Renderizar pronóstico extendido
    renderForecast();
}

// Inicializar clima cuando cargue la página
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        // Actualizar clima al cargar
        updateWeatherWidget();

        // Actualizar cada 30 minutos
        setInterval(updateWeatherWidget, 30 * 60 * 1000);
    });
}
