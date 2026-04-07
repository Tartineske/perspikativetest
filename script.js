// ============================= 1. MENU MOBILE =============================

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const menuIcon = document.getElementById('menuIcon');
  const burgerIcon = document.querySelector('.burger-icon');

  if (!menuToggle) {
    return; // Pas de menu sur cette page
  }

  function syncMenuState() {
    const isOpen = menuToggle.checked;

    // Icône burger (menu/fermer)
    if (menuIcon) {
      const currentSrc = menuIcon.getAttribute('src') || menuIcon.src;
      const basePath = currentSrc ? currentSrc.substring(0, currentSrc.lastIndexOf('icons/')) : '';
      menuIcon.src = isOpen ? `${basePath}icons/fermer.svg` : `${basePath}icons/menu.svg`;
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

  // Afficher le bouton menu uniquement tout en haut sur mobile
  let burgerTicking = false;
  const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

  const updateBurgerVisibility = () => {
    if (!burgerIcon) return;

    const atTop = (window.pageYOffset || document.documentElement.scrollTop) <= 0;
    const shouldShow = !isMobileViewport() || atTop;
    burgerIcon.classList.toggle('is-hidden', !shouldShow);
  };

  const handleBurgerScroll = () => {
    if (burgerTicking) return;
    burgerTicking = true;

    requestAnimationFrame(() => {
      updateBurgerVisibility();
      burgerTicking = false;
    });
  };

  window.addEventListener('scroll', handleBurgerScroll, { passive: true });
  window.addEventListener('resize', updateBurgerVisibility);

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
  updateBurgerVisibility();
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



// ============================= 5. ANTI CLIQUE GAUCHE =============================

// Bloque clic droit partout
document.addEventListener("contextmenu", e => e.preventDefault());



// ============================= 6. OUVRIR LES HASHS DE LA RECHERCHE POUR LES LIGHTBOXS =============================

// Ouvrir automatiquement la lightbox si un hash est présent
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1); // enlève le #
  if (!hash) return;

  const targetImg = document.getElementById(hash);
  if (targetImg) {
    // Réutilise exactement la même logique que pour le clic
    lightboxImg.src = targetImg.src;
    lightboxTitle.textContent = targetImg.dataset.title || '';
    lightboxDate.textContent = targetImg.dataset.date || '';
    lightboxDesc.innerHTML = targetImg.dataset.desc || '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
});

document.addEventListener('click', (e) => {
  const clickedImg = e.target.closest('.prspk-thumb');
  if (!clickedImg) return;

  // Si l'image cliquée n'a PAS de data-title, on est en 2 colonnes
  if (!clickedImg.dataset.title) {
    const id = clickedImg.id;
    if (!id) return;

    // On va chercher l'image "riche" dans la version 3 colonnes
    const sourceImg = document.querySelector(
      `.layout-3colonnes .prspk-thumb#${CSS.escape(id)}`
    );

    if (!sourceImg) return;

    // On simule exactement l'ouverture normale de la lightbox
    lightboxImg.src = sourceImg.src;
    lightboxTitle.textContent = sourceImg.dataset.title || '';
    lightboxDate.textContent = targetImg.dataset.date || '';
    lightboxDesc.innerHTML = sourceImg.dataset.desc || '';

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Bonus : met à jour l'URL
    history.pushState(null, '', `#${id}`);
  }
});

// ============================= 7. GESTION DU MODE SOMBRE =============================

document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme");

  // Appliquer le thème partout
  if (savedTheme === "dark") {
    root.setAttribute("data-theme", "dark");
  }

  // Gestion de la toggle (seulement si elle existe)
  const darkToggle = document.getElementById("dark-mode");
  if (!darkToggle) return;

  darkToggle.checked = savedTheme === "dark";

  darkToggle.addEventListener("change", () => {
    if (darkToggle.checked) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.removeAttribute("data-theme");
      localStorage.removeItem("theme");
    }
  });
});

// ============================= 8. FAQ DÉROULANTE =============================

