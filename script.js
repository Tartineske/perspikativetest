// ============================= 1. MENU MOBILE =============================

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuIcon = document.getElementById('menuIcon');

  if (!menuToggle) {
    return; // Pas de menu sur cette page
  }

  function syncMenuState() {
    const isOpen = menuToggle.checked;

    // Icône burger (menu/fermer)
    if (menuIcon) {
      const currentSrc = menuIcon.getAttribute('src') || menuIcon.src;
      const basePath = currentSrc ? currentSrc.substring(0, currentSrc.lastIndexOf('logos/')) : '';
      menuIcon.src = isOpen ? `${basePath}logos/fermer.svg` : `${basePath}logos/menu.svg`;
    }

    // Blur, scroll lock et état body pour overlay
    document.body.classList.toggle('menu-open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    document.documentElement.style.overflow = isOpen ? 'hidden' : '';

    // Animation menu + accessibilité/interaction des liens
    if (mobileMenu) {
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      mobileMenu.querySelectorAll('a').forEach(link => {
        link.tabIndex = isOpen ? 0 : -1;
        link.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        link.style.opacity = isOpen ? '1' : '0';
        link.style.pointerEvents = isOpen ? 'auto' : 'none';
        link.style.transition = 'opacity 0.35s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    }
  }

  // Checkbox change
  menuToggle.addEventListener('change', syncMenuState);

  // Fermer si lien cliqué
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.checked = false;
        syncMenuState();
      });
    });
  }

  // Fermer sur clic blur-overlay
  const blurOverlay = document.querySelector('.blur-overlay');
  if (blurOverlay) {
    blurOverlay.addEventListener('click', () => {
      menuToggle.checked = false;
      syncMenuState();
    });
  }

  // Fermer menu avec Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuToggle.checked) {
      menuToggle.checked = false;
      syncMenuState();
    }
  });

  // État initial
  syncMenuState();
});

// ============================= 2. LIGHTBOX POUR LES CRÉATIONS =============================

document.addEventListener('DOMContentLoaded', () => {
  // Vérifier si la lightbox existe (uniquement sur la page creations)
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // Pas de lightbox sur cette page

  const thumbs = document.querySelectorAll('.prspk-thumb');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const closeBtn = document.getElementById('lightbox-close');

  // Vérifier que les éléments nécessaires existent
  if (!lightboxImg || !lightboxTitle || !lightboxDesc || !closeBtn) {
    console.warn('Lightbox : certains éléments sont manquants.');
    return;
  }

  // Ouvrir la lightbox au clic sur une miniature
  thumbs.forEach(img => {
    img.addEventListener('click', () => {
      // Image principale
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';

      // Titre
      lightboxTitle.textContent = img.dataset.title || '';

      // Description avec HTML interprété (<br>, <strong>, etc.)
      lightboxDesc.innerHTML = img.dataset.desc || '';

      // Afficher la lightbox et bloquer le scroll
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Fermer avec le bouton
  closeBtn.addEventListener('click', () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Fermer en cliquant sur le fond (overlay)
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Fermer avec la touche Échap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});

// ============================= 3. ANIMATION DES IMAGES DE CRÉATIONS =============================

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('#creations .masonry img');
  
  if (images.length === 0) return; // Pas d'images sur cette page

  images.forEach((img, index) => {
    // Ajouter un délai progressif pour l'animation
    img.style.animationDelay = `${index * 0.1}s`;
    
    // Gérer l'apparition quand l'image est chargée
    const showImage = () => {
      img.classList.add('loaded');
      img.style.opacity = '1';
    };

    if (img.complete) {
      // Image déjà chargée
      showImage();
    } else {
      // Attendre le chargement
      img.addEventListener('load', showImage);
      img.addEventListener('error', () => {
        console.warn(`Image non chargée : ${img.src}`);
      });
    }
  });
});

// ============================= 4. BARRE DE NAVIGATION MOBILE - MASQUAGE AU SCROLL =============================

document.addEventListener('DOMContentLoaded', () => {
  const mobileNav = document.querySelector('.mobile-nav');
  
  // Vérifier si la barre de navigation mobile existe (seulement sur mobile)
  if (!mobileNav) return;
  
  let lastScrollTop = 0;
  let ticking = false;
  const scrollThreshold = 5; // Tolérance très petite pour détecter le bas exact
  
  // Fonction pour gérer le masquage/affichage de la barre
  const handleScroll = () => {
    if (ticking) return;
    
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // Masquer la barre uniquement quand on arrive tout en bas du footer
      if (distanceFromBottom <= scrollThreshold) {
        mobileNav.classList.add('hide');
      } 
      // Afficher la barre quand on remonte et qu'on n'est plus tout en bas
      else {
        mobileNav.classList.remove('hide');
      }
      
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      ticking = false;
    });
  };
  
  // Écouter l'événement de scroll avec throttling
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Vérifier l'état initial
  handleScroll();
});

// ============================= 5. GESTION DES PARAMÈTRES D'ANIMATIONS =============================

document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour appliquer/désactiver les animations
  function toggleAnimations(enabled) {
    if (enabled) {
      document.documentElement.classList.remove('no-animations');
    } else {
      document.documentElement.classList.add('no-animations');
    }
    // Sauvegarder dans localStorage
    localStorage.setItem('animationsEnabled', enabled ? 'true' : 'false');
  }

  // Fonction pour charger l'état sauvegardé
  function loadAnimationPreference() {
    const saved = localStorage.getItem('animationsEnabled');
    // Par défaut, les animations sont activées (si rien n'est sauvegardé)
    const enabled = saved === null ? true : saved === 'true';
    toggleAnimations(enabled);
    return enabled;
  }

  // Appliquer l'état au chargement de la page
  const animationsEnabled = loadAnimationPreference();

  // Gérer la checkbox sur la page des paramètres
  const animationsCheckbox = document.getElementById('animations');
  if (animationsCheckbox) {
    // Restaurer l'état de la checkbox
    animationsCheckbox.checked = animationsEnabled;
    
    // Écouter les changements
    animationsCheckbox.addEventListener('change', (e) => {
      toggleAnimations(e.target.checked);
    });
  }
});

