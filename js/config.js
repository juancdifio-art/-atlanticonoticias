// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Supabase

const SUPABASE_CONFIG = {
    url: 'https://qrwxulufpddqlpwguwfg.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyd3h1bHVmcGRkcWxwd2d1d2ZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODU5OTksImV4cCI6MjA3OTc2MTk5OX0.rHtcc1qyv75S7lL-DttoV8xZQbxghR2cJOi_WsfCwxA'
};

const CLOUDINARY_CONFIG = {
    cloudName: 'dunalrgh1',
    uploadPreset: 'NoticiasAtlantico'
};

// Código de acceso para el panel de administración
// CAMBIA ESTE CÓDIGO por uno secreto que solo tú conozcas
const ADMIN_CODE = 'Cerati123';

// API Key de WeatherAPI.com
const WEATHER_API_KEY = 'b4a0029d8cbd4cb1a16185916252711';

// Exportar configuración
window.CONFIG = {
    supabase: SUPABASE_CONFIG,
    adminCode: ADMIN_CODE,
    weatherApiKey: WEATHER_API_KEY,
    cloudinary: CLOUDINARY_CONFIG
};