document.addEventListener('DOMContentLoaded', () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');

      // Fermer tous les autres éléments de FAQ
      document.querySelectorAll('.faq-item.active').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          const btn = item.querySelector('.faq-question');
          if (btn) {
            btn.setAttribute('aria-expanded', 'false');
          }
        }
      });

      // Basculer l'élément actuel
      if (isActive) {
        faqItem.classList.remove('active');
        question.setAttribute('aria-expanded', 'false');
      } else {
        faqItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });
});

// ============================= 9. LOADER PERSPIKATIVE =============================

document.addEventListener("DOMContentLoaded", () => {
  const loader = document.getElementById("site-loader");

  if (!loader) return;

  const hasSeenLoader = sessionStorage.getItem("perspikative-loader");

  if (hasSeenLoader) {
    loader.style.display = "none";
  } else {
    sessionStorage.setItem("perspikative-loader", "true");
  }
});

// ============================= 10. BOUTON FLOTTANT DE RECHERCHE - MASQUAGE AU SCROLL =============================

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('.search-float-btn');
  
  // Vérifier si le bouton existe
  if (!searchBtn) return;
  
  let lastScrollTop = 0;
  let ticking = false;
  const scrollThreshold = 5; // Tolérance très petite pour détecter le bas exact
  
  // Fonction pour gérer le masquage/affichage du bouton
  const handleScroll = () => {
    if (ticking) return;
    
    ticking = true;
    requestAnimationFrame(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight);
      
      // Masquer le bouton uniquement quand on arrive tout en bas
      if (distanceFromBottom <= scrollThreshold) {
        searchBtn.classList.add('hide');
      } 
      // Afficher le bouton quand on remonte et qu'on n'est plus tout en bas
      else {
        searchBtn.classList.remove('hide');
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

// ============================= 11. ANIMATION D'APPARITION DU FOOTER =============================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // Si le footer est visible à au moins 10% dans l'écran
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1 }); // Se déclenche quand 10% du footer apparaît

observer.observe(document.querySelector('footer'));



document.addEventListener('mousemove', (e) => {
  const mouseX = (e.clientX - window.innerWidth / 2);
  const mouseY = (e.clientY - window.innerHeight / 2);

  // On sélectionne toutes les images de décor
  const images = document.querySelectorAll('.p-img');

  images.forEach((img) => {
    // On définit la force de l'effet selon la classe ou le z-index
    // Plus le chiffre est petit, plus l'image fuit loin
    let intensity = 0.02; 
    
    if (img.classList.contains('pos-1')) intensity = 0.04;
    if (img.classList.contains('pos-3')) intensity = 0.006; // Fond lointain
    if (img.classList.contains('cat-mascot')) intensity = 0.07; // Premier plan

    // Calcul du mouvement inversé (-)
    const x = mouseX * -intensity;
    const y = mouseY * -intensity;

    img.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const images = document.querySelectorAll('.p-img');
  
  // On stocke la rotation initiale de chaque image pour ne pas la perdre
  const imgData = Array.from(images).map(img => {
    const style = window.getComputedStyle(img);
    const matrix = new WebKitCSSMatrix(style.transform);
    const angle = Math.round(Math.atan2(matrix.b, matrix.a) * (180/Math.PI));
    
    // On définit l'intensité selon le z-index
    const z = parseInt(style.zIndex);
    let intensity = 0.04;
    if (z < 5) intensity = 0.006; // Fond
    if (z > 10) intensity = 0.07; // Premier plan
    
    return { el: img, rot: angle, speed: intensity };
  });

  window.addEventListener('mousemove', (e) => {
    const mouseX = (e.clientX - window.innerWidth / 2);
    const mouseY = (e.clientY - window.innerHeight / 2);

    imgData.forEach(item => {
      // Mouvement opposé (-)
      const x = mouseX * -item.speed;
      const y = mouseY * -item.speed;
      
      item.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${item.rot}deg)`;
    });
  });
});

// ============================= FIN DU SCRIPT =============================
