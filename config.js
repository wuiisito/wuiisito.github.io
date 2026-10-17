/**
 * ====================================================================
 *  CONFIGURACIÓN DE TU PERFIL Y PORTAFOLIO GITHUB (wuiisito.github.io)
 * ====================================================================
 * 
 * ¡Hola wuiisito! Aquí puedes modificar fácilmente todo lo que se muestra
 * en tu página web sin necesidad de tocar código HTML ni CSS.
 * 
 * - Puedes cambiar tus datos personales (nombre, bio, redes).
 * - Puedes activar o desactivar proyectos con `pinned: true/false`.
 * - Puedes poner un proyecto en grande arriba con `featured: true/false`.
 * - Puedes cambiar títulos, descripciones, etiquetas o enlaces a demos.
 * - ¡También puedes usar el botón "⚙️ Personalizar" directamente en tu web!
 */

const USER_CONFIG = {
  // --- INFORMACIÓN PERSONAL ---
  profile: {
    name: "fabb",
    username: "wuiisito",
    tagline: "Developer & Creator",
    bio: "Hi! 🙉 Sabrina's megafan. Apasionado por crear aplicaciones interactivas, mods para juegos, bots y herramientas útiles.",
    avatar: "https://avatars.githubusercontent.com/u/69556083?v=4",
    location: "Online",
    statusText: "Creando cosas geniales 🚀",
    availableForHire: true, // Muestra insignia de disponibilidad
    github: "https://github.com/wuiisito",
    
    // Enlaces a tus redes o contacto (deja en blanco "" los que no uses)
    socials: {
      github: "https://github.com/wuiisito",
      discord: "https://discord.com/users/69556083",
      email: "",
      twitter: "",
      spotify: "" // Si quieres enlazar tu perfil de música
    }
  },

  // --- OPCIONES GENERALES DE LA PÁGINA ---
  settings: {
    showGithubStats: true,      // Muestra contadores en vivo desde la API de GitHub
    enableVinylWidget: true,    // Pequeño reproductor de vinilo interactivo temático
    enableLiveCustomizer: true, // Botón para modificar proyectos directamente en el navegador
    defaultFilter: "all"        // Filtro inicial: "all", "featured", "web", "mods", "bots", "tools"
  },

  // --- TUS PROYECTOS ---
  // Modifica, añade o elimina proyectos a tu gusto.
  // • pinned: true  -> Se muestra en la página (false para ocultarlo)
  // • featured: true -> Se resalta en la sección destacada principal
  // • category: "web" | "mods" | "bots" | "mobile" | "tools"
  projects: [
    {
      id: "sabrina-vinyl",
      title: "Sabrina Carpenter Vinyl Web App",
      description: "Reproductor web interactivo inspirado en tocadiscos de vinilo clásico con estética cuidada, animación giratoria e interacción musical.",
      tags: ["JavaScript", "Web Audio API", "Interactive UI", "CSS Animation"],
      category: "web",
      repo: "https://github.com/wuiisito/Sabrina-Carpenter-Vinyl-Web-App",
      demo: "https://wuiisito.github.io/Sabrina-Carpenter-Vinyl-Web-App",
      pinned: true,
      featured: true,
      icon: "disc",
      badge: "⭐ Destacado"
    },
    {
      id: "kawaipals",
      title: "KawaiPals Fabric Mod",
      description: "Mod Fabric para Minecraft 26.2. Añade adorables espíritus de slime coleccionables como compañeros inspirados en Fortnite con mecánicas personalizadas.",
      tags: ["Java", "Minecraft Fabric", "Modding", "Gaming"],
      category: "mods",
      repo: "https://github.com/wuiisito/kawaipals",
      demo: "",
      pinned: true,
      featured: true,
      icon: "gamepad-2",
      badge: "🎮 Mod Minecraft"
    },
    {
      id: "polaroid-lockscreen",
      title: "Polaroid Lockscreen",
      description: "Pantalla de bloqueo y widgets estilizados con estética de fotografía instantánea tipo Polaroid, personalización visual y efectos nostálgicos.",
      tags: ["Dart", "Flutter", "Mobile UI", "Custom Widgets"],
      category: "mobile",
      repo: "https://github.com/wuiisito/polaroid-lockscreen",
      demo: "",
      pinned: true,
      featured: true,
      icon: "camera",
      badge: "📸 Mobile App"
    },
    {
      id: "dualplay",
      title: "DualPlay",
      description: "Aplicación moderna desarrollada en TypeScript pensada para control y sincronización de reproducción multimedia simultánea.",
      tags: ["TypeScript", "Web App", "Multimedia", "Fullstack"],
      category: "web",
      repo: "https://github.com/wuiisito/dualplay",
      demo: "",
      pinned: true,
      featured: true,
      icon: "play-circle",
      badge: "⚡ TypeScript"
    },
    {
      id: "sokoromi",
      title: "Sokoromi Discord Bot",
      description: "Bot interactivo y tierno para Discord basado en los desafiantes puzzles clásicos de Sokoban, con interfaz visual en mensajes y sistema de niveles.",
      tags: ["Python", "Discord API", "Game Bot", "Algorithms"],
      category: "bots",
      repo: "https://github.com/wuiisito/Sokoromi",
      demo: "https://exeptionhandler.github.io/Sokoromi/",
      pinned: true,
      featured: true,
      icon: "bot",
      badge: "🤖 Discord Bot"
    },
    {
      id: "speedhack-chrome",
      title: "HTML5 Universal Speedhack Extension",
      description: "Extensión para Google Chrome que permite manipular y acelerar con precisión la tasa de refresco y velocidad en juegos y vídeos basados en HTML5 Canvas.",
      tags: ["JavaScript", "Chrome Extension", "HTML5 Canvas", "Reverse Eng"],
      category: "tools",
      repo: "https://github.com/wuiisito/html5-universal-speedhack-extension-chrome",
      demo: "",
      pinned: true,
      featured: false,
      icon: "zap",
      badge: "Chrome Tool"
    },
    {
      id: "file-converter",
      title: "File Converter Web Tool",
      description: "Conversor de archivos rápido y ligero que procesa transformaciones directamente desde el navegador de forma segura.",
      tags: ["JavaScript", "Web Tool", "File API"],
      category: "tools",
      repo: "https://github.com/wuiisito/file-converter",
      demo: "",
      pinned: true,
      featured: false,
      icon: "repeat",
      badge: "Utility"
    },
    {
      id: "simulador-perpetua",
      title: "Simulador Máquina Perpetua",
      description: "Simulador interactivo basado en física y leyes de conservación de energía que recrea modelos hipotéticos de movimiento perpetuo.",
      tags: ["JavaScript", "Physics Simulation", "Canvas", "Math"],
      category: "web",
      repo: "https://github.com/wuiisito/simulador-maquina-perpetua",
      demo: "",
      pinned: true,
      featured: false,
      icon: "atom",
      badge: "Simulador"
    },
    {
      id: "sokobot-exp",
      title: "SokoBot Experimental",
      description: "Motor experimental en Java para generación y resolución automática de laberintos y niveles para Sokoban.",
      tags: ["Java", "AI Search", "A* Pathfinding", "Algorithms"],
      category: "bots",
      repo: "https://github.com/wuiisito/sokobot-exp",
      demo: "",
      pinned: true,
      featured: false,
      icon: "cpu",
      badge: "Java / AI"
    },
    {
      id: "goindex-theme",
      title: "GoIndex Directory Indexer",
      description: "Explorador e indexador visual optimizado utilizando Cloudflare Workers y la API de Google Drive para navegación fluida de archivos en la nube.",
      tags: ["Cloudflare Workers", "Google Drive API", "Serverless"],
      category: "tools",
      repo: "https://github.com/wuiisito/goindex-theme-acrou",
      demo: "https://chill.aicirou.workers.dev/",
      pinned: true,
      featured: false,
      icon: "cloud",
      badge: "Cloudflare"
    },
    {
      id: "wa-stickers",
      title: "WA Stickers Pack & Generator",
      description: "Colección y suite de stickers personalizados de alta resolución listos para WhatsApp con integración móvil.",
      tags: ["Graphics", "Mobile", "WhatsApp API"],
      category: "mobile",
      repo: "https://github.com/wuiisito/wa-stickers",
      demo: "",
      pinned: false, // Desactivado por defecto, puedes ponerlo en true si deseas mostrarlo
      featured: false,
      icon: "smile",
      badge: "WhatsApp"
    }
  ],

  // --- HABILIDADES / TECNOLOGÍAS ---
  skills: [
    { name: "JavaScript", icon: "code", level: "Avanzado" },
    { name: "TypeScript", icon: "code-2", level: "Intermedio" },
    { name: "Python", icon: "terminal", level: "Avanzado" },
    { name: "Java", icon: "coffee", level: "Avanzado" },
    { name: "Dart / Flutter", icon: "smartphone", level: "Intermedio" },
    { name: "HTML5 & Modern CSS", icon: "layout", level: "Avanzado" },
    { name: "Discord API", icon: "bot", level: "Avanzado" },
    { name: "Minecraft Fabric", icon: "box", level: "Intermedio" },
    { name: "Cloudflare Workers", icon: "cloud-lightning", level: "Intermedio" },
    { name: "Git & GitHub", icon: "git-branch", level: "Avanzado" }
  ]
};

// Exportar globalmente para el navegador
if (typeof window !== "undefined") {
  window.USER_CONFIG = USER_CONFIG;
}
