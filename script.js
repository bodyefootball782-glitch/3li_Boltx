// BOLTX website settings
// Put the YouTube video ID (the part after v= in a video URL) below to feature it.
const LATEST_YOUTUBE_VIDEO_ID = "_bCSdCamM1U"; // Example: "dQw4w9WgXcQ"

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Mobile navigation
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  toggle?.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  }));

  // Scroll reveal; fallback keeps content visible if observer is unavailable.
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("visible"));
  }

  // Optional featured YouTube video (set the ID above).
  if (LATEST_YOUTUBE_VIDEO_ID.trim()) {
    const id = encodeURIComponent(LATEST_YOUTUBE_VIDEO_ID.trim());
    const preview = document.querySelector(".video-preview");
    preview.innerHTML = `<img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="أحدث فيديو من BOLTX" loading="lazy" style="width:100%;height:100%;min-height:270px;object-fit:cover;display:block"><div class="video-overlay"><span>▶</span> WATCH VIDEO</div>`;
    preview.href = `https://www.youtube.com/watch?v=${id}`;
    document.getElementById("latestButton").href = `https://www.youtube.com/watch?v=${id}`;
    document.getElementById("latestTitle").textContent = "أحدث فيديوهات BOLTX";
  }

  // Five-photo gallery lightbox: only opens when a real image has been added.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  document.querySelectorAll(".gallery-item").forEach(button => {
    const img = button.querySelector("img");
    img.addEventListener("error", () => { img.style.display = "none"; });
    img.addEventListener("load", () => { img.style.display = "block"; button.querySelector(".gallery-fallback").style.display = "none"; });
    button.addEventListener("click", () => {
      if (img.style.display === "none" || !img.naturalWidth) return;
      lightboxImage.src = img.src;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });
  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.src = "";
    document.body.style.overflow = "";
  };
  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

  // Lightweight ambient particles drawn on a small canvas.
  const canvas = document.getElementById("particles");
  const ctx = canvas?.getContext("2d", { alpha: true });
  if (!canvas || !ctx || reduceMotion) return;
  let width = 0, height = 0, particles = [], raf = 0;
  const isMobile = window.matchMedia("(max-width: 620px)").matches;
  const count = isMobile ? 18 : 42;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = window.innerWidth; height = window.innerHeight;
    canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({length: count}, () => ({
      x: Math.random() * width, y: Math.random() * height,
      r: Math.random() * 1.5 + .4, vy: Math.random() * .22 + .08,
      vx: (Math.random() - .5) * .16, a: Math.random() * .48 + .15
    }));
  }
  function draw() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx; p.y -= p.vy;
      if (p.y < -5) { p.y = height + 5; p.x = Math.random() * width; }
      if (p.x < -5) p.x = width + 5;
      if (p.x > width + 5) p.x = -5;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(196,125,255,${p.a})`; ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }
  resize(); draw();
  let resizeTimer;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resize(); draw(); }, 180);
  }, { passive: true });
})();
