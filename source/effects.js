document.addEventListener('DOMContentLoaded', function() {
    // ========== ТВОЙ СУЩЕСТВУЮЩИЙ КОД ==========

    // 1. КОД ДЛЯ КНОПОК С ЧАСТИЦАМИ
    document.querySelectorAll('.glass-btn-particles').forEach(btn => {
        btn.addEventListener('mouseenter', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            for(let i = 0; i < 15; i++) {
                const particle = document.createElement('span');
                particle.classList.add('particle');

                const size = Math.random() * 6 + 3;
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;

                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;

                particle.style.setProperty('--random-x', Math.random() * 2 - 1);
                particle.style.setProperty('--random-y', Math.random() * 2 - 1);

                const duration = Math.random() * 1 + 0.5;
                particle.style.animation = `move ${duration}s linear forwards`;

                btn.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, duration * 1000);
            }
        });
    });

    // 2. ПАРАЛЛАКС ДЛЯ ГЕРОЙ-БЛОКА С ЗУМОМ
    const bg = document.querySelector('.printanit-parallax-bg');
    const content = document.querySelector('.printanit-hero-content');

    if (bg && content) {
        let ticking = false;
        let rafId = null;

        // Параметры зума
        const BASE_SCALE = 1.05;      // базовый масштаб
        const MAX_SCALE = 1.15;       // максимальный масштаб
        const ZOOM_RANGE = 6000;      // за сколько пикселей скролла доходим до MAX_SCALE

        // Параметры движения фона
        const BG_SPEED = 0.7;         // фон движется в 0.7× от скорости скролла
        const CONTENT_SPEED = 0.15;   // текст — ещё медленнее

        function updateParallax() {
            const scrollY = window.scrollY || window.pageYOffset || 0;

            // Плавный зум: от BASE_SCALE при scrollY = 0 до MAX_SCALE при scrollY = ZOOM_RANGE
            const zoomProgress = Math.min(scrollY / ZOOM_RANGE, 1);
            const scale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * zoomProgress;

            // Фон двигается вниз на scrollY * BG_SPEED
            bg.style.transform = `translate3d(0, ${scrollY * BG_SPEED}px, 0) scale(${scale})`;

            // Текст двигается ещё медленнее
            content.style.transform = `translate3d(0, ${scrollY * CONTENT_SPEED}px, 0)`;

            ticking = false;
            rafId = null;
        }

        function onScroll() {
            if (!ticking) {
                ticking = true;
                rafId = requestAnimationFrame(updateParallax);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // Применяем сразу при загрузке — чтобы не было «прыжка»
        onScroll();
    }

    // 3. АНИМАЦИЯ ЦИФР СТАТИСТИКИ
    const stats = document.querySelectorAll('.printanit-stat');

    function animateNumbers() {
        stats.forEach(stat => {
            const numberElement = stat.querySelector('.printanit-number');
            if (numberElement) {
                numberElement.classList.add('animated');
            }
        });
    }

    // Запускаем анимацию цифр при скролле
    if (stats.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        stats.forEach(stat => observer.observe(stat));
    }

    // ========== ЦИФРОВОЙ ДОЖДЬ ==========
    addMatrixRainStyles();
    initMatrixRain();

    // ========== АНИМАЦИЯ ХЛЕБНЫХ КРОШЕК ==========
    const homeIcon = document.querySelector('.breadcrumbs-home i');
    if (homeIcon) {
        homeIcon.addEventListener('mouseenter', () => {
            homeIcon.style.transform = 'scale(1.3) rotate(-10deg)';
        });
        homeIcon.addEventListener('mouseleave', () => {
            homeIcon.style.transform = '';
        });
    }

    // ========== АНИМАЦИЯ БЛОКА "О КОМПАНИИ" ==========
    const aboutSection = document.querySelector('.printanit-about-section');

    if (aboutSection) {
        window.addEventListener('scroll', function() {
            const scrollY = window.scrollY;
            const offset = aboutSection.offsetTop;
            const height = aboutSection.offsetHeight;

            if (scrollY > offset - window.innerHeight && scrollY < offset + height) {
                const progress = (scrollY - offset + window.innerHeight) / (height + window.innerHeight);
                aboutSection.style.backgroundPosition = `center ${-progress * 50}px`;
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.printanit-feature').forEach(feature => {
            observer.observe(feature);
        });
    }

    // ========== ГАЛЕРЕЯ РАБОТ ==========
    const galleryItems = document.querySelectorAll('.printanit-gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const x = e.clientX - item.getBoundingClientRect().left;
            const y = e.clientY - item.getBoundingClientRect().top;
            const centerX = item.offsetWidth / 2;
            const centerY = item.offsetHeight / 2;

            item.style.setProperty('--x-pos', (x - centerX) / 20 + 'px');
            item.style.setProperty('--y-pos', (y - centerY) / 20 + 'px');
        });

        item.addEventListener('mouseleave', () => {
            item.style.setProperty('--x-pos', '0px');
            item.style.setProperty('--y-pos', '0px');
        });
    });

    // ========== АНИМАЦИЯ ЭТАПОВ ==========
    const steps = document.querySelectorAll('.printanit-step-card');

    const stepsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }, 150 * index);
            }
        });
    }, { threshold: 0.1 });

    steps.forEach(step => {
        step.style.opacity = 0;
        step.style.transform = 'translateY(30px)';
        step.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        stepsObserver.observe(step);
    });

    // ========== АНИМАЦИЯ ФУТЕРА ==========
    const footer = document.querySelector('.printanit-footer');
    if (footer) {
        const decoration = footer.querySelector('.footer-decoration');
        if (decoration) {
            const oldBugs = decoration.querySelectorAll('.footer-bug');
            oldBugs.forEach(bug => bug.remove());

            const styleId = 'footer-bugs-animation';
            let style = document.getElementById(styleId);
            if (!style) {
                style = document.createElement('style');
                style.id = styleId;
                document.head.appendChild(style);
            }

            style.textContent = `
                @keyframes bugMove {
                    0% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                    25% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) scale(1.1); opacity: 0.6; }
                    50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) scale(1); opacity: 0.4; }
                    75% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 20 - 10}px) scale(0.9); opacity: 0.6; }
                    100% { transform: translate(0, 0) scale(1); opacity: 0.4; }
                }
            `;

            const colors = [
                'rgba(0, 255, 255, 0.6)',
                'rgba(100, 255, 255, 0.5)',
                'rgba(150, 255, 200, 0.4)'
            ];

            for (let i = 0; i < 5; i++) {
                const bug = document.createElement('div');
                bug.className = 'footer-bug';

                const size = Math.random() * 6 + 4;
                const duration = 15 + Math.random() * 15;
                const delay = Math.random() * 10;
                const color = colors[Math.floor(Math.random() * colors.length)];

                Object.assign(bug.style, {
                    position: 'absolute',
                    width: `${size}px`,
                    height: `${size}px`,
                    background: color,
                    borderRadius: '50%',
                    opacity: '0.4',
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`,
                    animation: `bugMove ${duration}s ${delay}s infinite linear`,
                    filter: 'drop-shadow(0 0 3px currentColor)',
                    zIndex: '-1',
                    pointerEvents: 'none'
                });

                decoration.appendChild(bug);
            }
        }

        const socialIcons = footer.querySelectorAll('.footer-social a');
        if (socialIcons.length > 0) {
            socialIcons.forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    const pulse = document.createElement('span');
                    pulse.style.cssText = `
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: currentColor;
                        animation: pulse 1s ease-out;
                        z-index: -1;
                        opacity: 0;
                    `;
                    icon.appendChild(pulse);

                    setTimeout(() => {
                        pulse.remove();
                    }, 1000);
                });
            });

            const pulseStyle = document.createElement('style');
            pulseStyle.textContent = `
                @keyframes pulse {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
            `;
            document.head.appendChild(pulseStyle);
        }
    }


});




// ========== ФУНКЦИИ ЦИФРОВОГО ДОЖДЯ (ОСТАВЛЯЕМ СНАРУЖИ) ==========
function initMatrixRain() {
  const container = document.getElementById("matrixRain");
  if (!container) return;

  container.innerHTML = '';
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);

  const renderScale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.style.width = '100%';
  canvas.style.height = '160px';
  canvas.width = (container.parentElement.clientWidth || 500) * renderScale;
  canvas.height = 160 * renderScale;

  const ctx = canvas.getContext("2d");
  ctx.scale(renderScale, renderScale);

  const chars = "01カキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンアイウエオ⣾⣽⣻⢿⡿⣟⣯⣷█▓▒░┃┆┇┊┋╱╲╳∙◦•▪▫▬▭▮▯☰☱☲☳☴☵☶☷";

  const charColors = [
    "rgba(0, 255, 255, 0.4)",
    "rgba(255, 255, 255, 0.35)",
    "rgba(255, 200, 220, 0.35)",
    "rgba(200, 255, 255, 0.3)",
    "rgba(255, 255, 240, 0.3)",
    "rgba(255, 150, 180, 0.25)"
  ];

  const drops = [];
  const columnSpacing = 30;
  const columns = Math.floor(canvas.width / renderScale / columnSpacing);
  const activeColumns = Math.floor(columns * 0.6);

  const rainVisibleTop = 0;
  const rainVisibleBottom = 120;
  const rainStart = -50;

  for (let i = 0; i < activeColumns; i++) {
    const columnPos = Math.floor(Math.random() * columns);
    const chainLength = 1 + Math.floor(Math.random() * 2);

    for (let j = 0; j < chainLength; j++) {
      drops.push({
        x: columnPos * columnSpacing + 15,
        y: rainStart - j * 30,
        speed: 0.5 + Math.random() * 0.8,
        char: Math.floor(Math.random() * chars.length),
        color: charColors[Math.floor(Math.random() * charColors.length)],
        changeCounter: 0,
        brightness: 0.8 + Math.random() * 0.2,
        chainIndex: j,
        size: 17 + Math.random() * 5
      });
    }
  }

  const slogan = "СВЕТИСЬ ЯРЧЕ";
  let textX = canvas.width / renderScale / 2;
  let textY = 100;
  let sloganSize = 40;
  function alignSlogan() {
    const row = document.querySelector('.printanit-header-middle-row');
    if (!row || !row.offsetHeight) return;
    textY = row.offsetTop + row.offsetHeight / 2;
    const logo = row.querySelector('.printanit-header-logo').getBoundingClientRect();
    const search = row.querySelector('.printanit-header-search').getBoundingClientRect();
    const bounds = canvas.getBoundingClientRect();
    const left = logo.right + 24;
    const right = search.left - 24;
    textX = (left + right) / 2 - bounds.left;
    ctx.save();
    ctx.font = "800 40px 'Golos Text', sans-serif";
    sloganSize = Math.min(40, Math.max(28, Math.floor((right - left) / ctx.measureText(slogan).width * 40)));
    ctx.restore();
  }
  alignSlogan();
  document.fonts.ready.then(alignSlogan);

    // ========== НОВАЯ ПРОВЕРКА ==========
  // Функция для проверки, нужно ли рисовать текст
  function shouldDrawText() {
      // Не рисуем текст на мобильных устройствах (ширина экрана <= 1024px)
      return window.innerWidth > 1024;
  }
  // ========== КОНЕЦ НОВОЙ ПРОВЕРКИ ==========

  let effects = {
    textOpacity: 1,
    currentColor: '#ffffff',

    fastBlink: {
      counter: 0,
      opacity: 1,
      update: function() {
        this.counter++;
        if (this.counter % 8 === 0) {
          this.opacity = Math.random() < 0.9 ? 1 : (0.6 + Math.random() * 0.3);
        }
        return this.opacity;
      }
    },

    colorChange: {
      timer: 0,
      nextChange: 3000 + Math.random() * 7000,

      update: function() {
        this.timer++;
        if (this.timer > this.nextChange) {
          const rand = Math.random();
          if (rand < 0.4) {
            effects.currentColor = '#00ffff';
          } else if (rand < 0.95) {
            effects.currentColor = '#ffffff';
          } else {
            effects.currentColor = '#ff1493';
          }

          this.timer = 0;
          this.nextChange = 3000 + Math.random() * 9000;
        }
      }
    },

    getGlowColor: function() {
      if (this.currentColor === '#00ffff') {
        return 'rgba(0, 255, 255, 0.8)';
      } else if (this.currentColor === '#ff1493') {
        return 'rgba(255, 20, 147, 0.7)';
      } else {
        return 'rgba(230, 240, 255, 0.9)';
      }
    },

    disappearEffect: {
      active: false,
      start: 0,
      duration: 80,

      trigger: function() {
        if (!this.active && Math.random() < 0.005) {
          this.active = true;
          this.start = Date.now();
        }
      },

      update: function() {
        if (this.active) {
          const elapsed = Date.now() - this.start;
          if (elapsed < this.duration) {
            effects.textOpacity = 0;
          } else {
            effects.textOpacity = 1;
            this.active = false;
          }
        }
      }
    }
  };

  function draw() {
    ctx.clearRect(0, 0, canvas.width / renderScale, canvas.height / renderScale);

    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    drops.forEach(drop => {
      const isVisible = drop.y >= rainVisibleTop && drop.y < rainVisibleBottom;

      if (isVisible) {
        ctx.font = `${drop.size}px 'Golos Text', monospace`;

        const baseColor = drop.color;
        const opacityMatch = baseColor.match(/[\d\.]+(?=\))/);
        if (opacityMatch) {
          const opacity = parseFloat(opacityMatch[0]);
          const newOpacity = opacity * drop.brightness;
          const brightColor = baseColor.replace(/[\d\.]+(?=\))/, newOpacity.toString());

          ctx.fillStyle = brightColor;
          ctx.fillText(chars[drop.char], drop.x, drop.y);

          if (drop.brightness > 0.85) {
            ctx.shadowColor = brightColor.replace(newOpacity.toString(), (newOpacity * 0.5).toString());
            ctx.shadowBlur = 3;
            ctx.fillText(chars[drop.char], drop.x, drop.y);
            ctx.shadowBlur = 0;
          }
        }

        if (drop.changeCounter++ > 10 + Math.random() * 15) {
          drop.char = Math.floor(Math.random() * chars.length);
          drop.changeCounter = 0;
        }
      }

      drop.y += drop.speed;

      if (drop.y > rainVisibleBottom + 50) {
        drop.y = rainStart - Math.random() * 50;
        drop.color = charColors[Math.floor(Math.random() * charColors.length)];
        drop.brightness = 0.8 + Math.random() * 0.2;
      }
    });

    effects.fastBlink.update();
    effects.colorChange.update();
    effects.disappearEffect.trigger();
    effects.disappearEffect.update();

    const blinkOpacity = effects.fastBlink.opacity;
    const totalOpacity = effects.textOpacity * blinkOpacity;
    if (shouldDrawText()) {
      if (totalOpacity > 0.01) {
        ctx.font = `800 ${sloganSize}px 'Golos Text', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const glowColor = effects.getGlowColor();

        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 25;
        ctx.fillStyle = effects.currentColor.replace(')', `, ${totalOpacity * 0.9})`).replace('rgb', 'rgba');
        ctx.fillText(slogan, textX, textY);

        ctx.shadowColor = `rgba(255, 255, 255, ${totalOpacity * 0.7})`;
        ctx.shadowBlur = 15;
        ctx.fillStyle = effects.currentColor === '#ffffff'
          ? `rgba(255, 255, 255, ${totalOpacity * 0.95})`
          : `rgba(255, 255, 255, ${totalOpacity * 0.9})`;
        ctx.fillText(slogan, textX, textY);

        ctx.shadowBlur = 0;
        ctx.fillStyle = `rgba(255, 255, 255, ${totalOpacity})`;
        ctx.fillText(slogan, textX, textY);

        if (blinkOpacity < 0.7 && totalOpacity > 0.5) {
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = '#ffffff';
          ctx.fillText(slogan, textX, textY);
          ctx.globalAlpha = 1;
        }
      }
    }
  }
  function handleResize() {
    canvas.width = (container.parentElement.clientWidth || 500) * renderScale;
    canvas.height = 160 * renderScale;
    ctx.scale(renderScale, renderScale);
    textX = canvas.width / renderScale / 2;
    alignSlogan();
  }

  window.addEventListener('resize', handleResize);
  setInterval(draw, 50);
}









function addMatrixRainStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .printanit-matrix-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 160px;
      z-index: 1;
      background: transparent;
      filter:
        drop-shadow(0 0 20px rgba(100, 255, 255, 0.7))
        drop-shadow(0 0 5px white);
      overflow: visible !important;
    }

    .printanit-matrix-rain {
      width: 100%;
      height: 100%;
      opacity: 0;
      filter:
        drop-shadow(0 0 15px rgba(7, 209, 255, 0.6))
        drop-shadow(0 0 5px rgba(0, 200, 255, 0.4));
      animation: printanit-fadeIn 1s 1s forwards;
    }

    @keyframes printanit-fadeIn {
      to { opacity: 0.7; }
    }

    #fullscreenMatrixRain {
      display: none !important;
    }
  `;

  const oldStyle = document.getElementById('matrix-rain-styles');
  if (oldStyle) oldStyle.remove();

  style.id = 'matrix-rain-styles';
  document.head.appendChild(style);
}

// ========== ПАРАЛЛАКС ГАЛЕРЕЯ ==========
function initParallaxGallery() {
    const parallaxContainer = document.getElementById('parallaxContainer');
    if (!parallaxContainer) return;

    const photos = document.querySelectorAll('.printanit-parallax-photo');
    const gallery = document.querySelector('.printanit-parallax-gallery');

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let isMouseOverGallery = false;
    let rafId = null;
    let hoveredPhoto = null;

    // Система эффектов
    const effectSystem = {
        active: true,
        blinkingPhoto: null,
        disappearingPhoto: null,
        timers: [],

        // Запуск всех эффектов
        start: function() {
            this.active = true;

            // МЕРЦАНИЕ - 2-3 раза в минуту
            const blinkTimer = setInterval(() => {
                if (this.active && !this.blinkingPhoto && !this.disappearingPhoto) {
                    this.triggerBlink();
                }
            }, 20000 + Math.random() * 10000); // 20-30 секунд

            this.timers.push(blinkTimer);

            // ПРОПАДАНИЕ - 1-2 раза в минуту
            const disappearTimer = setInterval(() => {
                if (this.active && !this.disappearingPhoto && !this.blinkingPhoto) {
                    this.triggerDisappear();
                }
            }, 30000 + Math.random() * 15000); // 30-45 секунд

            this.timers.push(disappearTimer);
        },

        // Запустить мерцание
        triggerBlink: function() {
            // Выбираем элементы для мерцания
            const blinkPhotos = Array.from(photos).filter(p =>
                p.dataset.effect === 'blink' &&
                !p.classList.contains('active') &&
                !p.matches(':hover') &&
                p !== hoveredPhoto &&
                p !== this.disappearingPhoto
            );

            if (blinkPhotos.length === 0) return;

            // Выбираем случайный элемент для мерцания
            const randomIndex = Math.floor(Math.random() * blinkPhotos.length);
            this.blinkingPhoto = blinkPhotos[randomIndex];

            // Длительность мерцания 1-1.5 секунды
            const blinkDuration = 1000 + Math.random() * 500;

            // Запускаем мерцание
            const blinkAnimation = `blink-20hz-${parseInt(this.blinkingPhoto.dataset.index) + 1}`;
            this.blinkingPhoto.style.animation = `${blinkAnimation} 0.05s steps(1, end) infinite, ${getFloatAnimationName(this.blinkingPhoto)}`;
            this.blinkingPhoto.style.animationPlayState = 'running, running';

            // Останавливаем мерцание через заданное время
            setTimeout(() => {
                if (this.blinkingPhoto) {
                    // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ
                    this.restoreFloatAnimation(this.blinkingPhoto);
                    this.blinkingPhoto = null;
                }
            }, blinkDuration);
        },

        // Запустить пропадание
        triggerDisappear: function() {
            // Выбираем элементы для пропадания
            const disappearPhotos = Array.from(photos).filter(p =>
                p.dataset.effect === 'disappear' &&
                !p.classList.contains('active') &&
                !p.matches(':hover') &&
                p !== hoveredPhoto &&
                p !== this.blinkingPhoto
            );

            if (disappearPhotos.length === 0) return;

            // Выбираем случайный элемент для пропадания
            const randomIndex = Math.floor(Math.random() * disappearPhotos.length);
            this.disappearingPhoto = disappearPhotos[randomIndex];

            // Длительность пропадания 0.5-1 секунды
            const disappearDuration = 500 + Math.random() * 500;

            // Сохраняем текущую анимацию плавания перед пропаданием
            const floatAnimation = getFloatAnimationName(this.disappearingPhoto);

            // Запускаем анимацию пропадания
            this.disappearingPhoto.style.animation = `disappear-fast ${disappearDuration}ms forwards`;
            this.disappearingPhoto.style.animationPlayState = 'running';

            // МГНОВЕННЫЙ ВОЗВРАТ после завершения анимации
            setTimeout(() => {
                if (this.disappearingPhoto) {
                    // Мгновенное возвращение
                    this.disappearingPhoto.style.animation = `reappear-fast 1ms forwards, ${floatAnimation}`;
                    this.disappearingPhoto.style.animationPlayState = 'running, running';

                    // Возвращаем плавающую анимацию
                    setTimeout(() => {
                        if (this.disappearingPhoto) {
                            // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ
                            this.restoreFloatAnimation(this.disappearingPhoto);
                            this.disappearingPhoto = null;
                        }
                    }, 10);
                }
            }, disappearDuration);
        },

        // Восстановить анимацию плавания
        restoreFloatAnimation: function(photo) {
            const floatAnimation = getFloatAnimationName(photo);
            const duration = getFloatAnimationDuration(photo);
            const delay = getFloatAnimationDelay(photo);

            // Полностью восстанавливаем оригинальную анимацию плавания
            photo.style.animation = `${floatAnimation} ${duration}s ease-in-out infinite alternate`;
            photo.style.animationPlayState = 'running';

            // Устанавливаем задержку через style чтобы она работала
            photo.style.animationDelay = `${delay}s`;
        },

        // Остановить все эффекты
        stop: function() {
            this.active = false;
            this.timers.forEach(timer => clearInterval(timer));
            this.timers = [];

            if (this.blinkingPhoto) {
                this.restoreFloatAnimation(this.blinkingPhoto);
                this.blinkingPhoto = null;
            }

            if (this.disappearingPhoto) {
                this.restoreFloatAnimation(this.disappearingPhoto);
                this.disappearingPhoto = null;
            }
        }
    };

    // Получить имя анимации плавания
    function getFloatAnimationName(photo) {
        const index = parseInt(photo.dataset.index) + 1;
        return `float-smooth-${index}`;
    }

    // Получить длительность анимации плавания
    function getFloatAnimationDuration(photo) {
        const durations = [18, 20, 22, 19, 24];
        const index = parseInt(photo.dataset.index);
        return durations[index] || 20;
    }

    // Получить задержку анимации плавания
    function getFloatAnimationDelay(photo) {
        const delays = [0, 3, 1, 4, 2];
        const index = parseInt(photo.dataset.index);
        return delays[index] || 0;
    }

    // Плавная интерполяция
    function lerp(start, end, factor) {
        return start * (1 - factor) + end * factor;
    }

    // Групповое поведение - все фото реагируют на курсор
    function animateGroupParallax() {
        // Плавное движение к цели
        mouseX = lerp(mouseX, targetX, 0.15);
        mouseY = lerp(mouseY, targetY, 0.15);

        if (isMouseOverGallery) {
            // Групповой параллакс - контейнер вращается
            const rotateY = mouseX * 25;
            const rotateX = -mouseY * 18;

            parallaxContainer.style.transform =
                `perspective(1200px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateZ(${Math.abs(mouseY) * 20}px)`;

            // ВСЕ фото двигаются вместе с курсором
            photos.forEach((photo, index) => {
                if (photo === hoveredPhoto || photo.classList.contains('active')) {
                    return;
                }

                const depth = (index + 1) * 1.2;
                const moveX = mouseX * depth * 35;
                const moveY = mouseY * depth * 30;
                const rotate = mouseX * 8;

                // Получаем базовую позицию из CSS
                const computedStyle = window.getComputedStyle(photo);
                const transform = computedStyle.transform;

                if (transform !== 'none') {
                    const matrix = new DOMMatrixReadOnly(transform);
                    const currentZ = matrix.m43 || (index + 1) * 20;

                    // Плавное движение к цели с групповым эффектом
                    photo.style.transform =
                        `translate3d(${moveX}px, ${moveY}px, ${currentZ}px)
                         rotate(${rotate}deg)`;
                }
            });
        } else {
            // Плавный возврат группы
            mouseX = lerp(mouseX, 0, 0.08);
            mouseY = lerp(mouseY, 0, 0.08);

            parallaxContainer.style.transform =
                `perspective(1200px) rotateX(0) rotateY(0) translateZ(0)`;

            // Плавный возврат всех фото
            if (Math.abs(mouseX) > 0.01 || Math.abs(mouseY) > 0.01) {
                photos.forEach((photo, index) => {
                    if (photo === hoveredPhoto || photo.classList.contains('active')) {
                        return;
                    }

                    const currentTransform = photo.style.transform;
                    if (currentTransform) {
                        const moveX = mouseX * 20;
                        const moveY = mouseY * 20;

                        photo.style.transform = currentTransform.replace(
                            /translate3d\(([^,]+),\s*([^,]+),\s*([^)]+)\)/,
                            `translate3d(${moveX}px, ${moveY}px, $3)`
                        );
                    }
                });
            }
        }

        rafId = requestAnimationFrame(animateGroupParallax);
    }

    // Отслеживание мыши по всей галерее
    if (gallery) {
        gallery.addEventListener('mousemove', function(e) {
            isMouseOverGallery = true;

            const rect = this.getBoundingClientRect();
            targetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            targetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });

        gallery.addEventListener('mouseleave', function() {
            isMouseOverGallery = false;
            targetX = 0;
            targetY = 0;
            hoveredPhoto = null;
        });
    }

    // Обработка наведения на фото
    photos.forEach(photo => {
        let hoverTimeout = null;

        photo.addEventListener('mouseenter', function() {
            hoveredPhoto = this;

            // Останавливаем мерцание если оно было
            if (effectSystem.blinkingPhoto === this) {
                this.style.animation = `${getFloatAnimationName(this)} ${getFloatAnimationDuration(this)}s ease-in-out infinite alternate`;
                this.style.animationPlayState = 'paused';
                this.style.animationDelay = `${getFloatAnimationDelay(this)}s`;
                effectSystem.blinkingPhoto = null;
            }

            // Отменяем пропадание если оно было
            if (effectSystem.disappearingPhoto === this) {
                this.style.animation = `${getFloatAnimationName(this)} ${getFloatAnimationDuration(this)}s ease-in-out infinite alternate`;
                this.style.animationPlayState = 'paused';
                this.style.animationDelay = `${getFloatAnimationDelay(this)}s`;
                effectSystem.disappearingPhoto = null;
            }

            clearTimeout(hoverTimeout);
            this.style.animationPlayState = 'paused';
            this.style.transition = 'all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.classList.add('hovering');
            this.style.opacity = '1';

            hoverTimeout = setTimeout(() => {
                this.classList.add('active');
            }, 200);
        });

        photo.addEventListener('mouseleave', function() {
            hoveredPhoto = null;
            clearTimeout(hoverTimeout);

            // Возвращаем обычную анимацию
            this.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.classList.remove('hovering', 'active');

            // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ
            const floatAnimation = getFloatAnimationName(this);
            const duration = getFloatAnimationDuration(this);
            const delay = getFloatAnimationDelay(this);

            this.style.animation = `${floatAnimation} ${duration}s ease-in-out infinite alternate`;
            this.style.animationPlayState = 'running';
            this.style.animationDelay = `${delay}s`;
            this.style.opacity = '';
        });

        // Клик фиксирует фото
        photo.addEventListener('click', function(e) {
            e.stopPropagation();
            clearTimeout(hoverTimeout);

            // Останавливаем мерцание если оно было
            if (effectSystem.blinkingPhoto === this) {
                this.style.animation = `${getFloatAnimationName(this)} ${getFloatAnimationDuration(this)}s ease-in-out infinite alternate`;
                this.style.animationPlayState = 'paused';
                this.style.animationDelay = `${getFloatAnimationDelay(this)}s`;
                effectSystem.blinkingPhoto = null;
            }

            // Снимаем активность со всех
            photos.forEach(p => {
                p.classList.remove('active');
                // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ ДЛЯ ВСЕХ
                if (effectSystem.blinkingPhoto !== p && effectSystem.disappearingPhoto !== p) {
                    const floatAnimation = getFloatAnimationName(p);
                    const duration = getFloatAnimationDuration(p);
                    const delay = getFloatAnimationDelay(p);

                    p.style.animation = `${floatAnimation} ${duration}s ease-in-out infinite alternate`;
                    p.style.animationPlayState = 'running';
                    p.style.animationDelay = `${delay}s`;
                    p.style.opacity = '';
                }
            });

            // Активируем выбранное
            this.style.transition = 'all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            this.classList.add('active');
            this.style.animationPlayState = 'paused';
            this.style.opacity = '1';

            // Возвращаем через 4 секунды
            setTimeout(() => {
                if (this.classList.contains('active')) {
                    this.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    this.classList.remove('active');

                    // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ
                    const floatAnimation = getFloatAnimationName(this);
                    const duration = getFloatAnimationDuration(this);
                    const delay = getFloatAnimationDelay(this);

                    this.style.animation = `${floatAnimation} ${duration}s ease-in-out infinite alternate`;
                    this.style.animationPlayState = 'running';
                    this.style.animationDelay = `${delay}s`;
                    this.style.opacity = '';
                }
            }, 4000);
        });
    });

    // Сброс при клике на галерею
    if (gallery) {
        gallery.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('printanit-parallax-container')) {
                photos.forEach(p => {
                    p.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                    p.classList.remove('active');

                    // ВОССТАНАВЛИВАЕМ АНИМАЦИЮ ПЛАВАНИЯ
                    if (effectSystem.blinkingPhoto !== p && effectSystem.disappearingPhoto !== p) {
                        const floatAnimation = getFloatAnimationName(p);
                        const duration = getFloatAnimationDuration(p);
                        const delay = getFloatAnimationDelay(p);

                        p.style.animation = `${floatAnimation} ${duration}s ease-in-out infinite alternate`;
                        p.style.animationPlayState = 'running';
                        p.style.animationDelay = `${delay}s`;
                        p.style.opacity = '';
                    }
                });
            }
        });
    }

    // Запускаем анимацию параллакса
    animateGroupParallax();

    // Запускаем систему эффектов с задержкой
    setTimeout(() => {
        effectSystem.start();
    }, 5000);

    // Остановка при уходе со страницы
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            effectSystem.stop();
        } else {
            if (!rafId) {
                animateGroupParallax();
            }
            if (!effectSystem.active) {
                setTimeout(() => {
                    effectSystem.start();
                }, 5000);
            }
        }
    });
}

// Инициализируем параллакс галерею если она есть на странице
if (document.getElementById('parallaxContainer')) {
    // Ждем полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParallaxGallery);
    } else {
        initParallaxGallery();
    }
}


/*--------------------------Скрипт для single-product--------------------------------*/
/**
 * CUSTOM.JS - Все JavaScript функции для сайта Outdoor
 * Включает:
 * - Галерею товаров с эффектами
 * - Выпадающее меню категорий
 * - Обработку форм
 * - И другие эффекты
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('CUSTOM.JS: Инициализация...');

    // ============================================
    // 1. ГАЛЕРЕЯ ТОВАРОВ (single-product)
    // ============================================
    initProductGallery();

    // ============================================
    // 2. ВЫПАДАЮЩЕЕ МЕНЮ КАТЕГОРИЙ
    // ============================================
    initCategoryDropdown();

       // ============================================
    // 5. ЭФФЕКТЫ ДЛЯ ГАЛЕРЕИ (цифровой дождь и т.д.)
    // ============================================
    // Эти функции уже есть в вашем custom.js
    // initMatrixRain();
    // initParallaxGallery();
});

// ============================================
// ФУНКЦИЯ 1: ГАЛЕРЕЯ ТОВАРОВ
// ============================================
function initProductGallery() {
    console.log('Инициализация галереи товаров');

    // Получаем элементы галереи
    let mainImage = document.getElementById('sp-main-image');
    const thumbItems = document.querySelectorAll('.sp-thumb-item');
    const prevBtn = document.querySelector('.sp-gallery-prev');
    const nextBtn = document.querySelector('.sp-gallery-next');
    const currentIndexSpan = document.querySelector('.sp-current-index');
    const scrollArea = document.querySelector('.sp-thumbnails-scroll');

    console.log('mainImage:', mainImage);
    console.log('thumbItems:', thumbItems.length);
    console.log('prevBtn:', prevBtn);
    console.log('nextBtn:', nextBtn);
    console.log('scrollArea:', scrollArea);

    if (!mainImage || thumbItems.length === 0) {
        console.log('НЕТ ЭЛЕМЕНТОВ ГАЛЕРЕИ');
        return;
    }

    let currentIndex = 0;
    let lastEffect = 'glitch';

    // Добавляем стили для эффектов, если их еще нет
    if (!document.getElementById('product-effects-style')) {
        const style = document.createElement('style');
        style.id = 'product-effects-style';
        style.textContent = `
            @keyframes glitch {
                0% {
                    transform: translate(0);
                    filter: drop-shadow(-2px 0 #ff0000) drop-shadow(2px 0 #0000ff);
                    opacity: 0.9;
                }
                10% {
                    transform: translate(-2px, 1px);
                    filter: drop-shadow(-4px 0 #ff0000) drop-shadow(4px 0 #0000ff);
                }
                20% {
                    transform: translate(2px, -1px);
                    filter: drop-shadow(4px 0 #ff0000) drop-shadow(-4px 0 #0000ff);
                }
                30% {
                    transform: translate(-3px, 2px);
                    filter: drop-shadow(-6px 0 #ff0000) drop-shadow(6px 0 #00ff00);
                }
                40% {
                    transform: translate(3px, -2px);
                    filter: drop-shadow(6px 0 #0000ff) drop-shadow(-6px 0 #ff0000);
                }
                50% {
                    transform: translate(-2px, 1px);
                    filter: drop-shadow(-4px 0 #00ff00) drop-shadow(4px 0 #ff0000);
                }
                60% {
                    transform: translate(2px, -1px);
                    filter: drop-shadow(4px 0 #0000ff) drop-shadow(-4px 0 #00ff00);
                }
                70% {
                    transform: translate(-1px, 0.5px);
                    filter: drop-shadow(-2px 0 #ff0000) drop-shadow(2px 0 #0000ff);
                }
                80% {
                    transform: translate(1px, -0.5px);
                    filter: drop-shadow(2px 0 #00ff00) drop-shadow(-2px 0 #ff0000);
                }
                90% {
                    transform: translate(0);
                    filter: drop-shadow(0 0 transparent);
                }
                100% {
                    transform: translate(0);
                    filter: drop-shadow(0 0 transparent);
                    opacity: 1;
                }
            }

            .sp-main-image.glitch-effect {
                animation: glitch 0.3s ease-out;
            }

            @keyframes neon-flash {
                0% {
                    filter: brightness(1) saturate(1) hue-rotate(0deg);
                    box-shadow: 0 0 0 rgba(0, 255, 255, 0);
                }
                15% {
                    filter: brightness(2) saturate(2.5) hue-rotate(15deg);
                    box-shadow: 0 0 40px rgba(0, 255, 255, 0.9), 0 0 80px rgba(0, 255, 255, 0.5);
                }
                30% {
                    filter: brightness(1.6) saturate(2) hue-rotate(-5deg);
                    box-shadow: 0 0 30px rgba(0, 255, 255, 0.7), 0 0 60px rgba(0, 255, 255, 0.4);
                }
                45% {
                    filter: brightness(2.2) saturate(2.8) hue-rotate(10deg);
                    box-shadow: 0 0 50px rgba(0, 255, 255, 1), 0 0 100px rgba(0, 255, 255, 0.6);
                }
                60% {
                    filter: brightness(1.8) saturate(2.2) hue-rotate(-8deg);
                    box-shadow: 0 0 35px rgba(0, 255, 255, 0.8), 0 0 70px rgba(0, 255, 255, 0.5);
                }
                75% {
                    filter: brightness(1.4) saturate(1.6) hue-rotate(5deg);
                    box-shadow: 0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(0, 255, 255, 0.3);
                }
                90% {
                    filter: brightness(1.1) saturate(1.1) hue-rotate(0deg);
                    box-shadow: 0 0 5px rgba(0, 255, 255, 0.2);
                }
                100% {
                    filter: brightness(1) saturate(1) hue-rotate(0deg);
                    box-shadow: 0 0 0 rgba(0, 255, 255, 0);
                }
            }

            .sp-main-image.neon-effect {
                animation: neon-flash 0.45s ease-out;
            }
        `;
        document.head.appendChild(style);
    }

    // Функция прокрутки миниатюр
    function scrollToThumb(index) {
        if (!scrollArea) return;

        const activeThumb = thumbItems[index];
        if (!activeThumb) return;

        const thumbTop = activeThumb.offsetTop;
        const scrollTop = scrollArea.scrollTop;
        const scrollHeight = scrollArea.clientHeight;
        const thumbHeight = activeThumb.offsetHeight;

        if (thumbTop < scrollTop || thumbTop > scrollTop + scrollHeight - thumbHeight) {
            scrollArea.scrollTo({
                top: thumbTop - (scrollHeight/2) + (thumbHeight/2),
                behavior: 'smooth'
            });
        }
    }

    function getNextEffect() {
        lastEffect = lastEffect === 'glitch' ? 'neon' : 'glitch';
        return lastEffect === 'glitch' ? 'glitch-effect' : 'neon-effect';
    }

    function changePhoto(index) {
        console.log('changePhoto вызван с index:', index);

        if (index < 0) index = thumbItems.length - 1;
        if (index >= thumbItems.length) index = 0;

        currentIndex = index;

        thumbItems.forEach(item => {
            item.classList.remove('sp-thumb-active');
        });

        const activeThumb = thumbItems[index];
        activeThumb.classList.add('sp-thumb-active');

        scrollToThumb(index);

        const thumbImg = activeThumb.querySelector('.sp-thumb-image');
        if (thumbImg) {
            const newSrc = thumbImg.dataset.fullSrc || thumbImg.src;
            console.log('Новый URL:', newSrc);

            const container = mainImage.parentNode;
            const oldAlt = mainImage.alt;
            const oldClass = mainImage.className;
            const oldId = mainImage.id;
            const oldDataset = {...mainImage.dataset};

            const effectClass = getNextEffect();

            const newImage = document.createElement('img');
            newImage.id = oldId;
            newImage.className = oldClass + ' ' + effectClass;
            newImage.src = newSrc + '?t=' + new Date().getTime();
            newImage.alt = oldAlt;
            newImage.style.width = '100%';
            newImage.style.height = '100%';
            newImage.style.objectFit = 'cover';
            newImage.style.display = 'block';
            newImage.style.visibility = 'visible';
            newImage.style.opacity = '1';

            newImage.dataset.fullSrc = newSrc;
            if (oldDataset.id) newImage.dataset.id = oldDataset.id;

            container.removeChild(mainImage);
            container.appendChild(newImage);
            mainImage = newImage;

            setTimeout(() => {
                mainImage.classList.remove('glitch-effect', 'neon-effect');
            }, 500);

            // Добавляем обработчик клика для нового изображения
            mainImage.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openGalleryLightbox();
            });

            console.log('Изображение заменено на новое с эффектом:', effectClass);
        }

        if (currentIndexSpan) {
            currentIndexSpan.textContent = currentIndex + 1;
        }
    }

    // Функция открытия лайтбокса
    function openGalleryLightbox() {
        console.log('Открываем модалку галереи');

        const scrollPosition = window.pageYOffset;
        sessionStorage.setItem('cyberLightboxScroll', scrollPosition);

        const galleryImages = [];
        document.querySelectorAll('.sp-thumb-image').forEach(img => {
            const fullSrc = img.dataset.fullSrc || img.src.replace(/-[0-9]+x[0-9]+\./g, '.');
            galleryImages.push({
                src: fullSrc,
                title: document.querySelector('.printanit-hero-title')?.textContent || 'Товар'
            });
        });

        if (typeof window.openCyberLightbox === 'function') {
            window.openCyberLightbox(galleryImages, document.querySelector('.printanit-hero-title')?.textContent || 'Товар', currentIndex);
        }
    }

    // Навешиваем обработчики
    thumbItems.forEach((thumb, index) => {
        thumb.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по миниатюре', index);
            changePhoto(index);
        });
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по prev, currentIndex =', currentIndex);
            changePhoto(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Клик по next, currentIndex =', currentIndex);
            changePhoto(currentIndex + 1);
        });
    }

    if (mainImage) {
        mainImage.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openGalleryLightbox();
        });
    }

    if (scrollArea) {
        scrollArea.addEventListener('wheel', function(e) {
            if (window.innerWidth > 768) {
                e.preventDefault();
                this.scrollTop += e.deltaY;
            }
        });
    }

    console.log('Галерея товаров инициализирована');
}

// ============================================
// ФУНКЦИЯ 2: ВЫПАДАЮЩЕЕ МЕНЮ КАТЕГОРИЙ
// ============================================
function initCategoryDropdown() {
    console.log('Инициализация выпадающего меню категорий');

    const sidebar = document.querySelector('.printanit-categories-sidebar');
    if (!sidebar) return;

    const title = sidebar.querySelector('.categories-sidebar-title');
    if (!title) return;

    // Вешаем обработчик на заголовок
    title.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
        sidebar.classList.toggle('expanded');
    });

    // Закрываем при клике вне меню (только на мобильных)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && sidebar.classList.contains('expanded')) {
                title.classList.remove('active');
                sidebar.classList.remove('expanded');
            }
        }
    });

    // Сбрасываем при изменении размера окна
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024) {
            // На десктопе всегда показываем меню
            title.classList.remove('active');
            sidebar.classList.remove('expanded');
        }
    });

    console.log('Выпадающее меню категорий инициализировано');
}


// ============================================
// ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ: Обновление при resize
// ============================================
window.addEventListener('resize', function() {
    // Обновляем состояние дропдауна при изменении размера окна
    const sidebar = document.querySelector('.printanit-categories-sidebar');
    const title = document.querySelector('.categories-sidebar-title');

    if (sidebar && title) {
        if (window.innerWidth > 1024) {
            title.classList.remove('active');
            sidebar.classList.remove('expanded');
        }
    }
});

console.log('CUSTOM.JS: Загружен и готов к работе');


// Принудительная перестановка блоков для мобильных
function reorderMobileBlocks() {
    if (window.innerWidth <= 1024) {
        const mainGrid = document.querySelector('.product-main-grid');
        if (!mainGrid) return;

        const gallery = document.querySelector('.product-gallery-block');
        const materials = document.querySelector('.product-materials-block');
        const sidebar = document.querySelector('.product-sidebar');
        const specs = document.querySelector('.product-specs-block');
        const description = document.querySelector('.product-description-block');

        // Очищаем контейнер
        if (gallery && materials && sidebar && description) {
            // Сохраняем все блоки в правильном порядке
            const blocks = [];

            if (gallery) blocks.push(gallery);
            if (materials) blocks.push(materials);
            if (sidebar) blocks.push(sidebar);
            if (specs) blocks.push(specs);
            if (description) blocks.push(description);

            // Удаляем все блоки из DOM
            blocks.forEach(block => {
                if (block.parentNode) {
                    block.parentNode.removeChild(block);
                }
            });

            // Вставляем в правильном порядке
            blocks.forEach(block => {
                mainGrid.appendChild(block);
            });

            console.log('Блоки переставлены в правильном порядке');
        }
    }
}

// Запускаем при загрузке и при изменении размера окна
document.addEventListener('DOMContentLoaded', reorderMobileBlocks);
window.addEventListener('resize', function() {
    if (window.innerWidth <= 1024) {
        reorderMobileBlocks();
    }
});

/*-------------------закончился скрипт для single-product-----------------*/
