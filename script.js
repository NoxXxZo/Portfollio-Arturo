document.addEventListener("DOMContentLoaded", () => {
  // ===== Menú hamburguesa para móviles =====
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  //slide
  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;
  const slider = document.querySelector(".slider");
  const intervalTime = 3000; // 3 segundos

  // ===== Crear los puntos =====
  const dotsContainer = document.querySelector(".dots-container");

  slides.forEach((_, index) => {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (index === 0) dot.classList.add("active"); // primer punto activo
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSliderPosition();
      updateDots();
      resetAutoplay(); // Reiniciar autoplay al hacer clic en un punto
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".dot");

  // ===== Función para actualizar los puntos activos =====
  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === currentIndex);
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active"); //mostrar/ocultar menú
      menuToggle.classList.toggle("open"); // animación de menú
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open"); // cerrar menú al hacer clic en un enlace
      });
    });
  }

  // ===== Animaciones al hacer scroll =====
  function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    reveals.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;

      if (elementTop < windowHeight - revealPoint) {
        element.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

  // ===== Bloquear clic derecho en toda la página =====
  document.addEventListener("contextmenu", function (e) {
    e.preventDefault();
  });

  //slider

  function updateSliderPosition() {
    const offset = -currentIndex * 100;
    slider.style.transform = `translateX(${offset}%)`;
    updateDots(); // Actualizar puntos activos
  }

  function showNextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSliderPosition();
  }

  function showPrevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSliderPosition();
  }

  document.querySelector(".next").addEventListener("click", () => {
    showNextSlide();
    resetAutoplay(); // 🔹 reinicia autoplay
  });

  document.querySelector(".prev").addEventListener("click", () => {
    showPrevSlide();
    resetAutoplay(); // 🔹 reinicia autoplay
  });

  // Automático cada 5 segundos
  let autoplayInterval;

  function startAutoplay() {
    if (!autoplayInterval) {
      autoplayInterval = setInterval(showNextSlide, intervalTime);
    }
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }

  // Iniciar automáticamente
  startAutoplay();

  // Pausar al pasar el mouse por encima del slider
  const sliderContainer = document.querySelector(".slider-container");

  sliderContainer.addEventListener("mouseenter", () => {
    if (lightbox.style.display !== "flex") {
      stopAutoplay();
    }
  });

  sliderContainer.addEventListener("mouseleave", () => {
    if (lightbox.style.display !== "flex") {
      startAutoplay();
    }
  });

  // Iniciar en el primer slide
  updateSliderPosition();

  // Lightbox para ver imagen en grande
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  //const slides = document.querySelectorAll(".slide");
  let currentLightboxIndex = 0;

  // Abrir imagen en grande
  slides.forEach((img, index) => {
    img.addEventListener("click", () => {
      currentLightboxIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    lightbox.style.display = "flex";
    const img = slides[currentLightboxIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;

    stopAutoplay(); // Detener el autoplay del slider al abrir el lightbox
  }

  function closeLightbox() {
    lightbox.style.display = "none";

    startAutoplay(); // Reiniciar el autoplay del slider al cerrar el lightbox
  }

  function showPrevLightboxImage() {
    currentLightboxIndex =
      (currentLightboxIndex - 1 + slides.length) % slides.length;
    openLightbox();
  }

  function showNextLightboxImage() {
    currentLightboxIndex = (currentLightboxIndex + 1) % slides.length;
    openLightbox();
  }

  closeBtn.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", (e) => {
    e.stopPropagation(); // evitar cerrar el lightbox
    showPrevLightboxImage();
    showPrevSlide();
  });
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showNextLightboxImage();
    showNextSlide();
  });

  // Cerrar si se hace clic fuera de la imagen
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // También permitir navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "flex") {
      if (e.key === "ArrowRight") showNextLightboxImage();
      if (e.key === "ArrowLeft") showPrevLightboxImage();
      if (e.key === "Escape") closeLightbox();
    }
  });
  // --- Swipe en Lightbox para móviles ---
  if (window.innerWidth <= 768) {
    const lightbox = document.getElementById("lightbox");
    let startXLightbox = 0;
    let endXLightbox = 0;

    lightbox.addEventListener("touchstart", (e) => {
      startXLightbox = e.touches[0].clientX;
    });

    lightbox.addEventListener("touchend", (e) => {
      endXLightbox = e.changedTouches[0].clientX;
      handleLightboxSwipe();
    });

    function handleLightboxSwipe() {
      let swipeDistance = endXLightbox - startXLightbox;

      if (Math.abs(swipeDistance) > 50) {
        // distancia mínima para contar como swipe
        if (swipeDistance > 0) {
          // Deslizó a la derecha → imagen anterior
          showPrevSlide();
          showPrevLightboxImage();
        } else {
          // Deslizó a la izquierda → imagen siguiente
          showNextSlide();
          showNextLightboxImage();
        }
        resetAutoplay(); // si quieres que reinicie autoplay
      }
    }
  }
  //fin swipe lightbox moviles

  // ===== Swipe solo en móviles =====
  // ===== Swipe solo en móviles (fix iOS mejorado) =====
  if (window.innerWidth <= 768) {
    let touchStartX = 0;
    let touchMoveX = 0;
    let touchStartY = 0;

    const sliderArea = document.querySelector(".slider-container");

    // Evitar arrastre de imágenes
    slides.forEach((img) => {
      img.addEventListener("dragstart", (e) => e.preventDefault());
    });

    sliderArea.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoveX = touchStartX;
      },
      { passive: true }
    );

    sliderArea.addEventListener(
      "touchmove",
      (e) => {
        const dx = Math.abs(e.touches[0].clientX - touchStartX);
        const dy = Math.abs(e.touches[0].clientY - touchStartY);

        // Solo prevenir scroll si el movimiento es más horizontal que vertical
        if (dx > dy) {
          e.preventDefault();
          touchMoveX = e.touches[0].clientX;
        }
      },
      { passive: false } // importante para poder usar preventDefault en iOS
    );

    sliderArea.addEventListener("touchend", () => {
      const swipeDistance = touchMoveX - touchStartX;

      if (swipeDistance > 50) {
        showPrevSlide();
        resetAutoplay();
      } else if (swipeDistance < -50) {
        showNextSlide();
        resetAutoplay();
      }

      // Reset
      touchStartX = 0;
      touchMoveX = 0;
    });
  }
  function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
  }
  // ===== Iniciar =====
  updateSliderPosition();
});
