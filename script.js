
 
  const BLOOM_LAPTOP = "images/bloom-pc.png";
  const BLOOM_PHONE = "images/bloom-mobile.png";
  const LandingTea_LAPTOP = "images/landingtea-pc.png";
  const LandingTea_PHONE = "images/landingtea-mobile.png";
  const GOLDENPLATE_LAPTOP = "images/goldenplate-pc.png";
  const GOLDENPLATE_MOBILE = "images/goldenplate-mobile.png";
  const GAMEHUB_LAPTOP = "images/gamehub-mobile.png";
  const GAMEHUB_MOBILE = "images/gamehub-pc.png";

  const projects = [
    { title: "BloomBOOk", 
      desc: "Lorem ipsume asdknasdkfabsdifnasdkfnadsasd", 
      tech: ["HTML", "CSS", "JS"], 
      url: "./pages/BLOOMBOOK/index.html", image: BLOOM_LAPTOP, imageMobile: BLOOM_PHONE, c1: "#0f766e", c2: "#5eead4",
      members: [{ name: "Alsola", role: "Leader" }] },
    { title: "LandingTea", 
      desc: "Lorem Ipsume", 
      tech: ["HTML", "CSS", "JavaScript"], 
      url: "./pages/LANDINGTEA/index.html", image: LandingTea_LAPTOP, imageMobile: LandingTea_PHONE, c1: "#0369a1", c2: "#7dd3fc",
      members: [{ name: "", role: "Leader" }] },
    { title: "GOlden Plate", desc: "Lorem Ipsum", tech: ["HTML", "CSS"], url: "./pages/GOLDENPLATE/index.html", image: GOLDENPLATE_LAPTOP, imageMobile: GOLDENPLATE_MOBILE, c1: "#b45309", c2: "#fcd34d",
      members: [{ name: "Parane", role: "Leader" }] },
    { title: "GameHUB", desc: "Lorem Ipsum", tech: ["HTML", "CSS", "JS"], url: "./pages/GAMEHUB/index.html", image: GAMEHUB_LAPTOP, imageMobile: GAMEHUB_MOBILE, c1: "#be123c", c2: "#fda4af",
      members: [{ name: "JUMADIAO", role: "Leader" }] },
  ];

  const uri = svg => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  const grad = p => `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.c1}"/><stop offset="1" stop-color="${p.c2}"/></linearGradient></defs>`;

  /* Placeholder laptop screen (landscape) */
  function mockLaptop(p) {
    return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400">${grad(p)}
      <rect width="640" height="400" fill="url(#g)"/>
      <rect width="640" height="40" fill="#fff" fill-opacity=".95"/>
      <rect x="24" y="14" width="90" height="12" rx="6" fill="${p.c1}"/>
      <rect x="440" y="15" width="40" height="10" rx="5" fill="#cbd5e1"/><rect x="496" y="15" width="40" height="10" rx="5" fill="#cbd5e1"/><rect x="552" y="15" width="64" height="10" rx="5" fill="#cbd5e1"/>
      <rect x="40" y="76" width="300" height="30" rx="8" fill="#fff"/>
      <rect x="40" y="122" width="400" height="10" rx="5" fill="#fff" fill-opacity=".75"/><rect x="40" y="142" width="340" height="10" rx="5" fill="#fff" fill-opacity=".75"/>
      <rect x="40" y="186" width="170" height="170" rx="10" fill="#fff" fill-opacity=".9"/><rect x="235" y="186" width="170" height="170" rx="10" fill="#fff" fill-opacity=".9"/><rect x="430" y="186" width="170" height="170" rx="10" fill="#fff" fill-opacity=".9"/>
      <rect x="56" y="202" width="138" height="70" rx="6" fill="${p.c2}" fill-opacity=".55"/><rect x="251" y="202" width="138" height="70" rx="6" fill="${p.c2}" fill-opacity=".55"/><rect x="446" y="202" width="138" height="70" rx="6" fill="${p.c2}" fill-opacity=".55"/>
    </svg>`);
  }

  /* Placeholder phone screen (portrait) */
  function mockPhone(p) {
    return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 780">${grad(p)}
      <rect width="360" height="780" fill="url(#g)"/>
      <rect x="28" y="30" width="50" height="10" rx="5" fill="#fff" fill-opacity=".85"/><rect x="282" y="30" width="50" height="10" rx="5" fill="#fff" fill-opacity=".85"/>
      <rect x="28" y="88" width="190" height="26" rx="8" fill="#fff"/>
      <rect x="28" y="128" width="270" height="10" rx="5" fill="#fff" fill-opacity=".75"/><rect x="28" y="148" width="220" height="10" rx="5" fill="#fff" fill-opacity=".75"/>
      <rect x="28" y="190" width="304" height="170" rx="16" fill="#fff" fill-opacity=".92"/>
      <rect x="44" y="206" width="272" height="96" rx="10" fill="${p.c2}" fill-opacity=".6"/>
      <rect x="44" y="318" width="150" height="12" rx="6" fill="${p.c1}"/><rect x="44" y="338" width="100" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="28" y="382" width="304" height="76" rx="14" fill="#fff" fill-opacity=".92"/>
      <circle cx="68" cy="420" r="22" fill="${p.c2}" fill-opacity=".7"/><rect x="104" y="408" width="160" height="12" rx="6" fill="${p.c1}"/><rect x="104" y="430" width="110" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="28" y="474" width="304" height="76" rx="14" fill="#fff" fill-opacity=".92"/>
      <circle cx="68" cy="512" r="22" fill="${p.c2}" fill-opacity=".7"/><rect x="104" y="500" width="160" height="12" rx="6" fill="${p.c1}"/><rect x="104" y="522" width="110" height="8" rx="4" fill="#cbd5e1"/>
      <rect x="0" y="690" width="360" height="90" fill="#fff" fill-opacity=".95"/>
      <circle cx="70" cy="722" r="12" fill="${p.c1}"/><circle cx="180" cy="722" r="12" fill="#cbd5e1"/><circle cx="290" cy="722" r="12" fill="#cbd5e1"/>
    </svg>`);
  }

  const n = projects.length, half = Math.floor(n / 2);
  const stage = document.getElementById("stage");
  const wide = window.matchMedia("(min-width: 768px)");
  /* How far each neighbor sits from the center (in widths of one device), by screen size */
  const SHIFT_LAPTOP = [0, 0.7, 1.08, 1.34], SHIFT_PHONE = [0, 0.85, 1.4, 1.8];
  const SCALE = [1, 0.84, 0.68, 0.52], FADE = [1, 0.88, 0.6, 0.3];
  let active = 0;

  const slides = projects.map((p, i) => {
    const el = document.createElement("div");
    el.className = "slide";
    el.innerHTML = `
      <div class="laptop"><div class="lid"><div class="lscreen"><img src="${p.image || mockLaptop(p)}" alt="${p.title} on a laptop screen" draggable="false"></div></div><div class="base"></div></div>
      <div class="phone"><div class="phone-body"><i class="vol"></i><div class="pscreen"><img src="${p.imageMobile || mockPhone(p)}" alt="${p.title} on a phone screen" draggable="false"></div></div></div>`;
    el.addEventListener("click", () => go(i));
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(i); } });
    stage.appendChild(el);
    return el;
  });

  const mod = (a, b) => ((a % b) + b) % b;
  function layout() {
    const SHIFT = wide.matches ? SHIFT_LAPTOP : SHIFT_PHONE, TILT = wide.matches ? 18 : 16;
    slides.forEach((el, i) => {
      const o = mod(i - active + half, n) - half, a = Math.min(Math.abs(o), 3), s = Math.sign(o);
      el.style.transform = `translateX(${-50 + s * SHIFT[a] * 100}%) rotateY(${-s * (a ? TILT : 0)}deg) scale(${SCALE[a]})`;
      el.style.opacity = FADE[a];
      el.style.filter = a ? "brightness(.82)" : "none";
      el.style.zIndex = 10 - a;
      el.style.pointerEvents = Math.abs(o) > 2 ? "none" : "auto";
      if (o === 0) { el.removeAttribute("role"); el.removeAttribute("tabindex"); el.removeAttribute("aria-label"); }
      else { el.setAttribute("role", "button"); el.setAttribute("tabindex", Math.abs(o) > 2 ? "-1" : "0"); el.setAttribute("aria-label", "Show " + projects[i].title); }
    });
  }
  wide.addEventListener("change", layout);

  const initials = name => name.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  function details() {
    const p = projects[active];
    document.getElementById("caption").textContent = p.title;
    document.getElementById("desc").textContent = p.desc;
    document.getElementById("visit").href = p.url;
    document.getElementById("members").innerHTML = p.members.map(m =>
      `<li class="flex items-center gap-3"><span class="avatar" aria-hidden="true">${initials(m.name)}</span><span><span class="block text-sm font-semibold">${m.name}</span><span class="block text-xs" style="color: var(--muted)">${m.role}</span></span></li>`).join("");
    document.getElementById("tech").innerHTML = p.tech.map(t => `<li class="badge">${t}</li>`).join("");
  }

  function go(i) { active = mod(i, n); layout(); details(); }
  document.getElementById("prev").addEventListener("click", () => go(active - 1));
  document.getElementById("next").addEventListener("click", () => go(active + 1));
  document.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(active - 1); if (e.key === "ArrowRight") go(active + 1); });

  /* Swipe on touch screens */
  let startX = null;
  stage.addEventListener("pointerdown", e => { startX = e.clientX; });
  stage.addEventListener("pointerup", e => {
    if (startX !== null && Math.abs(e.clientX - startX) > 40) go(active + (e.clientX < startX ? 1 : -1));
    startX = null;
  });

  go(0);