// ============================= 6. GESTION DU MODE SOMBRE =============================

document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour activer/désactiver le mode sombre
  function toggleDarkMode(enabled) {
    if (enabled) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    // Sauvegarder dans localStorage
    localStorage.setItem('darkModeEnabled', enabled ? 'true' : 'false');
  }

  // Fonction pour charger l'état sauvegardé
  function loadDarkModePreference() {
    const saved = localStorage.getItem('darkModeEnabled');
    // Par défaut, le mode sombre est désactivé
    const enabled = saved === 'true';
    toggleDarkMode(enabled);
    return enabled;
  }

  // Appliquer l'état au chargement de la page
  const darkModeEnabled = loadDarkModePreference();

  // Gérer la checkbox sur la page des paramètres
  const darkModeCheckbox = document.getElementById('darkmode');
  if (darkModeCheckbox) {
    // Restaurer l'état de la checkbox
    darkModeCheckbox.checked = darkModeEnabled;
    
    // Écouter les changements
    darkModeCheckbox.addEventListener('change', (e) => {
      toggleDarkMode(e.target.checked);
    });
  }
});

// ============================= 7. GESTION DE LA POLICE CONTRASTÉE =============================

document.addEventListener('DOMContentLoaded', () => {
  // Fonction pour activer/désactiver la police contrastée
  function toggleContrastFont(enabled) {
    if (enabled) {
      document.documentElement.classList.add('contrast-font');
    } else {
      document.documentElement.classList.remove('contrast-font');
    }
    // Sauvegarder dans localStorage
    localStorage.setItem('contrastFontEnabled', enabled ? 'true' : 'false');
  }

  // Fonction pour charger l'état sauvegardé
  function loadContrastFontPreference() {
    const saved = localStorage.getItem('contrastFontEnabled');
    // Par défaut, la police contrastée est désactivée
    const enabled = saved === 'true';
    toggleContrastFont(enabled);
    return enabled;
  }

  // Appliquer l'état au chargement de la page
  const contrastFontEnabled = loadContrastFontPreference();

  // Gérer la checkbox sur la page des paramètres
  const contrastCheckbox = document.getElementById('contrast');
  if (contrastCheckbox) {
    // Restaurer l'état de la checkbox
    contrastCheckbox.checked = contrastFontEnabled;
    
    // Écouter les changements
    contrastCheckbox.addEventListener('change', (e) => {
      toggleContrastFont(e.target.checked);
    });
  }
});

// ============================= 8. GESTION DES CLICS SUR LES TOGGLES DES PARAMÈTRES =============================

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.setting .toggle').forEach(toggle => {
    const checkbox = toggle.querySelector('input[type="checkbox"]');
    const label = toggle.parentNode.querySelector('label');
    toggle.addEventListener('click', (e) => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      if (label) label.focus();
    });
  });
});


// ============================= 9. GESTION DE L'ANIMATION =============================

document.addEventListener("DOMContentLoaded", () => {
  const animationToggle = document.getElementById("animations");

  // Si rien n'est enregistré, on prend l’état du système
  if (localStorage.getItem("reduceMotion") === null) {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      document.body.classList.add("reduce-motion");
      animationToggle.checked = false;
      localStorage.setItem("reduceMotion", "true");
    }
  } else {
    // Sinon on applique le choix utilisateur
    const saved = localStorage.getItem("reduceMotion") === "true";
    if (saved) {
      document.body.classList.add("reduce-motion");
      animationToggle.checked = false;
    }
  }

  // Clic sur le toggle
  animationToggle.addEventListener("change", () => {
    if (animationToggle.checked) {
      document.body.classList.remove("reduce-motion");
      localStorage.setItem("reduceMotion", "false");
    } else {
      document.body.classList.add("reduce-motion");
      localStorage.setItem("reduceMotion", "true");
    }
  });
});

// ============================= FIN DU SCRIPT =============================
