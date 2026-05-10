// Mo Amro v6 — Interactive case study components
(function () {
  'use strict';
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const $ = (s, r = document) => r.querySelector(s);

  // Year stamps
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Reveal observer
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
  }

  // Nav tighten
  const navEl = $('nav.site-nav');
  if (navEl) {
    window.addEventListener('scroll', () => {
      navEl.classList.toggle('tight', window.scrollY > 30);
    }, { passive: true });
  }

  // ============================================================
  // KANBAN — drag tasks between columns
  // ============================================================
  const kanban = $('.kanban');
  if (kanban) {
    let draggedTask = null;

    function updateCounts() {
      $$('.kanban-col', kanban).forEach(col => {
        const count = $$('.kanban-task', col).length;
        const counter = $('.kanban-col-count', col);
        if (counter) counter.textContent = count;
      });
    }
    updateCounts();

    $$('.kanban-task', kanban).forEach(task => {
      task.draggable = true;
      task.addEventListener('dragstart', (e) => {
        draggedTask = task;
        task.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });
      task.addEventListener('dragend', () => {
        task.classList.remove('dragging');
        draggedTask = null;
        $$('.kanban-col', kanban).forEach(c => c.classList.remove('drag-over'));
      });
    });

    $$('.kanban-col', kanban).forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.classList.add('drag-over');
      });
      col.addEventListener('dragleave', (e) => {
        // Only remove if we actually left the column (not just entering a child)
        if (!col.contains(e.relatedTarget)) {
          col.classList.remove('drag-over');
        }
      });
      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.classList.remove('drag-over');
        if (draggedTask) {
          col.appendChild(draggedTask);
          updateCounts();
        }
      });
    });

    // Touch support — tap a task to enter "selected" mode, then tap a column
    let selectedTask = null;
    $$('.kanban-task', kanban).forEach(task => {
      task.addEventListener('touchstart', (e) => {
        if (selectedTask === task) {
          selectedTask = null;
          task.classList.remove('dragging');
        } else {
          $$('.kanban-task.dragging', kanban).forEach(t => t.classList.remove('dragging'));
          selectedTask = task;
          task.classList.add('dragging');
        }
      }, { passive: true });
    });
    $$('.kanban-col', kanban).forEach(col => {
      col.addEventListener('touchend', (e) => {
        if (selectedTask && !selectedTask.parentElement.isSameNode(col)) {
          col.appendChild(selectedTask);
          selectedTask.classList.remove('dragging');
          selectedTask = null;
          updateCounts();
        }
      });
    });
  }

  // ============================================================
  // RACI MATRIX — hover/tap cells to show detail
  // ============================================================
  const raci = $('.raci-grid');
  const raciDetail = $('.raci-detail');
  if (raci && raciDetail) {
    function showRaci(cell) {
      const role = cell.dataset.role;
      const phase = cell.dataset.phase;
      const tag = cell.querySelector('.raci-tag')?.textContent;
      const detail = cell.dataset.detail;
      if (role && phase) {
        const tagMap = { R: 'Responsible', A: 'Accountable', C: 'Consulted', I: 'Informed' };
        raciDetail.innerHTML = `<strong>${role}</strong> is <strong>${tagMap[tag] || tag}</strong> for <strong>${phase}</strong> — ${detail || ''}`;
      }
    }
    $$('.raci-cell[data-role]', raci).forEach(cell => {
      cell.addEventListener('mouseenter', () => showRaci(cell));
      cell.addEventListener('click', () => showRaci(cell));
      cell.addEventListener('focus', () => showRaci(cell));
    });
  }

  // ============================================================
  // COUNTER ANIMATION (NetTracePro)
  // Animates from "from" value to "to" value when in viewport
  // ============================================================
  const counters = $$('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }
  function animateCounter(el) {
    const from = parseInt(el.dataset.from || '0', 10);
    const to = parseInt(el.dataset.counter, 10);
    const duration = parseInt(el.dataset.duration || '1800', 10);
    const start = performance.now();
    function tick(now) {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      el.textContent = current.toLocaleString();
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============================================================
  // ============================================================
  // BEFORE / AFTER SLIDER (NetTracePro)
  // Uses Pointer Events so mouse, touch, and pen all use the same code
  // path. setPointerCapture + touch-action: none in CSS prevents the page
  // from scrolling while dragging on touch devices.
  // ============================================================
  $$('.ba-slider').forEach(slider => {
    const after = $('.ba-side.after', slider);
    const handle = $('.ba-handle', slider);
    const knob = $('.ba-knob', slider);
    let activePointer = null;

    function setPos(pct) {
      pct = Math.max(0, Math.min(100, pct));
      if (after) after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      if (handle) handle.style.left = `${pct}%`;
      if (knob) knob.style.left = `${pct}%`;
    }
    setPos(50);

    function pctFromEvent(e) {
      const rect = slider.getBoundingClientRect();
      return ((e.clientX - rect.left) / rect.width) * 100;
    }

    slider.addEventListener('pointerdown', (e) => {
      // Capture this pointer so subsequent moves/up come to us even if the
      // pointer leaves the slider element. This is the trick that makes the
      // drag feel locked to the cursor instead of "slipping" away.
      activePointer = e.pointerId;
      slider.setPointerCapture(e.pointerId);
      slider.classList.add('is-dragging');
      setPos(pctFromEvent(e));
      e.preventDefault();
    });

    slider.addEventListener('pointermove', (e) => {
      if (e.pointerId !== activePointer) return;
      setPos(pctFromEvent(e));
      e.preventDefault();
    });

    function endDrag(e) {
      if (e.pointerId !== activePointer) return;
      try { slider.releasePointerCapture(e.pointerId); } catch (_) {}
      activePointer = null;
      slider.classList.remove('is-dragging');
    }
    slider.addEventListener('pointerup', endDrag);
    slider.addEventListener('pointercancel', endDrag);

    // Keyboard support (focus the slider, use arrow keys)
    slider.setAttribute('tabindex', '0');
    slider.setAttribute('role', 'slider');
    slider.setAttribute('aria-valuemin', '0');
    slider.setAttribute('aria-valuemax', '100');
    slider.setAttribute('aria-valuenow', '50');
    slider.addEventListener('keydown', (e) => {
      const current = parseFloat((after?.style.clipPath || 'inset(0 0 0 50%)').match(/(\d+(\.\d+)?)/)?.[0] || '50');
      let next = current;
      if (e.key === 'ArrowLeft')  next = current - 5;
      if (e.key === 'ArrowRight') next = current + 5;
      if (e.key === 'Home')       next = 0;
      if (e.key === 'End')        next = 100;
      if (next !== current) {
        setPos(next);
        slider.setAttribute('aria-valuenow', String(Math.round(Math.max(0, Math.min(100, next)))));
        e.preventDefault();
      }
    });
  });

  // ============================================================
  // CLIENT MAP (NetTracePro)
  // Click a card to populate detail panel
  // ============================================================
  const clientMap = $('.client-map');
  const clientDetail = $('.client-detail');
  if (clientMap && clientDetail) {
    $$('.client-card', clientMap).forEach(card => {
      card.addEventListener('click', () => {
        $$('.client-card.active', clientMap).forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const name = card.dataset.name;
        const detail = card.dataset.detail;
        clientDetail.innerHTML = `<strong>${name}.</strong> ${detail}`;
      });
      card.addEventListener('mouseenter', () => {
        const name = card.dataset.name;
        const detail = card.dataset.detail;
        if (name && detail) clientDetail.innerHTML = `<strong>${name}.</strong> ${detail}`;
      });
    });
  }

  // ============================================================
  // POS TERMINAL (SimpleTouch)
  // Login → Catalog → Checkout flow
  // ============================================================
  const pos = $('.pos');
  if (pos) {
    let pinValue = '';
    let cart = [];
    const correctPin = '1234';

    const steps = $$('.pos-step', pos);
    const flowSteps = $$('.pos-flow-step', pos);

    function showStep(name) {
      steps.forEach(s => s.classList.toggle('active', s.dataset.step === name));
      flowSteps.forEach(fs => {
        const step = fs.dataset.flow;
        fs.classList.remove('active', 'done');
        if (step === name) fs.classList.add('active');
        else if (
          (name === 'catalog' && step === 'login') ||
          (name === 'checkout' && (step === 'login' || step === 'catalog'))
        ) {
          fs.classList.add('done');
        }
      });
    }

    // PIN keypad logic
    const pinDisplay = $('.pos-pin-display', pos);
    function updatePin() {
      if (pinDisplay) pinDisplay.textContent = '•'.repeat(pinValue.length);
    }
    $$('.pos-key', pos).forEach(key => {
      key.addEventListener('click', () => {
        const v = key.dataset.value;
        if (v === 'clear') {
          pinValue = '';
        } else if (v === 'enter') {
          if (pinValue === correctPin) {
            showStep('catalog');
          } else {
            // Hint: any 4 digits work too, for demo friendliness
            if (pinValue.length === 4) {
              showStep('catalog');
            } else if (pinValue.length === 0) {
              pinValue = correctPin;
              updatePin();
              setTimeout(() => showStep('catalog'), 300);
              return;
            }
          }
        } else {
          if (pinValue.length < 4) {
            pinValue += v;
          }
        }
        updatePin();
      });
    });

    // Catalog item logic
    const total = $('.pos-cat-foot .total', pos);
    const checkoutBtn = $('.pos-checkout', pos);
    function updateTotal() {
      const sum = cart.reduce((s, item) => s + item.price, 0);
      if (total) total.textContent = `$${sum.toFixed(2)}`;
      if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
    }
    updateTotal();

    $$('.pos-item', pos).forEach(item => {
      item.addEventListener('click', () => {
        const name = item.dataset.name;
        const price = parseFloat(item.dataset.price);
        cart.push({ name, price });
        // Visual feedback
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { item.style.transform = ''; }, 120);
        updateTotal();
      });
    });

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;
        const sum = cart.reduce((s, item) => s + item.price, 0);
        const amountEl = $('.pos-success-amount', pos);
        if (amountEl) amountEl.textContent = `$${sum.toFixed(2)} charged · authorization XXX-${Math.floor(Math.random() * 9000) + 1000}`;
        showStep('checkout');
      });
    }

    // Reset button
    const resetBtn = $('.pos-reset', pos);
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        pinValue = '';
        cart = [];
        updatePin();
        updateTotal();
        showStep('login');
      });
    }
  }

  // ============================================================
  // WIREFRAME → FINISHED MORPH (SimpleTouch)
  // - starts at 0 (full wireframe) so the "before" state is unambiguous
  // - track fill grows from left as user drags right (visual feedback)
  // - active label highlights to tell user which end they're closer to
  // - on first scroll-into-view, JS runs a brief DEMO that animates the
  //   slider value from 0 → 30% → back to 0, demonstrating the actual
  //   motion of "drag right to advance the design." Stronger signal than
  //   pulsing because it shows the morph happening live.
  // ============================================================
  $$('.morph').forEach(morph => {
    const slider = $('.morph-slider', morph);
    const canvas = $('.morph-canvas', morph);
    const pct = $('.morph-label .pct', morph);
    const labelLeft  = $('.morph-label:not(.right)', morph);
    const labelRight = $('.morph-label.right', morph);
    if (!slider || !canvas) return;

    function update() {
      const v = parseFloat(slider.value);
      const pctNum = Math.round(v * 100);
      canvas.style.setProperty('--t', v);
      // Drives the linear-gradient track fill in CSS
      slider.style.setProperty('--slider-pct', pctNum + '%');
      if (pct) pct.textContent = pctNum + '%';
      // Active label = whichever end you're closer to. Both lit at exactly 50%.
      if (labelLeft && labelRight) {
        labelLeft.classList.toggle('is-active', v <= 0.5);
        labelRight.classList.toggle('is-active', v >= 0.5);
      }
    }

    let demoAnimationId = null;
    function stopDemo() {
      if (demoAnimationId) {
        cancelAnimationFrame(demoAnimationId);
        demoAnimationId = null;
      }
    }
    function onFirstInteraction() {
      stopDemo();
      morph.classList.add('has-interacted');
      slider.removeEventListener('pointerdown', onFirstInteraction);
      slider.removeEventListener('keydown', onFirstInteraction);
    }
    slider.addEventListener('input', () => {
      // The demo also fires 'input' events while it animates the slider, so
      // we only count this as user interaction if it didn't come from the
      // demo itself. The demo sets a flag before each programmatic update.
      if (!morph.dataset.demoActive) {
        update();
        onFirstInteraction();
      }
    });
    slider.addEventListener('pointerdown', onFirstInteraction);
    slider.addEventListener('keydown', onFirstInteraction);

    // DEMO MOTION: when the section enters the viewport for the first time,
    // animate the slider value from 0 → 0.3 (over 800ms) and back to 0
    // (over 600ms). Total ~1.4s. This is a live preview of what dragging
    // does — visitors see the wireframe start to morph toward the finished
    // design, then snap back, signaling "you do this with the slider."
    function runDemo() {
      if (morph.classList.contains('has-interacted')) return;
      morph.dataset.demoActive = '1';
      const startTime = performance.now();
      const phase1Duration = 800;  // forward to 0.3
      const phase2Duration = 600;  // back to 0
      const peakValue = 0.30;

      function frame(now) {
        if (morph.classList.contains('has-interacted')) {
          delete morph.dataset.demoActive;
          return;
        }
        const elapsed = now - startTime;
        let v;
        if (elapsed < phase1Duration) {
          // Ease-out forward
          const t = elapsed / phase1Duration;
          v = peakValue * (1 - Math.pow(1 - t, 3));
        } else if (elapsed < phase1Duration + phase2Duration) {
          // Ease-in-out back
          const t = (elapsed - phase1Duration) / phase2Duration;
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          v = peakValue * (1 - eased);
        } else {
          // Done — snap back to 0 and clear flag
          slider.value = 0;
          update();
          delete morph.dataset.demoActive;
          demoAnimationId = null;
          return;
        }
        slider.value = v;
        update();
        demoAnimationId = requestAnimationFrame(frame);
      }
      demoAnimationId = requestAnimationFrame(frame);
    }

    // Trigger the demo when the section first enters the viewport. Only
    // runs once — after that, the morph either is or isn't being interacted
    // with by the user.
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting && !morph.classList.contains('has-interacted')) {
            // Small delay so the demo doesn't fire the instant the section
            // peeks into view — wait until it's clearly visible.
            setTimeout(runDemo, 400);
            io.disconnect();
          }
        });
      }, { threshold: 0.4 });
      io.observe(morph);
    }

    update();
  });

  // ============================================================
  // NAV DROPDOWN (Work menu)
  // Tap-to-toggle on touch, hover-to-open via CSS, Escape to close,
  // outside-click to close. Menu also closes on item click.
  // ============================================================
  $$('.nav-has-drop').forEach(container => {
    const trigger = $('.nav-drop-trigger', container);
    const drop = $('.nav-drop', container);
    if (!trigger || !drop) return;

    function open() {
      container.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
    function close() {
      container.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
      container.classList.contains('open') ? close() : open();
    }

    // Tap-to-toggle (works on both touch and click)
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    // Close menu when clicking a dropdown item
    $$('.nav-drop-item', drop).forEach(item => {
      item.addEventListener('click', () => close());
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) close();
    });

    // Escape to close
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        close();
        trigger.focus();
      }
    });
  });

  // ============================================================
  // HERO MESH GRADIENT — soft colored light blobs drifting behind the hero
  // Multiple radial gradient "blobs" (blue, violet, amber) painted to a
  // canvas, each drifting on its own slow path with non-repeating motion.
  // Pure 2D Canvas, no libraries, ~3 KB. Reads as ambient atmospheric
  // lighting — "the room has hidden colored bulbs."
  // ============================================================
  const heroCanvas = $('.hero-canvas');
  if (heroCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = heroCanvas.getContext('2d', { alpha: true });
    let W = 0, H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = heroCanvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      heroCanvas.width = Math.floor(W * dpr);
      heroCanvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Pause when offscreen — battery and CPU friendly.
    let running = true;
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { running = e.isIntersecting; });
      }, { threshold: 0.05 });
      io.observe(heroCanvas);
    }

    // Five blob lights, all in the cool-blue family pulled from the site's
    // design tokens. We get visual depth by varying the SHADE of blue rather
    // than introducing competing hues — deep cobalt through ice. This keeps
    // the hero firmly in the same palette as the rest of the site instead of
    // pulling in violet/amber that would fight the brand.
    //
    //   accent       (138, 180, 255)  — primary cool blue
    //   accent-2     (196, 216, 255)  — pale ice
    //   deep cobalt  ( 90, 140, 235)  — saturated, lower-luma blue
    //   soft sky     (165, 200, 250)  — between accent and accent-2
    //   periwinkle   (115, 155, 245)  — slightly violet-leaning blue (still on-brand)
    const blobs = [
      { color: [ 90, 140, 235], baseX: 0.30, baseY: 0.20, ax: 0.18, ay: 0.12, px: 23, py: 31, radius: 0.55, intensity: 0.55 }, // deep cobalt, top-left
      { color: [138, 180, 255], baseX: 0.75, baseY: 0.30, ax: 0.15, ay: 0.18, px: 29, py: 19, radius: 0.50, intensity: 0.50 }, // accent blue, top-right
      { color: [115, 155, 245], baseX: 0.50, baseY: 0.50, ax: 0.22, ay: 0.10, px: 17, py: 41, radius: 0.65, intensity: 0.55 }, // periwinkle, center
      { color: [165, 200, 250], baseX: 0.25, baseY: 0.75, ax: 0.13, ay: 0.16, px: 37, py: 13, radius: 0.45, intensity: 0.40 }, // soft sky, bottom-left
      { color: [196, 216, 255], baseX: 0.80, baseY: 0.80, ax: 0.16, ay: 0.14, px: 43, py: 11, radius: 0.50, intensity: 0.40 }, // pale ice, bottom-right
    ];

    function drawBlob(b, t) {
      // Position drifts on slow sine paths with prime periods (in seconds-ish units).
      // Times are in milliseconds, so divide by long values to slow it down.
      const x = (b.baseX + Math.sin(t / (b.px * 100)) * b.ax) * W;
      const y = (b.baseY + Math.cos(t / (b.py * 100)) * b.ay) * H;
      const r = Math.min(W, H) * b.radius;
      // Intensity also slow-modulates so blobs breathe.
      const breath = 0.85 + Math.sin(t / 4300 + b.px) * 0.15;
      const alpha = b.intensity * breath;

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      const [cr, cg, cb] = b.color;
      grad.addColorStop(0,    `rgba(${cr},${cg},${cb},${alpha})`);
      grad.addColorStop(0.4,  `rgba(${cr},${cg},${cb},${alpha * 0.4})`);
      grad.addColorStop(1,    `rgba(${cr},${cg},${cb},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    function frame(now) {
      requestAnimationFrame(frame);
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      // Additive blend so where blobs overlap they brighten — gives the
      // mesh-gradient the warm "lit room" feel rather than flat color stacks.
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < blobs.length; i++) {
        drawBlob(blobs[i], now);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(frame);
  }

  // ============================================================
  // HERO PARALLAX TILT — tilts the .hero-inner block based on cursor
  // position so the headline + subhead feel layered into 3D space.
  // - Subtle: 5deg max in either axis. Bigger reads gimmicky.
  // - Frame-rate-friendly: lerp toward target, don't snap.
  // - Skips on touch devices and prefers-reduced-motion users.
  // - Listens on the .hero parent so the cursor doesn't have to be
  //   directly over the text — anywhere in the hero region drives tilt.
  // ============================================================
  const heroEl = $('.hero');
  const heroInner = $('.hero-inner');
  const isTouch = window.matchMedia('(hover: none)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (heroEl && heroInner && !isTouch && !reduced) {
    const MAX_DEG = 5;          // peak tilt at the hero's edge
    const LERP    = 0.12;       // 0..1, higher = snappier follow
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    let isPointerInside = false;
    let rafId = null;

    function tick() {
      currentX += (targetX - currentX) * LERP;
      currentY += (targetY - currentY) * LERP;
      heroInner.style.setProperty('--rx', currentX.toFixed(3) + 'deg');
      heroInner.style.setProperty('--ry', currentY.toFixed(3) + 'deg');
      const settled = Math.abs(targetX - currentX) < 0.01
                   && Math.abs(targetY - currentY) < 0.01;
      if (!settled || isPointerInside) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
        heroInner.classList.remove('is-tilting');
      }
    }

    heroEl.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const rect = heroEl.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      const ny = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
      targetY = -nx * MAX_DEG;
      targetX =  ny * MAX_DEG;
      isPointerInside = true;
      heroInner.classList.add('is-tilting');
      if (rafId === null) rafId = requestAnimationFrame(tick);
    });

    heroEl.addEventListener('pointerleave', () => {
      isPointerInside = false;
      targetX = 0;
      targetY = 0;
      heroInner.classList.remove('is-tilting');
      heroInner.style.setProperty('--rx', '0deg');
      heroInner.style.setProperty('--ry', '0deg');
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }

})();
