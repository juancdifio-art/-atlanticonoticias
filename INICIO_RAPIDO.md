# 🚀 Inicio Rápido - 5 minutos

Sigue estos pasos para tener tu portal de noticias funcionando en minutos.

## ✅ Checklist Rápida

### 1. Configurar Supabase (3 min)

**a) Crear la tabla**
- Ve a [Supabase SQL Editor](https://app.supabase.com/project/_/sql)
- Copia y pega todo el SQL de [SUPABASE_SETUP.md](SUPABASE_SETUP.md#paso-1-crear-la-tabla-de-noticias)
- Haz clic en **Run**

**b) Crear bucket de imágenes**
- Ve a [Storage](https://app.supabase.com/project/_/storage/buckets)
- Clic en **New bucket**
- Nombre: `images`
- ✅ Marca como **Public**
- Crea las políticas del archivo SUPABASE_SETUP.md

**c) Copiar credenciales**
- Ve a [Settings → API](https://app.supabase.com/project/_/settings/api)
- Copia:
  - `Project URL`
  - `anon public key`

### 2. Configurar el proyecto (1 min)

**a) Edita `js/config.js`**
```javascript
const SUPABASE_CONFIG = {
    url: 'PEGA_TU_URL_AQUÍ',
    anonKey: 'PEGA_TU_KEY_AQUÍ'
};

const ADMIN_CODE = 'ELIGE_UN_CODIGO_SECRETO';
```

**b) Renombra el archivo**
- Renombra `index-new.html` → `index.html`

### 3. Probar localmente (1 min)

- Abre `index.html` en tu navegador
- Haz clic en **"Nueva Noticia"**
- Ingresa tu código de acceso
- ¡Crea tu primera noticia!

## 🌐 Desplegar en Vercel

### Opción fácil (Web UI):

1. **Sube a GitHub**
   - Crea un repo en GitHub
   - Arrastra y suelta todos los archivos

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - New Project → Import tu repo
   - Deploy

¡Listo! Tu sitio estará en `tu-proyecto.vercel.app`

## ⚡ Comandos útiles

```bash
# Si usas Git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

## 🆘 ¿Problemas?

- **No se cargan noticias**: Revisa la consola (F12) para ver errores
- **Código no funciona**: Verifica que esté bien escrito en `config.js`
- **Imágenes no suben**: Verifica que el bucket `images` sea público

## 📖 Más información

- Ver [README.md](README.md) para documentación completa
- Ver [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para detalles de la BD

---

**¡En 5 minutos tendrás tu portal funcionando!** 🎉
