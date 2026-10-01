/**
 * TEBE - Consultoria em Inteligência Artificial
 * Interatividade, Animação de Rede Neural & Formulário
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar ícones Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Canvas de Rede Neural Interativa
  initNeuralCanvas();

  // 3. Menu Mobile
  initMobileMenu();

  // 4. Scroll Spy & Navbar Efeito
  initScrollEffects();

  // 5. Formulário de Contato e Modal
  initContactForm();

  // 6. Botão Voltar ao Topo
  initBackToTop();
});

/**
 * Animação de Canvas: Rede Neural com partículas conectadas
 */
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 150 };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
    createParticles();
  }

  window.addEventListener('resize', resize);
  
  // Rastreamento do mouse
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    } else {
      mouse.x = null;
      mouse.y = null;
    }
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1.2;
      this.baseColor = Math.random() > 0.4 ? '6, 182, 212' : '99, 102, 241'; // Cyan ou Indigo
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Interação suave com mouse
      if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          let force = (mouse.radius - distance) / mouse.radius;
          let angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.baseColor}, 0.85)`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${this.baseColor}, 0.5)`;
      ctx.fill();
      ctx.shadowBlur = 0; // reset
    }
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((width * height) / 12000); // densidade equilibrada
    const particleCount = Math.min(Math.max(count, 35), 90);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Conectar nós próximos
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          let opacity = 1 - dist / 130;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.25})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Conectar com o mouse se estiver perto
      if (mouse.x !== null && mouse.y !== null) {
        let dx = particles[i].x - mouse.x;
        let dy = particles[i].y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          let opacity = 1 - dist / mouse.radius;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.4})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
}

/**
 * Controle de Menu Mobile Responsivo
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu() {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
    } else {
      mobileMenu.classList.add('hidden');
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Fechar menu ao clicar em qualquer link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });

  // Fechar se clicar fora
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target) && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
    }
  });
}

/**
 * Scroll Spy e estilização dinâmica do Navbar
 */
function initScrollEffects() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Navbar background blur/border effect
    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('shadow-xl', 'shadow-black/40', 'bg-[#05070f]/95');
      } else {
        navbar.classList.remove('shadow-xl', 'shadow-black/40', 'bg-[#05070f]/95');
      }
    }

    // Scroll Spy active link update
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });
}

/**
 * Formulário de Contato com Validação e Feedback
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');
  const btnIcon = document.getElementById('btn-icon');
  const btnSpinner = document.getElementById('btn-spinner');
  const successModal = document.getElementById('success-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  if (!form) return;

  // Validação simples de e-mail
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const phoneError = document.getElementById('phone-error');
    const messageError = document.getElementById('message-error');

    let isValid = true;

    // Validação Nome
    if (!nameInput.value.trim()) {
      nameError.classList.remove('hidden');
      nameInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      nameError.classList.add('hidden');
      nameInput.classList.remove('border-rose-500');
    }

    // Validação Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
      emailError.classList.remove('hidden');
      emailInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      emailError.classList.add('hidden');
      emailInput.classList.remove('border-rose-500');
    }

    // Validação Telefone
    if (!phoneInput.value.trim()) {
      phoneError.classList.remove('hidden');
      phoneInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      phoneError.classList.add('hidden');
      phoneInput.classList.remove('border-rose-500');
    }

    // Validação Mensagem
    if (!messageInput.value.trim()) {
      messageError.classList.remove('hidden');
      messageInput.classList.add('border-rose-500');
      isValid = false;
    } else {
      messageError.classList.add('hidden');
      messageInput.classList.remove('border-rose-500');
    }

    if (!isValid) return;

    // Estado de carregamento no botão
    btnText.textContent = 'Enviando...';
    btnIcon.classList.add('hidden');
    btnSpinner.classList.remove('hidden');
    submitBtn.disabled = true;

    // Simulação de envio com retorno ágil
    setTimeout(() => {
      btnText.textContent = 'Entrar em contato';
      btnIcon.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      submitBtn.disabled = false;

      // Abrir modal de sucesso
      if (successModal) {
        successModal.classList.remove('hidden');
        setTimeout(() => {
          successModal.classList.remove('opacity-0');
          successModal.querySelector('div').classList.remove('scale-95');
        }, 10);
      }

      form.reset();
    }, 900);
  });

  // Fechar Modal
  if (closeModalBtn && successModal) {
    function closeModal() {
      successModal.classList.add('opacity-0');
      successModal.querySelector('div').classList.add('scale-95');
      setTimeout(() => {
        successModal.classList.add('hidden');
      }, 300);
    }

    closeModalBtn.addEventListener('click', closeModal);
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !successModal.classList.contains('hidden')) {
        closeModal();
      }
    });
  }
}

/**
 * Botão Voltar ao Topo
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none');
      backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
