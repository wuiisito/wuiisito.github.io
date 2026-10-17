# 🌟 wuiisito.github.io — Portafolio Personal & Perfil de GitHub

Página de perfil moderna, estética y ultra rápida diseñada especialmente para **wuiisito** (`https://wuiisito.github.io`).

Incluye soporte para destacar tus proyectos más importantes (Sabrina Carpenter Vinyl App, KawaiPals Fabric Mod, Polaroid Lockscreen, Sokoromi, DualPlay, etc.), filtrado por categorías, buscador instantáneo en vivo, integración con la API de GitHub y un **Gestor Visual de Proyectos** incorporado para que elijas exactamente qué se muestra sin complicaciones.

---

## 🚀 ¿Cómo publicar esta página en tu GitHub Pages?

Tienes dos formas sencillas de subirla a tu repositorio `wuiisito/wuiisito.github.io`:

### Opción A: Usando Git (Recomendado por terminal)

Desde esta carpeta:
```bash
# 1. Agrega el remoto de tu repositorio de GitHub Pages (si no lo tienes aún):
git remote add origin https://github.com/wuiisito/wuiisito.github.io.git

# 2. Agrega todos los archivos nuevos:
git add .

# 3. Haz commit:
git commit -m "feat: nuevo portafolio moderno y personalizable"

# 4. Sube los cambios a la rama principal (main):
git branch -M main
git push -u origin main --force
```

### Opción B: Directo desde la web de GitHub

1. Entra a tu repositorio: [https://github.com/wuiisito/wuiisito.github.io](https://github.com/wuiisito/wuiisito.github.io)
2. Haz clic en **"Add file" > "Upload files"**.
3. Arrastra los archivos:
   - `index.html`
   - `styles.css`
   - `config.js`
   - `app.js`
   - `README.md`
4. Haz clic en **"Commit changes"**.
5. ¡Listo! En 1 o 2 minutos tu web estará activa en [https://wuiisito.github.io](https://wuiisito.github.io).

---

## 🛠️ ¿Cómo modificar qué proyectos se muestran a tu gusto?

Tienes **dos formas súper fáciles**:

### Método 1: Desde la propia página web (¡El más rápido!)
1. Abre tu página en el navegador (o en local abriendo `index.html`).
2. Haz clic en el botón superior **"⚙️ Personalizar"** (o en "Editar Proyectos" en el Hero).
3. Se abrirá una ventana donde verás todos tus proyectos:
   - Marca o desmarca **"Mostrar"** para decidir si aparece o se oculta.
   - Marca o desmarca **"⭐ Destacar"** para que aparezca en grande en la sección superior de proyectos destacados.
   - Haz clic en **"Sincronizar repos con GitHub"** si acabas de crear un nuevo repo y quieres importarlo con 1 clic.
4. Cuando te guste cómo quedó, haz clic en **"Copiar código de config.js"**.
5. Pega ese código en tu archivo `config.js` y sube el commit. ¡Listo!

### Método 2: Editando directamente el archivo `config.js`
Abre `config.js` en tu editor de código favorito. Cada proyecto tiene esta estructura muy clara:

```javascript
{
  id: "sabrina-vinyl",
  title: "Sabrina Carpenter Vinyl Web App",
  description: "Reproductor web interactivo inspirado en tocadiscos de vinilo clásico.",
  tags: ["JavaScript", "Web Audio API", "Interactive UI"],
  category: "web", // Opciones: "web", "mods", "bots", "mobile", "tools"
  repo: "https://github.com/wuiisito/Sabrina-Carpenter-Vinyl-Web-App",
  demo: "https://wuiisito.github.io/Sabrina-Carpenter-Vinyl-Web-App",
  pinned: true,      // 👈 true = Se muestra en la web | false = Se oculta
  featured: true,    // 👈 true = Sale arriba en Proyectos Destacados
  icon: "disc",      // Icono visual (disc, gamepad-2, camera, bot, zap, etc.)
  badge: "⭐ Destacado" // Etiqueta opcional
}
```

Para **ocultar un proyecto**, simplemente cambia `pinned: false`.
Para **destacarlo arriba**, pon `featured: true`.

---

## 🎨 Características Incluidas

- **Diseño Aesthetic & Moderno**: Tema oscuro con acentos violeta, cian y rosa vinilo, bordes con sutil iluminación y desenfoques tipo glassmorphism.
- **Widget Interactivo de Vinilo**: Mini tocadiscos interactivo en el Hero en homenaje a tu proyecto `Sabrina Carpenter Vinyl Web App`, con brazo giratorio, disco interactivo y ondas de audio sintetizadas mediante la Web Audio API.
- **Filtros por Categoría**: Explora por Web, Mods de Minecraft, Bots de Discord, Mobile o Herramientas.
- **Buscador en tiempo real**: Encuentra proyectos al instante escribiendo cualquier palabra clave o tecnología.
- **Estadísticas de GitHub en vivo**: Conexión con la API de GitHub para mostrar repositorios públicos y seguidores actualizados automáticamente.
- **100% Responsivo**: Se adapta fluidamente a teléfonos móviles, tablets y monitores de alta resolución.
- **Cero dependencias pesadas**: Sin Node, sin npm, sin builds. Funciona directamente con vanilla HTML5, CSS3 y JavaScript moderno para una carga instantánea.
