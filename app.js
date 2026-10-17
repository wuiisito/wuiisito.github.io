/**
 * ====================================================================
 *  WUIISITO.GITHUB.IO — STUDIO ATELIER ENGINE (app.js)
 *  Motor interactivo para el portafolio y discografía de software.
 * ====================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Estado de la aplicación
  let activeConfig = loadWorkingConfig();
  let currentCategory = "all";
  let searchQuery = "";
  let viewMode = "grid"; // "grid" o "list"

  // 2. Inicialización
  applyProfileData(activeConfig.profile);
  renderSkills(activeConfig.skills);
  renderAllSections();
  setupEventListeners();
  setupTurntableEngine();
  fetchLiveGithubStats(activeConfig.profile.username);
  refreshIcons();

  /**
   * Carga la configuración desde localStorage o usa config.js
   */
  function loadWorkingConfig() {
    const saved = localStorage.getItem("wuiisito_custom_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return { ...window.USER_CONFIG, ...parsed };
      } catch (e) {
        console.warn("No se pudo cargar config previa", e);
      }
    }
    return JSON.parse(JSON.stringify(window.USER_CONFIG || {}));
  }

  /**
   * Aplica datos del perfil en el DOM
   */
  function applyProfileData(profile) {
    if (!profile) return;
    const heroBio = document.getElementById("hero-bio");
    const heroStatus = document.getElementById("hero-status");

    if (heroBio && profile.bio) {
      heroBio.textContent = profile.bio;
    }
    if (heroStatus && profile.statusText) {
      heroStatus.textContent = `STUDIO A • ${profile.statusText.toUpperCase()}`;
    }

    const ghUrl = profile.github || `https://github.com/${profile.username}`;
    const navGh = document.getElementById("nav-github-link");
    const heroGh = document.getElementById("hero-github-btn");
    const footerGh = document.getElementById("footer-github");

    if (navGh) navGh.href = ghUrl;
    if (heroGh) heroGh.href = ghUrl;
    if (footerGh) footerGh.href = ghUrl;
  }

  /**
   * Estadísticas en tiempo real de la API de GitHub
   */
  async function fetchLiveGithubStats(username) {
    if (!username) return;
    try {
      const res = await fetch(`https://api.github.com/users/${username}`);
      if (res.ok) {
        const data = await res.json();
        const statRepos = document.getElementById("stat-repos");
        const statFollowers = document.getElementById("stat-followers");

        if (statRepos && data.public_repos !== undefined) statRepos.textContent = data.public_repos;
        if (statFollowers && data.followers !== undefined) statFollowers.textContent = data.followers;
      }
    } catch (e) {
      // Modo offline respetado silenciosamente
    }
  }

  /**
   * Renderizado completo de las secciones
   */
  function renderAllSections() {
    renderHeadliners();
    renderCrate();
    updateCounterMeta();
    refreshIcons();
  }

  /**
   * Renderiza los Headliners con diseño físico a medida para cada uno
   */
  function renderHeadliners() {
    const container = document.getElementById("headliners-container");
    if (!container) return;

    const headliners = (activeConfig.projects || []).filter(p => p.pinned !== false && p.featured === true);

    if (headliners.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; border: 1px dashed var(--border-foil); border-radius: 12px;">
          <h3 style="font-family: var(--f-display); font-size: 1.25rem;">No hay proyectos destacados seleccionados</h3>
          <p style="color: var(--c-linen-muted); margin-top: 6px;">Usa el botón <b>"Curar Crate"</b> arriba para marcar qué proyectos destacar.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = headliners.map((proj, idx) => {
      // Diseños físicos personalizados según el proyecto:
      if (proj.id === "sabrina-vinyl" || proj.title.toLowerCase().includes("sabrina")) {
        // Gatefold Deluxe Vinyl Jacket
        return `
          <article class="card-vinyl-gatefold">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <span style="font-family: var(--f-mono); font-size: 0.72rem; color: var(--c-berry); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
                  ★ HEADLINER RELEASE // 12" DELUXE LP
                </span>
                <span style="font-family: var(--f-mono); font-size: 0.72rem; color: var(--c-groove);">SIDE A • 33 RPM</span>
              </div>

              <h3 style="font-family: var(--f-display); font-size: 1.85rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 0.85rem; line-height: 1.15; color: var(--c-linen);">
                ${escapeHTML(proj.title)}
              </h3>

              <p style="color: var(--c-linen-muted); font-size: 0.98rem; line-height: 1.6; margin-bottom: 1.75rem; max-width: 580px;">
                ${escapeHTML(proj.description)}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
                ${(proj.tags || []).map(t => `<span style="font-family: var(--f-mono); font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 4px; background: rgba(255, 42, 109, 0.12); color: #ff99b8; border: 1px solid rgba(255, 42, 109, 0.25);">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-foil); padding-top: 1.5rem;">
              <div style="display: flex; gap: 0.75rem;">
                ${proj.demo ? `
                  <a href="${escapeHTML(proj.demo)}" target="_blank" rel="noopener noreferrer" class="btn-pill" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">
                    <i data-lucide="play" style="width: 14px; height: 14px;"></i>
                    <span>Probar App</span>
                  </a>
                ` : ''}
                <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="padding: 0.5rem 1.15rem; font-size: 0.85rem;">
                  <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                  <span>Repositorio</span>
                </a>
              </div>
              <span style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-ash);">WEB AUDIO ENGINE</span>
            </div>
          </article>
        `;
      } else if (proj.id === "polaroid-lockscreen" || proj.title.toLowerCase().includes("polaroid")) {
        // Polaroid Film Instant Photo Card
        return `
          <article class="card-polaroid-film">
            <div class="polaroid-photo-frame">
              <i data-lucide="camera" style="width: 48px; height: 48px; color: var(--c-berry); z-index: 2;"></i>
              <span style="position: absolute; bottom: 8px; right: 12px; font-family: var(--f-mono); font-size: 0.65rem; color: #8f889c; z-index: 2;">INSTANT FILM 600</span>
            </div>

            <div class="polaroid-caption">
              ${escapeHTML(proj.title)}
            </div>
            <div class="polaroid-sub">
              ${escapeHTML(proj.description)}
            </div>

            <div style="margin-top: auto; padding-top: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
              <span style="font-family: var(--f-mono); font-size: 0.7rem; color: #736b82; font-weight: 700;">FLUTTER / DART</span>
              <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" style="color: #1a1722; font-family: var(--f-mono); font-size: 0.8rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                <span>Ver Repo</span>
                <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
              </a>
            </div>
          </article>
        `;
      } else if (proj.id === "kawaipals" || proj.title.toLowerCase().includes("kawaipals")) {
        // Minecraft Fabric Companion Cartridge
        return `
          <article class="card-companion-cartridge">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                <span class="slime-companion-badge">
                  <i data-lucide="gamepad-2" style="width: 14px; height: 14px;"></i>
                  <span>FABRIC 26.2 MOD</span>
                </span>
                <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-slime);">MINECRAFT</span>
              </div>

              <h3 style="font-family: var(--f-display); font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: var(--c-linen);">
                ${escapeHTML(proj.title)}
              </h3>

              <p style="color: var(--c-linen-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
                ${escapeHTML(proj.description)}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem;">
                ${(proj.tags || []).map(t => `<span style="font-family: var(--f-mono); font-size: 0.68rem; padding: 0.2rem 0.55rem; border-radius: 4px; background: rgba(0, 240, 160, 0.08); color: var(--c-slime); border: 1px solid rgba(0, 240, 160, 0.2);">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(0, 240, 160, 0.2); padding-top: 1.25rem;">
              <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="border-color: rgba(0, 240, 160, 0.3); color: var(--c-slime); font-size: 0.82rem; padding: 0.4rem 0.9rem;">
                <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                <span>Descargar Mod</span>
              </a>
              <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash);">COMPANION PETS</span>
            </div>
          </article>
        `;
      } else if (proj.id === "dualplay" || proj.title.toLowerCase().includes("dualplay")) {
        // DualPlay Stereo Mixer
        return `
          <article class="card-stereo-mixer">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-groove); font-weight: 700;">
                  STEREO SYNC // DECK A & B
                </span>
                <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash);">TYPESCRIPT</span>
              </div>

              <h3 style="font-family: var(--f-display); font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: var(--c-linen);">
                ${escapeHTML(proj.title)}
              </h3>

              <p style="color: var(--c-linen-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
                ${escapeHTML(proj.description)}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem;">
                ${(proj.tags || []).map(t => `<span style="font-family: var(--f-mono); font-size: 0.68rem; padding: 0.2rem 0.55rem; border-radius: 4px; background: rgba(229, 179, 88, 0.08); color: var(--c-groove); border: 1px solid rgba(229, 179, 88, 0.2);">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-foil); padding-top: 1.25rem;">
              <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="font-size: 0.82rem; padding: 0.4rem 0.9rem;">
                <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                <span>Ver Código</span>
              </a>
              <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash);">MULTIMEDIA DECK</span>
            </div>
          </article>
        `;
      } else {
        // Sokoromi Arcade Console o tarjeta editorial
        return `
          <article class="card-puzzle-console">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
                <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-berry); font-weight: 700;">
                  ARCADE BOT // DISCORD
                </span>
                <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash);">PYTHON</span>
              </div>

              <h3 style="font-family: var(--f-display); font-size: 1.45rem; font-weight: 800; letter-spacing: -0.02em; margin-bottom: 0.75rem; color: var(--c-linen);">
                ${escapeHTML(proj.title)}
              </h3>

              <p style="color: var(--c-linen-muted); font-size: 0.92rem; line-height: 1.6; margin-bottom: 1.5rem;">
                ${escapeHTML(proj.description)}
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem;">
                ${(proj.tags || []).map(t => `<span style="font-family: var(--f-mono); font-size: 0.68rem; padding: 0.2rem 0.55rem; border-radius: 4px; background: rgba(244, 239, 230, 0.05); color: var(--c-linen-muted); border: 1px solid var(--border-foil);">${escapeHTML(t)}</span>`).join('')}
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-foil); padding-top: 1.25rem;">
              <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" class="btn-outline" style="font-size: 0.82rem; padding: 0.4rem 0.9rem;">
                <i data-lucide="github" style="width: 14px; height: 14px;"></i>
                <span>Ver Bot</span>
              </a>
              <span style="font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash);">SOKOBAN PUZZLE</span>
            </div>
          </article>
        `;
      }
    }).join("");
  }

  /**
   * Renderiza el Crate (todos los proyectos) en formato Grid o Tracklist
   */
  function renderCrate() {
    const container = document.getElementById("crate-content");
    if (!container) return;

    let list = (activeConfig.projects || []).filter(p => p.pinned !== false);

    // Filtrar por categoría
    if (currentCategory === "featured") {
      list = list.filter(p => p.featured === true);
    } else if (currentCategory !== "all") {
      list = list.filter(p => p.category === currentCategory);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = (p.description || "").toLowerCase().includes(q);
        const tagMatch = (p.tags || []).some(t => t.toLowerCase().includes(q));
        return titleMatch || descMatch || tagMatch;
      });
    }

    // Actualizar contador
    const countEl = document.getElementById("crate-count");
    if (countEl) {
      countEl.textContent = `INDEX // MOSTRANDO ${list.length} DE ${(activeConfig.projects || []).filter(p => p.pinned !== false).length} LANZAMIENTOS`;
    }

    if (list.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 5rem 1rem; border: 1px dashed var(--border-foil); border-radius: 12px; background: #131118;">
          <i data-lucide="disc" style="width: 42px; height: 42px; color: var(--c-ash); margin-bottom: 1rem;"></i>
          <h3 style="font-family: var(--f-display); font-size: 1.3rem;">Ningún lanzamiento coincide con tu filtro</h3>
          <p style="color: var(--c-linen-muted); margin-top: 6px; font-size: 0.95rem;">Prueba con otra categoría o limpia el buscador.</p>
        </div>
      `;
      refreshIcons();
      return;
    }

    if (viewMode === "grid") {
      // Vista Cuadrícula de Crate
      container.innerHTML = `
        <div class="crate-grid">
          ${list.map(proj => `
            <div class="crate-item-card">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem;">
                  <span style="font-family: var(--f-mono); font-size: 0.72rem; color: ${proj.featured ? 'var(--c-berry)' : 'var(--c-groove)'}; font-weight: 700; text-transform: uppercase;">
                    ${proj.badge ? escapeHTML(proj.badge) : `[${escapeHTML(proj.category || 'code')}]`}
                  </span>
                  ${proj.featured ? `<span style="font-size: 0.8rem;" title="Headliner">⭐</span>` : ''}
                </div>

                <h4 style="font-family: var(--f-display); font-size: 1.25rem; font-weight: 800; color: var(--c-linen); margin-bottom: 0.65rem; line-height: 1.25;">
                  ${escapeHTML(proj.title)}
                </h4>

                <p style="color: var(--c-linen-muted); font-size: 0.9rem; line-height: 1.55; margin-bottom: 1.25rem;">
                  ${escapeHTML(proj.description)}
                </p>

                <div style="display: flex; flex-wrap: wrap; gap: 0.4rem; margin-bottom: 1.5rem;">
                  ${(proj.tags || []).map(t => `<span style="font-family: var(--f-mono); font-size: 0.68rem; padding: 0.15rem 0.5rem; border-radius: 4px; background: rgba(244, 239, 230, 0.04); color: var(--c-linen-muted); border: 1px solid var(--border-foil);">${escapeHTML(t)}</span>`).join('')}
                </div>
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-foil); padding-top: 1rem; margin-top: auto;">
                <div style="display: flex; gap: 0.5rem;">
                  ${proj.demo ? `
                    <a href="${escapeHTML(proj.demo)}" target="_blank" rel="noopener noreferrer" style="color: var(--c-berry); font-family: var(--f-mono); font-size: 0.78rem; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 3px;">
                      <span>Demo</span>
                      <i data-lucide="external-link" style="width: 12px; height: 12px;"></i>
                    </a>
                  ` : ''}
                  <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" style="color: var(--c-linen); font-family: var(--f-mono); font-size: 0.78rem; text-decoration: none; display: flex; align-items: center; gap: 4px;">
                    <i data-lucide="github" style="width: 13px; height: 13px;"></i>
                    <span>Repo</span>
                  </a>
                </div>
                <span style="font-family: var(--f-mono); font-size: 0.68rem; color: var(--c-ash);">
                  ${escapeHTML(proj.category || 'project')}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      // Vista Tracklist Editorial
      container.innerHTML = `
        <div class="tracklist-view">
          <div class="tracklist-row" style="background: #100e15; font-family: var(--f-mono); font-size: 0.7rem; color: var(--c-ash); text-transform: uppercase;">
            <span>TRK</span>
            <span>TÍTULO / LANZAMIENTO</span>
            <span class="tracklist-tech">TECNOLOGÍA</span>
            <span class="tracklist-cat">CAT</span>
            <span style="text-align: right;">ENLACE</span>
          </div>
          ${list.map((proj, idx) => `
            <div class="tracklist-row">
              <span class="tracklist-num">#${String(idx + 1).padStart(2, '0')}</span>
              <div>
                <div class="tracklist-name">${escapeHTML(proj.title)}</div>
                <div style="font-size: 0.78rem; color: var(--c-linen-muted); margin-top: 2px;">${escapeHTML(proj.description || '')}</div>
              </div>
              <span class="tracklist-tech" style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-groove);">
                ${(proj.tags || []).slice(0, 2).join(', ')}
              </span>
              <span class="tracklist-cat" style="font-family: var(--f-mono); font-size: 0.75rem; color: var(--c-ash);">
                ${escapeHTML(proj.category || 'code')}
              </span>
              <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
                ${proj.demo ? `<a href="${escapeHTML(proj.demo)}" target="_blank" rel="noopener noreferrer" style="color: var(--c-berry); font-family: var(--f-mono); font-size: 0.75rem; text-decoration: none;">Demo</a>` : ''}
                <a href="${escapeHTML(proj.repo)}" target="_blank" rel="noopener noreferrer" style="color: var(--c-linen); font-family: var(--f-mono); font-size: 0.75rem; text-decoration: none;">Repo ↗</a>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    refreshIcons();
  }

  /**
   * Renderiza las habilidades del estudio
   */
  function renderSkills(skills) {
    const container = document.getElementById("skills-container");
    if (!container || !skills) return;

    container.innerHTML = skills.map(skill => `
      <div style="background: #141118; border: 1px solid var(--border-foil); border-radius: 8px; padding: 1.25rem; display: flex; align-items: center; gap: 1rem; transition: all 0.2s ease;">
        <div style="width: 38px; height: 38px; border-radius: 6px; background: rgba(229, 179, 88, 0.08); border: 1px solid rgba(229, 179, 88, 0.2); display: flex; align-items: center; justify-content: center; color: var(--c-groove);">
          <i data-lucide="${escapeHTML(skill.icon || 'code')}"></i>
        </div>
        <div>
          <div style="font-family: var(--f-display); font-weight: 700; font-size: 0.95rem; color: var(--c-linen);">${escapeHTML(skill.name)}</div>
          <div style="font-family: var(--f-mono); font-size: 0.72rem; color: var(--c-ash); margin-top: 2px;">${escapeHTML(skill.level || 'Avanzado')}</div>
        </div>
      </div>
    `).join("");
  }

  /**
   * Actualiza el conteo de destacados
   */
  function updateCounterMeta() {
    const featuredEl = document.getElementById("stat-featured");
    if (featuredEl) {
      const count = (activeConfig.projects || []).filter(p => p.pinned !== false && p.featured === true).length;
      featuredEl.textContent = count;
    }
  }

  /**
   * Sistema de eventos interactivos
   */
  function setupEventListeners() {
    // Filtros de categoría del Crate
    const filterBtns = document.querySelectorAll("#crate-filters .crate-tag-btn");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category || "all";
        renderCrate();
      });
    });

    // Buscador instantáneo
    const searchInput = document.getElementById("crate-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchQuery = e.target.value;
        renderCrate();
      });
    }

    // Toggle de vistas: Grid vs Tracklist
    const gridBtn = document.getElementById("view-grid-btn");
    const listBtn = document.getElementById("view-list-btn");
    if (gridBtn && listBtn) {
      gridBtn.addEventListener("click", () => {
        viewMode = "grid";
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        renderCrate();
      });
      listBtn.addEventListener("click", () => {
        viewMode = "list";
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        renderCrate();
      });
    }

    // Modal de Curación del Crate
    const modal = document.getElementById("studio-modal");
    const openBtns = [
      document.getElementById("open-customizer-btn"),
      document.getElementById("hero-customize-btn"),
      document.getElementById("quick-curate-link")
    ];
    const closeBtn = document.getElementById("close-modal-btn");

    openBtns.forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          openCuratorModal();
        });
      }
    });

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => modal.classList.remove("open"));
      modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("open");
      });
    }

    // Aplicar cambios en vivo
    const applyLiveBtn = document.getElementById("apply-live-btn");
    if (applyLiveBtn) {
      applyLiveBtn.addEventListener("click", () => {
        saveCuratorModalState();
        modal.classList.remove("open");
        renderAllSections();
        showStudioToast("¡Cambios aplicados y guardados en tu navegador! ✨");
      });
    }

    // Copiar config.js al portapapeles
    const copyConfigBtn = document.getElementById("copy-config-btn");
    if (copyConfigBtn) {
      copyConfigBtn.addEventListener("click", () => {
        saveCuratorModalState();
        copyConfigJsCode();
      });
    }

    // Restaurar por defecto
    const resetDefaultBtn = document.getElementById("reset-default-btn");
    if (resetDefaultBtn) {
      resetDefaultBtn.addEventListener("click", () => {
        if (confirm("¿Deseas restaurar la lista de proyectos original?")) {
          localStorage.removeItem("wuiisito_custom_config");
          activeConfig = JSON.parse(JSON.stringify(window.USER_CONFIG));
          modal.classList.remove("open");
          renderAllSections();
          showStudioToast("Proyectos restaurados a su configuración inicial.");
        }
      });
    }

    // Sincronizar en vivo con GitHub
    const syncGithubBtn = document.getElementById("sync-github-btn");
    if (syncGithubBtn) {
      syncGithubBtn.addEventListener("click", syncReposFromGitHub);
    }
  }

  /**
   * Abre y renderiza la lista de proyectos dentro del modal curador
   */
  function openCuratorModal() {
    const modal = document.getElementById("studio-modal");
    const listEl = document.getElementById("modal-projects-list");
    if (!modal || !listEl) return;

    listEl.innerHTML = activeConfig.projects.map((proj, idx) => {
      const isPinned = proj.pinned !== false;
      const isFeatured = proj.featured === true;

      return `
        <div class="curator-row" data-index="${idx}" style="background: #1a1722; border: 1px solid var(--border-foil); border-radius: 8px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
          <div style="min-width: 0; flex: 1;">
            <div style="font-family: var(--f-display); font-weight: 700; font-size: 1rem; color: var(--c-linen); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHTML(proj.title)}
            </div>
            <div style="font-family: var(--f-mono); font-size: 0.72rem; color: var(--c-ash);">
              ${escapeHTML(proj.category || 'code')} • ${(proj.tags || []).slice(0, 2).join(", ")}
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--f-mono); font-size: 0.78rem; cursor: pointer; color: var(--c-linen-muted);">
              <input type="checkbox" class="toggle-pinned" ${isPinned ? 'checked' : ''} style="accent-color: var(--c-berry); width: 16px; height: 16px;">
              <span>Mostrar</span>
            </label>

            <label style="display: inline-flex; align-items: center; gap: 0.4rem; font-family: var(--f-mono); font-size: 0.78rem; cursor: pointer; color: var(--c-groove);">
              <input type="checkbox" class="toggle-featured" ${isFeatured ? 'checked' : ''} style="accent-color: var(--c-groove); width: 16px; height: 16px;">
              <span>⭐ Headliner</span>
            </label>
          </div>
        </div>
      `;
    }).join("");

    modal.classList.add("open");
  }

  /**
   * Guarda los checkboxes del modal en activeConfig y localStorage
   */
  function saveCuratorModalState() {
    const rows = document.querySelectorAll(".curator-row");
    rows.forEach(row => {
      const idx = parseInt(row.dataset.index, 10);
      const pinnedInput = row.querySelector(".toggle-pinned");
      const featuredInput = row.querySelector(".toggle-featured");

      if (activeConfig.projects[idx]) {
        activeConfig.projects[idx].pinned = pinnedInput ? pinnedInput.checked : true;
        activeConfig.projects[idx].featured = featuredInput ? featuredInput.checked : false;
      }
    });

    localStorage.setItem("wuiisito_custom_config", JSON.stringify(activeConfig));
  }

  /**
   * Copia el código JS completo de config.js
   */
  function copyConfigJsCode() {
    const code = `/**
 * ====================================================================
 *  CONFIGURACIÓN DE TU PERFIL Y PORTAFOLIO GITHUB (wuiisito.github.io)
 * ====================================================================
 * Actualizado el: ${new Date().toLocaleDateString()}
 */

const USER_CONFIG = ${JSON.stringify(activeConfig, null, 2)};

if (typeof window !== "undefined") {
  window.USER_CONFIG = USER_CONFIG;
}
`;

    navigator.clipboard.writeText(code).then(() => {
      showStudioToast("¡Código copiado! Pégalo en config.js y haz commit.");
    }).catch(() => {
      showStudioToast("Error al copiar al portapapeles.");
    });
  }

  /**
   * Sincroniza repositorios desde la API pública de GitHub
   */
  async function syncReposFromGitHub() {
    const btn = document.getElementById("sync-github-btn");
    const origText = btn.innerHTML;
    btn.innerHTML = `<span>Consultando GitHub...</span>`;
    btn.disabled = true;

    try {
      const res = await fetch(`https://api.github.com/users/${activeConfig.profile.username}/repos?sort=updated&per_page=50`);
      if (!res.ok) throw new Error("Error en API");
      const repos = await res.json();

      let added = 0;
      const existing = new Set(activeConfig.projects.map(p => (p.repo || "").toLowerCase()));

      repos.forEach(r => {
        if (!r.fork && !existing.has(r.html_url.toLowerCase())) {
          activeConfig.projects.push({
            id: r.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            title: r.name.replace(/[-_]/g, " "),
            description: r.description || "Proyecto creado en GitHub.",
            tags: [r.language || "Code", "GitHub"],
            category: detectRepoCategory(r.name, r.language),
            repo: r.html_url,
            demo: r.homepage || "",
            pinned: true,
            featured: false,
            icon: "folder",
            badge: r.language || ""
          });
          added++;
        }
      });

      openCuratorModal();
      showStudioToast(`¡Se añadieron ${added} nuevos repositorios de tu GitHub!`);
    } catch (e) {
      alert("No se pudo conectar con GitHub en este momento.");
    } finally {
      btn.innerHTML = origText;
      btn.disabled = false;
      refreshIcons();
    }
  }

  function detectRepoCategory(name, lang) {
    const n = (name || "").toLowerCase();
    const l = (lang || "").toLowerCase();
    if (l.includes("dart") || l.includes("flutter")) return "mobile";
    if (n.includes("mod") || l.includes("java")) return "mods";
    if (n.includes("bot") || l.includes("python")) return "bots";
    if (n.includes("tool") || n.includes("extension") || n.includes("speedhack")) return "tools";
    return "web";
  }

  /**
   * Motor del tocadiscos de vinilo (Efecto físico y Web Audio)
   */
  function setupTurntableEngine() {
    const lpRecord = document.getElementById("lp-record");
    const tonearm = document.getElementById("deck-tonearm");
    const vuMeter = document.getElementById("vu-meter");
    const toggleBtn = document.getElementById("toggle-vinyl-btn");

    let isSpinning = false;
    let audioCtx = null;
    let osc = null;
    let gainNode = null;

    function togglePlayback() {
      isSpinning = !isSpinning;

      if (isSpinning) {
        if (lpRecord) lpRecord.classList.add("is-spinning");
        if (tonearm) tonearm.classList.add("is-active");
        if (vuMeter) vuMeter.classList.add("playing");
        if (toggleBtn) {
          toggleBtn.innerHTML = `<i data-lucide="pause" style="width: 14px; height: 14px;"></i><span>Pausar</span>`;
        }
        playWarmVinylChords();
      } else {
        if (lpRecord) lpRecord.classList.remove("is-spinning");
        if (tonearm) tonearm.classList.remove("is-active");
        if (vuMeter) vuMeter.classList.remove("playing");
        if (toggleBtn) {
          toggleBtn.innerHTML = `<i data-lucide="play" style="width: 14px; height: 14px;"></i><span>Girar Disco</span>`;
        }
        stopWarmVinylChords();
      }
      refreshIcons();
    }

    if (lpRecord) lpRecord.addEventListener("click", togglePlayback);
    if (toggleBtn) toggleBtn.addEventListener("click", togglePlayback);

    function playWarmVinylChords() {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        audioCtx = new AudioContext();

        // Acordes de sintetizador cálido estilo vinilo (Fa Mayor 7 / Do)
        const notes = [261.63, 329.63, 392.00, 523.25];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];

        osc = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(randomNote, audioCtx.currentTime);

        gainNode.gain.setValueAtTime(0.0001, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 0.12);
        gainNode.gain.exponentialRampToValueAtTime(0.015, audioCtx.currentTime + 1.8);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
      } catch (e) {}
    }

    function stopWarmVinylChords() {
      if (gainNode && audioCtx) {
        try {
          gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
          setTimeout(() => {
            if (osc) osc.stop();
          }, 300);
        } catch (e) {}
      }
    }
  }

  /**
   * Muestra Toast de estudio
   */
  function showStudioToast(msg) {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toast-text");
    if (!toast || !toastText) return;

    toastText.textContent = msg;
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(20px)";
    }, 4000);
  }

  function escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
});
