document.addEventListener("DOMContentLoaded", () => {
  // ===== Menú hamburguesa para móviles =====
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");
  //slide
  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");
  const totalSlides = slides.length;
  const slider = document.querySelector(".slider");
  const intervalTime = 5000; // 5 segundos

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
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
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

  document.querySelector(".next").addEventListener("click", showNextSlide);
  document.querySelector(".prev").addEventListener("click", showPrevSlide);

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
  });
  lightboxNext.addEventListener("click", (e) => {
    e.stopPropagation();
    showNextLightboxImage();
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
});
