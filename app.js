/**
 * ====================================================================
 *  LÓGICA PRINCIPAL DEL PORTAFOLIO: wuiisito.github.io
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Estado global y carga de configuración
  let activeConfig = loadWorkingConfig();
  let currentCategory = "all";
  let searchQuery = "";

  // 2. Inicialización
  applyProfileData(activeConfig.profile);
  renderSkills(activeConfig.skills);
  renderAllSections();
  setupEventListeners();
  setupVinylInteraction();
  fetchLiveGithubStats(activeConfig.profile.username);
  
  // Renderizar iconos de Lucide
  refreshIcons();

  /**
   * Carga la configuración inicial desde localStorage si el usuario guardó cambios previos,
   * o usa el archivo config.js por defecto.
   */
  function loadWorkingConfig() {
    const saved = localStorage.getItem("wuiisito_custom_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Preservar estructura asegurando que los proyectos existan
        return { ...window.USER_CONFIG, ...parsed };
      } catch (e) {
        console.warn("No se pudo cargar la configuración de localStorage", e);
      }
    }
    return JSON.parse(JSON.stringify(window.USER_CONFIG || {}));
  }

  /**
   * Aplica la información del perfil en el DOM
   */
  function applyProfileData(profile) {
    if (!profile) return;

    // Nombre y Bio
    const heroName = document.getElementById("hero-name");
    const heroBio = document.getElementById("hero-bio");
    const heroStatus = document.getElementById("hero-status");
    const navUsername = document.getElementById("nav-username");
    const navAvatar = document.getElementById("nav-avatar");
    const currentYear = document.getElementById("current-year");

    if (heroName) heroName.textContent = profile.name || profile.username;
    if (heroBio) heroBio.textContent = profile.bio || "";
    if (heroStatus) heroStatus.textContent = profile.statusText || "Desarrollando proyectos";
    if (navUsername) navUsername.textContent = profile.username || "wuiisito";
    if (navAvatar && profile.avatar) navAvatar.src = profile.avatar;
    if (currentYear) currentYear.textContent = new Date().getFullYear();

    // Enlaces de GitHub
    const ghUrl = profile.github || `https://github.com/${profile.username}`;
    const navGh = document.getElementById("nav-github-link");
    const heroGh = document.getElementById("hero-github-btn");
    const footerGh = document.getElementById("footer-github");

    if (navGh) navGh.href = ghUrl;
    if (heroGh) heroGh.href = ghUrl;
    if (footerGh) footerGh.href = ghUrl;
  }

  /**
   * Obtiene estadísticas reales de la API de GitHub para mostrar contadores reales
   */
  async function fetchLiveGithubStats(username) {
    if (!username) return;
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        const statRepos = document.getElementById("stat-repos");
        const statFollowers = document.getElementById("stat-followers");
        const navAvatar = document.getElementById("nav-avatar");

        if (statRepos && data.public_repos !== undefined) {
          statRepos.textContent = data.public_repos;
        }
        if (statFollowers && data.followers !== undefined) {
          statFollowers.textContent = data.followers;
        }
        if (navAvatar && data.avatar_url) {
          navAvatar.src = data.avatar_url;
        }
      }
    } catch (err) {
      console.log("Modo offline o límite de GitHub API, usando valores locales.");
    }
  }

  /**
   * Renderiza las dos secciones de proyectos: Destacados y Todos
   */
  function renderAllSections() {
    renderFeaturedProjects();
    renderFilteredProjects();
    updateStatsCounter();
    refreshIcons();
  }

  /**
   * Renderiza los proyectos destacados en la cuadrícula superior
   */
  function renderFeaturedProjects() {
    const featuredGrid = document.getElementById("featured-grid");
    if (!featuredGrid) return;

    // Solo proyectos con pinned !== false y featured === true
    const featuredList = (activeConfig.projects || []).filter(p => p.pinned !== false && p.featured === true);

    if (featuredList.length === 0) {
      featuredGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">✨</div>
          <h3>No hay proyectos destacados seleccionados</h3>
          <p style="color: var(--text-muted); margin-top: 6px;">Usa el botón de <b>Personalizar</b> para destacar los proyectos que quieras resaltar arriba.</p>
        </div>
      `;
      return;
    }

    featuredGrid.innerHTML = featuredList.map(project => createProjectCardHTML(project, true)).join("");
  }

  /**
   * Renderiza la grilla general de proyectos aplicando categoría y búsqueda
   */
  function renderFilteredProjects() {
    const allProjectsGrid = document.getElementById("all-projects-grid");
    if (!allProjectsGrid) return;

    let list = (activeConfig.projects || []).filter(p => p.pinned !== false);

    // Filtro por categoría
    if (currentCategory === "featured") {
      list = list.filter(p => p.featured === true);
    } else if (currentCategory !== "all") {
      list = list.filter(p => p.category === currentCategory);
    }

    // Filtro por búsqueda
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const inTitle = p.title.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inTags = (p.tags || []).some(t => t.toLowerCase().includes(q));
        return inTitle || inDesc || inTags;
      });
    }

    // Actualizar contador
    const resultsCountEl = document.getElementById("results-count");
    if (resultsCountEl) {
      resultsCountEl.textContent = `Mostrando ${list.length} de ${(activeConfig.projects || []).filter(p => p.pinned !== false).length} proyectos`;
    }

    if (list.length === 0) {
      allProjectsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3>No se encontraron proyectos</h3>
          <p style="color: var(--text-muted); margin-top: 6px;">Intenta cambiar el término de búsqueda o selecciona otro filtro.</p>
        </div>
      `;
      return;
    }

    allProjectsGrid.innerHTML = list.map(project => createProjectCardHTML(project, false)).join("");
  }

  /**
   * Genera el HTML de una tarjeta de proyecto
   */
  function createProjectCardHTML(project, isSpotlight) {
    const iconName = project.icon || "code";
    const tagsHTML = (project.tags || [])
      .map(tag => `<span class="tag-badge">${escapeHTML(tag)}</span>`)
      .join("");

    const demoBtn = project.demo ? `
      <a href="${escapeHTML(project.demo)}" target="_blank" rel="noopener noreferrer" class="card-link-btn card-link-primary">
        <i data-lucide="external-link" style="width: 14px; height: 14px;"></i>
        <span>Demo</span>
      </a>
    ` : "";

    const repoBtn = project.repo ? `
      <a href="${escapeHTML(project.repo)}" target="_blank" rel="noopener noreferrer" class="card-link-btn card-link-subtle" title="Ver código fuente en GitHub">
        <i data-lucide="github" style="width: 16px; height: 16px;"></i>
        <span>Código</span>
      </a>
    ` : "";

    const badgeHTML = project.badge ? `
      <span class="card-pill">${escapeHTML(project.badge)}</span>
    ` : (project.featured ? `<span class="card-pill">⭐ Destacado</span>` : "");

    return `
      <article class="project-card ${project.featured ? 'is-featured' : ''}">
        <div>
          <div class="card-top">
            <div class="card-icon-badge">
              <i data-lucide="${escapeHTML(iconName)}" style="width: 24px; height: 24px;"></i>
            </div>
            ${badgeHTML}
          </div>

          <h3 class="card-title">${escapeHTML(project.title)}</h3>
          <p class="card-desc">${escapeHTML(project.description)}</p>
          <div class="card-tags">${tagsHTML}</div>
        </div>

        <div class="card-footer">
          <div class="card-links">
            ${demoBtn}
            ${repoBtn}
          </div>
          <span style="font-size: 0.75rem; font-family: var(--font-mono); color: var(--text-faint);">
            ${escapeHTML(project.category || 'general')}
          </span>
        </div>
      </article>
    `;
  }

  /**
   * Renderiza la cuadrícula de habilidades
   */
  function renderSkills(skills) {
    const skillsGrid = document.getElementById("skills-grid");
    if (!skillsGrid || !skills) return;

    skillsGrid.innerHTML = skills.map(skill => `
      <div class="skill-card">
        <div class="skill-icon">
          <i data-lucide="${escapeHTML(skill.icon || 'check')}"></i>
        </div>
        <div>
          <div class="skill-name">${escapeHTML(skill.name)}</div>
          <div class="skill-level">${escapeHTML(skill.level || 'Intermedio')}</div>
        </div>
      </div>
    `).join("");
  }

  /**
   * Actualiza los contadores de la sección Hero
   */
  function updateStatsCounter() {
    const featuredCountEl = document.getElementById("stat-featured");
    if (featuredCountEl) {
      const count = (activeConfig.projects || []).filter(p => p.pinned !== false && p.featured === true).length;
      featuredCountEl.textContent = count;
    }
  }

  /**
   * Configura eventos de botones, filtros y buscador
   */
  function setupEventListeners() {
    // Filtros de categoría
    const filterButtons = document.querySelectorAll("#category-filters .filter-btn");
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category || "all";
        renderFilteredProjects();
        refreshIcons();
      });
    });

    // Barra de búsqueda
    const searchInput = document.getElementById("project-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderFilteredProjects();
        refreshIcons();
      });
    }

    // Modal de personalización de proyectos
    const modal = document.getElementById("customizer-modal");
    const openBtns = [
      document.getElementById("open-customizer-btn"),
      document.getElementById("hero-customize-btn"),
      document.getElementById("quick-customize-link")
    ];
    const closeBtn = document.getElementById("close-modal-btn");

    openBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          openCustomizerModal();
        });
      }
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }

    // Guardar cambios en vivo en el navegador
    const saveLocalBtn = document.getElementById("save-local-btn");
    if (saveLocalBtn) {
      saveLocalBtn.addEventListener("click", () => {
        saveCustomizerChanges();
        modal.classList.remove("open");
        renderAllSections();
        showToast("¡Cambios aplicados y guardados en tu navegador! ✨");
      });
    }

    // Copiar el archivo config.js completo al portapapeles
    const copyConfigBtn = document.getElementById("copy-config-btn");
    if (copyConfigBtn) {
      copyConfigBtn.addEventListener("click", () => {
        saveCustomizerChanges();
        copyConfigFileToClipboard();
      });
    }

    // Restaurar valores por defecto
    const resetDefaultBtn = document.getElementById("reset-default-btn");
    if (resetDefaultBtn) {
      resetDefaultBtn.addEventListener("click", () => {
        if (confirm("¿Deseas restaurar la lista de proyectos original?")) {
          localStorage.removeItem("wuiisito_custom_config");
          activeConfig = JSON.parse(JSON.stringify(window.USER_CONFIG));
          modal.classList.remove("open");
          renderAllSections();
          showToast("Proyectos restaurados a su configuración original.");
        }
      });
    }

    // Sincronizar repositorios en vivo desde la API de GitHub
    const syncGithubBtn = document.getElementById("sync-github-btn");
    if (syncGithubBtn) {
      syncGithubBtn.addEventListener("click", syncWithGithubRepos);
    }
  }

  /**
   * Abre y llena el modal del gestor de proyectos
   */
  function openCustomizerModal() {
    const modal = document.getElementById("customizer-modal");
    const projectListEl = document.getElementById("modal-project-list");
    if (!modal || !projectListEl) return;

    projectListEl.innerHTML = activeConfig.projects.map((proj, index) => {
      const isPinned = proj.pinned !== false;
      const isFeatured = proj.featured === true;

      return `
        <div class="modal-project-row" data-index="${index}">
          <div class="row-left">
            <span style="font-size: 1.25rem;">${getCategoryEmoji(proj.category)}</span>
            <div style="min-width: 0;">
              <div class="row-title">${escapeHTML(proj.title)}</div>
              <div class="row-category">${escapeHTML(proj.category || 'general')} • ${escapeHTML((proj.tags || []).slice(0, 2).join(", "))}</div>
            </div>
          </div>

          <div class="row-controls">
            <label class="toggle-label" title="Mostrar u ocultar este proyecto en la web">
              <input type="checkbox" class="toggle-pinned" ${isPinned ? 'checked' : ''}>
              <span>Mostrar</span>
            </label>

            <label class="toggle-label" title="Destacar este proyecto en la sección principal">
              <input type="checkbox" class="toggle-featured" ${isFeatured ? 'checked' : ''}>
              <span style="color: #fbbf24;">⭐ Destacar</span>
            </label>
          </div>
        </div>
      `;
    }).join("");

    modal.classList.add("open");
    refreshIcons();
  }

  /**
   * Lee el estado de los checkboxes del modal y actualiza activeConfig
   */
  function saveCustomizerChanges() {
    const rows = document.querySelectorAll(".modal-project-row");
    rows.forEach(row => {
      const idx = parseInt(row.dataset.index, 10);
      const pinnedCheckbox = row.querySelector(".toggle-pinned");
      const featuredCheckbox = row.querySelector(".toggle-featured");

      if (activeConfig.projects[idx]) {
        activeConfig.projects[idx].pinned = pinnedCheckbox ? pinnedCheckbox.checked : true;
        activeConfig.projects[idx].featured = featuredCheckbox ? featuredCheckbox.checked : false;
      }
    });

    // Guardar en localStorage para persistencia
    localStorage.setItem("wuiisito_custom_config", JSON.stringify(activeConfig));
  }

  /**
   * Genera el archivo config.js completo y lo copia al portapapeles
   */
  function copyConfigFileToClipboard() {
    const generatedJS = `/**
 * ====================================================================
 *  CONFIGURACIÓN DE TU PERFIL Y PORTAFOLIO GITHUB (wuiisito.github.io)
 * ====================================================================
 * Actualizado el: ${new Date().toLocaleDateString()}
 */

const USER_CONFIG = ${JSON.stringify(activeConfig, null, 2)};

// Exportar globalmente para el navegador
if (typeof window !== "undefined") {
  window.USER_CONFIG = USER_CONFIG;
}
`;

    navigator.clipboard.writeText(generatedJS).then(() => {
      showToast("¡Código copiado! Pégalo en tu config.js y haz commit.");
    }).catch(err => {
      console.error("Error al copiar al portapapeles", err);
      showToast("No se pudo copiar automáticamente. Revisa la consola.");
    });
  }

  /**
   * Consulta los repositorios de GitHub de @wuiisito y añade los que falten
   */
  async function syncWithGithubRepos() {
    const btn = document.getElementById("sync-github-btn");
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>Buscando repos en GitHub...</span>`;
    btn.disabled = true;

    try {
      const res = await fetch(`https://api.github.com/users/${activeConfig.profile.username}/repos?sort=updated&per_page=50`);
      if (!res.ok) throw new Error("Error en API de GitHub");
      const repos = await res.json();

      let addedCount = 0;
      const existingUrls = new Set(activeConfig.projects.map(p => (p.repo || "").toLowerCase()));

      repos.forEach(repo => {
        if (!repo.fork && !existingUrls.has(repo.html_url.toLowerCase())) {
          // Es un repo propio nuevo
          activeConfig.projects.push({
            id: repo.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            title: repo.name.replace(/[-_]/g, " "),
            description: repo.description || "Proyecto creado en GitHub.",
            tags: [repo.language || "Code", "GitHub"],
            category: detectCategory(repo.name, repo.language),
            repo: repo.html_url,
            demo: repo.homepage || "",
            pinned: true,
            featured: false,
            icon: "folder",
            badge: repo.language || ""
          });
          addedCount++;
        }
      });

      openCustomizerModal(); // refrescar lista
      showToast(`¡Se encontraron ${addedCount} nuevos repositorios de GitHub!`);
    } catch (err) {
      alert("No se pudo conectar con la API de GitHub en este momento. Inténtalo de nuevo más tarde.");
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
      refreshIcons();
    }
  }

  /**
   * Helper para detectar categoría según lenguaje y nombre
   */
  function detectCategory(name, lang) {
    const n = (name || "").toLowerCase();
    const l = (lang || "").toLowerCase();
    if (l.includes("dart") || l.includes("flutter")) return "mobile";
    if (n.includes("mod") || l.includes("java")) return "mods";
    if (n.includes("bot") || l.includes("python")) return "bots";
    if (n.includes("tool") || n.includes("extension") || n.includes("speedhack")) return "tools";
    return "web";
  }

  function getCategoryEmoji(cat) {
    switch (cat) {
      case "web": return "🌐";
      case "mods": return "🎮";
      case "bots": return "🤖";
      case "mobile": return "📱";
      case "tools": return "⚡";
      default: return "📦";
    }
  }

  /**
   * Sistema interactivo de tocadiscos de vinilo (Easter egg con Web Audio)
   */
  function setupVinylInteraction() {
    const disc = document.getElementById("vinyl-disc");
    const tonearm = document.getElementById("tonearm");
    const soundwave = document.getElementById("soundwave");
    const statusPill = document.getElementById("vinyl-status-pill");

    let isPlaying = false;
    let audioCtx = null;
    let osc = null;
    let gainNode = null;

    if (!disc) return;

    disc.addEventListener("click", () => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        disc.classList.add("spinning");
        if (tonearm) tonearm.classList.add("active");
        if (soundwave) soundwave.classList.add("playing");
        if (statusPill) {
          statusPill.textContent = "Reproduciendo 🎶";
          statusPill.style.color = "var(--accent-pink)";
          statusPill.style.background = "rgba(255, 51, 119, 0.15)";
        }
        playSynthesizedVinylNote();
      } else {
        disc.classList.remove("spinning");
        if (tonearm) tonearm.classList.remove("active");
        if (soundwave) soundwave.classList.remove("playing");
        if (statusPill) {
          statusPill.textContent = "Pausado";
          statusPill.style.color = "var(--accent-secondary)";
          statusPill.style.background = "rgba(0, 229, 255, 0.1)";
        }
        stopSynthesizedVinylNote();
      }
    });

    function playSynthesizedVinylNote() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();

        // Acorde suave estilo lofi / vinilo cálido
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // Do Mayor 7
        const freq = frequencies[Math.floor(Math.random() * frequencies.length)];

        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Ataque y decaimiento suave
        gainNode.gain.setValueAtTime(0.001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.02, audioCtx.currentTime + 1.5);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
      } catch (e) {
        // En navegadores que restrinjan audio sin gesto directo
      }
    }

    function stopSynthesizedVinylNote() {
      if (gainNode && audioCtx) {
        try {
          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
          setTimeout(() => {
            if (osc) osc.stop();
          }, 350);
        } catch (e) {}
      }
    }
  }

  /**
   * Muestra notificaciones flotantes tipo Toast
   */
  function showToast(message) {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  /**
   * Escapa caracteres HTML para prevenir inyección
   */
  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  /**
   * Actualiza iconos de Lucide dinámicamente
   */
  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
});
