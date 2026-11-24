(() => {
  const looks = [
    { id: "pop",    label: "Pop Art",   tag: "01 · Pop Art",   before: "./assets/hero-tulip-orig.jpg", focusY: "32%", defaultSplit: 47 },
    { id: "diag",   label: "Diagonal",  tag: "02 · Diagonal",  before: null,                           focusY: "40%", defaultSplit: 0  },
    { id: "torn",   label: "Torn Edge", tag: "03 · Torn Edge", before: "./assets/hero-torn-orig.jpg",  focusY: "28%", defaultSplit: 47 },
    { id: "ripped", label: "Ripped Up", tag: "04 · Ripped Up", before: null,                           focusY: "34%", defaultSplit: 0  }
  ];

  let index = 0;
  let splitPct = 47;
  let introRaf = null;
  let userInteracted = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const imgs = document.querySelectorAll(".stage-img");
  const pills = document.querySelectorAll(".stage-pill");
  const beforeLayer = document.getElementById("beforeLayer");
  const divider = document.getElementById("stageDivider");
  const tagBefore = document.getElementById("tagBefore");
  const tagAfter = document.getElementById("tagAfter");
  const stage = document.getElementById("heroStage");

  if (!stage || !beforeLayer || !divider) return;

  function cancelIntro() {
    if (introRaf) {
      cancelAnimationFrame(introRaf);
      introRaf = null;
    }
  }

  function setCompare(pct) {
    const item = looks[index];
    const clamped = item.before ? Math.max(0, Math.min(100, pct)) : 0;
    splitPct = clamped;
    beforeLayer.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    divider.style.left = `${clamped}%`;
    divider.setAttribute("aria-valuenow", String(Math.round(clamped)));
    const hasSplit = Boolean(item.before);
    divider.classList.toggle("active", hasSplit);
    if (tagBefore) {
      tagBefore.classList.toggle("visible", hasSplit && clamped > 16);
    }
    if (tagAfter) {
      tagAfter.textContent = hasSplit ? item.label : item.tag;
      tagAfter.classList.toggle("visible", !hasSplit || clamped < 84);
    }
  }

  function showLook(i, animatePeek = false) {
    cancelIntro();
    index = i;
    const item = looks[i];
    stage.style.setProperty("--focus-y", item.focusY);

    imgs.forEach((im) => im.classList.toggle("active", im.dataset.look === item.id));
    pills.forEach((p, idx) => {
      const active = idx === i;
      p.classList.toggle("active", active);
      p.setAttribute("aria-selected", String(active));
    });

    if (item.before) {
      beforeLayer.src = item.before;
      stage.classList.add("has-compare");
      setCompare(item.defaultSplit);
      if (animatePeek && !reduced) {
        // Gentle intro nudge (47% -> 58% -> 46%) so Frame 0 is already the 50/50 split portrait
        const t0 = performance.now() + 650;
        const d1 = 480;
        const d2 = 640;
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const step = (now) => {
          if (userInteracted) return;
          if (now < t0) {
            introRaf = requestAnimationFrame(step);
            return;
          }
          const elapsed = now - t0;
          if (elapsed <= d1) {
            const k = ease(elapsed / d1);
            setCompare(47 + 11 * k);
            introRaf = requestAnimationFrame(step);
          } else if (elapsed <= d1 + d2) {
            const k = ease((elapsed - d1) / d2);
            setCompare(58 - 12 * k);
            introRaf = requestAnimationFrame(step);
          } else {
            setCompare(46);
            introRaf = null;
          }
        };
        introRaf = requestAnimationFrame(step);
      }
    } else {
      stage.classList.remove("has-compare");
      setCompare(0);
    }
  }

  pills.forEach((pill, i) => {
    pill.addEventListener("click", () => {
      userInteracted = true;
      showLook(i, false);
    });
  });

  function updateFromClientX(clientX) {
    const r = stage.getBoundingClientRect();
    if (!r.width) return;
    setCompare(((clientX - r.left) / r.width) * 100);
  }

  let dragging = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".stage-pills") || !looks[index].before) return;
    dragging = true;
    userInteracted = true;
    cancelIntro();
    stage.classList.add("dragging");
    if (stage.setPointerCapture) {
      try { stage.setPointerCapture(e.pointerId); } catch (_) {}
    }
    updateFromClientX(e.clientX);
  });

  stage.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    updateFromClientX(e.clientX);
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove("dragging");
  };
  stage.addEventListener("pointerup", endDrag);
  stage.addEventListener("pointercancel", endDrag);

  divider.addEventListener("keydown", (e) => {
    if (!looks[index].before) return;
    if (e.key === "ArrowLeft") {
      userInteracted = true;
      cancelIntro();
      setCompare(splitPct - 6);
    } else if (e.key === "ArrowRight") {
      userInteracted = true;
      cancelIntro();
      setCompare(splitPct + 6);
    }
  });

  // Sticky Mobile CTA Bar: show ONLY after the user actually scrolls PAST #heroCta (never on load!)
  const stickyBar = document.getElementById("stickyCta");
  const heroCta = document.getElementById("heroCta");
  const closingCta = document.getElementById("download");
  if (stickyBar && heroCta && closingCta) {
    let ticking = false;
    const syncSticky = () => {
      ticking = false;
      const heroRect = heroCta.getBoundingClientRect();
      const closeRect = closingCta.getBoundingClientRect();
      const passedHero = heroRect.bottom < 0;
      const nearClosing = closeRect.top < window.innerHeight - 60;
      stickyBar.classList.toggle("visible", passedHero && !nearClosing);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(syncSticky);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    syncSticky();
  }

  showLook(0, true);
})();
