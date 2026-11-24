(() => {
  const KEY = "frayge-theme";
  const SVG_NS = "http://www.w3.org/2000/svg";
  const root = document.documentElement;
  const initial = localStorage.getItem(KEY) || "light";

  function buildIcon(mode) {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", "16");
    svg.setAttribute("height", "16");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("aria-hidden", "true");
    if (mode === "dark") {
      const c = document.createElementNS(SVG_NS, "circle");
      c.setAttribute("cx", "12");
      c.setAttribute("cy", "12");
      c.setAttribute("r", "4");
      const p = document.createElementNS(SVG_NS, "path");
      p.setAttribute("d", "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41");
      svg.appendChild(c);
      svg.appendChild(p);
    } else {
      const p = document.createElementNS(SVG_NS, "path");
      p.setAttribute("d", "M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z");
      svg.appendChild(p);
    }
    return svg;
  }

  function applyTheme(mode) {
    const safeMode = mode === "dark" ? "dark" : "light";
    root.setAttribute("data-theme", safeMode);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.setAttribute("aria-label", safeMode === "dark" ? "Switch to Ceramic light mode" : "Switch to Obsidian dark mode");
      btn.replaceChildren(buildIcon(safeMode));
    }
    document.querySelectorAll("[data-icon-light]").forEach((img) => {
      img.src = safeMode === "dark" ? img.dataset.iconDark : img.dataset.iconLight;
    });
  }

  window.__snipSetTheme = (mode) => {
    const safeMode = mode === "dark" ? "dark" : "light";
    try { localStorage.setItem(KEY, safeMode); } catch (_) {}
    applyTheme(safeMode);
  };

  applyTheme(initial);

  window.addEventListener("DOMContentLoaded", () => {
    applyTheme(root.getAttribute("data-theme") || initial);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", () => {
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        window.__snipSetTheme(next);
      });
    }
  });
})();
