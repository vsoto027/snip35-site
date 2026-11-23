(() => {
  const looks = [
    { id: "pop",    label: "01 · Pop Art",   before: "./assets/hero-pop-orig.jpg" },
    { id: "torn",   label: "02 · Torn Edge", before: "./assets/hero-torn-orig.jpg" },
    { id: "diag",   label: "03 · Diagonal",  before: null },
    { id: "ripped", label: "04 · Ripped Up", before: null }
  ];

  let index = 0;
  let timer = null;
  let userPinned = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const imgs = document.querySelectorAll(".stage-img");
  const pills = document.querySelectorAll(".stage-pill");
  const badge = document.getElementById("stageBadge");
  const beforeLayer = document.getElementById("beforeLayer");
  const divider = document.getElementById("stageDivider");
  const compareBtn = document.getElementById("compareBtn");
  const stage = document.getElementById("heroStage");

  if (!stage || !badge || !beforeLayer || !divider || !compareBtn) return;

  function showLook(i) {
    index = i;
    const item = looks[i];
    imgs.forEach((im) => im.classList.toggle("active", im.dataset.look === item.id));
    pills.forEach((p, idx) => {
      const active = idx === i;
      p.classList.toggle("active", active);
      p.setAttribute("aria-selected", String(active));
    });
    badge.textContent = item.label;
    if (item.before) {
      beforeLayer.src = item.before;
      compareBtn.classList.remove("hidden");
    } else {
      compareBtn.classList.add("hidden");
    }
    setCompare(0);
  }

  function setCompare(pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    beforeLayer.style.clipPath = `inset(0 ${100 - clamped}% 0 0)`;
    divider.style.left = `${clamped}%`;
    divider.style.opacity = clamped > 1 && clamped < 99 ? "1" : "0";
  }

  function startAuto() {
    if (reduced || timer) return;
    timer = setInterval(() => {
      if (!userPinned) showLook((index + 1) % looks.length);
    }, 4600);
  }

  pills.forEach((pill, i) => {
    pill.addEventListener("click", () => {
      userPinned = true;
      showLook(i);
    });
  });

  const showOrig = (e) => {
    e.preventDefault();
    if (!looks[index].before) return;
    userPinned = true;
    setCompare(100);
  };
  const hideOrig = () => setCompare(0);

  compareBtn.addEventListener("pointerdown", showOrig);
  compareBtn.addEventListener("pointerup", hideOrig);
  compareBtn.addEventListener("pointerleave", hideOrig);
  compareBtn.addEventListener("pointercancel", hideOrig);

  let dragging = false;
  stage.addEventListener("pointerdown", (e) => {
    if (e.target.closest("button") || !looks[index].before) return;
    dragging = true;
    userPinned = true;
    const r = stage.getBoundingClientRect();
    setCompare(((e.clientX - r.left) / r.width) * 100);
  });
  window.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const r = stage.getBoundingClientRect();
    setCompare(((e.clientX - r.left) / r.width) * 100);
  });
  window.addEventListener("pointerup", () => {
    if (!dragging) return;
    dragging = false;
    setCompare(0);
  });

  showLook(0);
  startAuto();
})();
