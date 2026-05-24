 /* ===============================
   MOBILE NAVBAR ELEMENTS
================================ */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const links = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section");

/* =========================================================================
   🎯 HELPER FUNCTION: DYNAMIC COORDINATE CALCULATION (FIXED MISSING LINK)
========================================================================= */
function getCenteredCoordinates(targetSection) {
  const windowHeight = window.innerHeight;
  const sectionHeight = targetSection.offsetHeight;
  const sectionTop = targetSection.offsetTop;

  // If the section is tall (Timeline or Project Grid), align strictly to its natural top
  if (sectionHeight > windowHeight * 0.8) {
    // We target the section's actual top boundary directly, allowing its native CSS padding to protect the view
    return sectionTop;
  }
  
  // For standard smaller viewports (Home, About, Skills), maintain perfect screen center symmetry
  return sectionTop - ((windowHeight - sectionHeight) / 2);
}

/* =========================================================================
   🎯 SMOOTH NAVIGATION EVENT MANAGEMENT
========================================================================= */
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const targetId = link.getAttribute("data-page");
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      // Calculates matching coordinates uniformly
      const targetCoordinates = getCenteredCoordinates(targetSection);

      window.scrollTo({
        top: targetCoordinates,
        behavior: "smooth"
      });
    }

    // Close mobile menu after clicking a link
    if (navLinks) navLinks.classList.remove("show");
  });
});

// ACTIVE NAV LINK STATE HIGHLIGHT SYSTEM ON SCROLL
window.addEventListener("scroll", () => {
  let current = "";
  const scrollY = window.pageYOffset || window.scrollY;
  const windowHeight = window.innerHeight;

  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const centeredTop = getCenteredCoordinates(section);

    // Active trigger logic aligns with calculated layout targets
    if (scrollY >= centeredTop - 60 && scrollY < centeredTop + sectionHeight - 60) {
      current = section.getAttribute("id");
    }
  });

  // SAFETY CAP: Force active state to "contact" if user is at the absolute bottom margin
  if ((windowHeight + scrollY) >= document.body.offsetHeight - 20) {
    current = "contact";
  }

  // Update active css classes cleanly
  links.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("data-page") === current) {
      link.classList.add("active");
    }
  });
});

// TIMELINE ELEMENT PROGRESS LINE FILL ANIMATION
// TIMELINE PROGRESS FILL & LUMINOUS DOT ACTIVATION
window.addEventListener("scroll", () => {
  const timeline = document.querySelector(".timeline-container");
  const fill = document.getElementById("timelineFill");
  const items = document.querySelectorAll(".timeline-item");
  
  if (!timeline || !fill) return;

  const rect = timeline.getBoundingClientRect();
  const windowHeight = window.innerHeight;

  // 🎯 Trigger line set perfectly at screen mid-center
  const triggerPoint = windowHeight * 0.5; 

  // Calculate overall track progress height percentage
  const progress = triggerPoint - rect.top;
  const totalHeight = rect.height;

  let percentage = (progress / totalHeight) * 100;
  percentage = Math.max(0, Math.min(100, percentage));

  // Update line height
  fill.style.height = `${percentage}%`;

  // Dynamic Luminous Dot calculation per item
  items.forEach(item => {
    const dot = item.querySelector(".timeline-dot");
    if (!dot) return;

    // Get the dot's precise position relative to the viewport window top
    const dotBounding = dot.getBoundingClientRect();

    // If the scroll trigger line passes the dot's viewport top position, illuminate it
    if (dotBounding.top < triggerPoint) {
      item.classList.add("dot-active");
    } else {
      item.classList.remove("dot-active");
    }
  });
});

/* =========================================================================
   📱 MOBILE LAYOUT SEPARATION HANDLERS
========================================================================= */
menuToggle.addEventListener("click", (e) => {
  e.stopPropagation();
  navLinks.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (navLinks && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
    navLinks.classList.remove("show");
  }
});

if (navLinks) {
  navLinks.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}

/* =========================================================================
   🏗️ INTERACTIVE COMPONENT: TYPING TEXT CYCLE EFFECT
========================================================================= */
const roles = ["Backend Developer", ".NET Developer", "Full-Stack Developer"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing");

function typeEffect() {
  if (!typingElement) return;
  const fullText = roles[roleIndex];

  if (isDeleting) {
    charIndex--;
  } else {
    charIndex++;
  }

  typingElement.textContent = fullText.substring(0, charIndex);
  let speed = isDeleting ? 40 : 70;

  if (!isDeleting && charIndex === fullText.length) {
    isDeleting = true;
    speed = 800; 
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 200;
  }

  setTimeout(typeEffect, speed);
}
typeEffect();

/* =========================================================================
   🔥 THREE.JS CORE: SILKY SMOOTH MOUSE-ILLUMINATED FIELD
========================================================================= */
const SimplexNoise = function() {
  const F3 = 1.0 / 3.0, G3 = 1.0 / 6.0;
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = Math.floor(Math.random() * 256);
  const perm = new Uint8Array(512), permMod12 = new Uint8Array(512);
  for (let i = 0; i < 512; i++) {
    perm[i] = p[i & 255];
    permMod12[i] = (perm[i] % 12);
  }
  const grad3 = new Float32Array([1,1,0,-1,1,0,1,-1,0,-1,-1,0,1,0,1,-1,0,1,1,0,-1,-1,0,-1,0,1,1,0,-1,1,0,1,-1,0,-1,-1]);
  return {
    noise3D: function(xin, yin, zin) {
      let n0, n1, n2, n3;
      const s = (xin + yin + zin) * F3;
      const i = Math.floor(xin + s), j = Math.floor(yin + s), k = Math.floor(zin + s);
      const t = (i + j + k) * G3;
      const X0 = i - t, Y0 = j - t, Z0 = k - t;
      const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0;
      let i1, j1, k1, i2, j2, k2;
      if (x0 >= y0) {
        if (y0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
        else if (x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
        else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
      } else {
        if (y0 < z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
        else if (x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
        else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
      }
      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3;
      const x2 = x0 - i2 + 2.0 * G3, y2 = y0 - j2 + 2.0 * G3, z2 = z0 - k2 + 2.0 * G3;
      const x3 = x0 - 1.0 + 3.0 * G3, y3 = y0 - 1.0 + 3.0 * G3, z3 = z0 - 1.0 + 3.0 * G3;
      const ii = i & 255, jj = j & 255, kk = k & 255;
      let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0; if (t0 < 0) n0 = 0.0; else { t0 *= t0; n0 = t0 * t0 * (grad3[permMod12[ii+jj+kk]*3]*x0 + grad3[permMod12[ii+jj+kk]*3+1]*y0 + grad3[permMod12[ii+jj+kk]*3+2]*z0); }
      let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1; if (t1 < 0) n1 = 0.0; else { t1 *= t1; n1 = t1 * t1 * (grad3[permMod12[ii+i1+jj+j1+kk+k1]*3]*x1 + grad3[permMod12[ii+i1+jj+j1+kk+k1]*3+1]*y1 + grad3[permMod12[ii+i1+jj+j1+kk+k1]*3+2]*z1); }
      let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2; if (t2 < 0) n2 = 0.0; else { t2 *= t2; n2 = t2 * t2 * (grad3[permMod12[ii+i2+jj+j2+kk+k2]*3]*x2 + grad3[permMod12[ii+i2+jj+j2+kk+k2]*3+1]*y2 + grad3[permMod12[ii+i2+jj+j2+kk+k2]*3+2]*z2); }
      let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3; if (t3 < 0) n3 = 0.0; else { t3 *= t3; n3 = t3 * t3 * (grad3[permMod12[ii+1+jj+1+kk+1]*3]*x3 + grad3[permMod12[ii+1+jj+1+kk+1]*3+1]*y3 + grad3[permMod12[ii+1+jj+1+kk+1]*3+2]*z3); }
      return 32.0 * (n0 + n1 + n2 + n3);
    }
  };
};

const simplex = SimplexNoise();
const canvas = document.getElementById("globeCanvas");
if (canvas) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 4.0;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

  window.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.targetY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  });

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 5000;
  const positions = new Float32Array(particlesCount * 3);
  const baseDirections = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);

    const dx = Math.sin(phi) * Math.cos(theta);
    const dy = Math.sin(phi) * Math.sin(theta);
    const dz = Math.cos(phi);

    baseDirections[i3] = dx;
    baseDirections[i3 + 1] = dy;
    baseDirections[i3 + 2] = dz;
  }

  particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const createCircleTexture = () => {
    const canvasTexture = document.createElement('canvas');
    canvasTexture.width = 16;
    canvasTexture.height = 16;
    const ctx = canvasTexture.getContext('2d');
    const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvasTexture);
  };

  const particlesMaterial = new THREE.PointsMaterial({
    color: 0xf7b500,
    size: 0.022, 
    transparent: true,
    opacity: 0.75,
    map: createCircleTexture(),
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const positionsArray = particlesGeometry.attributes.position.array;

    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;

    const timeMorph = elapsedTime * 0.7;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const dx = baseDirections[i3];
      const dy = baseDirections[i3 + 1];
      const dz = baseDirections[i3 + 2];

      const noiseValue = simplex.noise3D(
        dx * 0.75 + Math.sin(timeMorph), 
        dy * 0.75 + Math.cos(timeMorph), 
        dz * 0.75 + timeMorph * 0.5
      );

      const baseRadius = 1.35;
      const smoothRadius = baseRadius + (noiseValue * 0.35);

      positionsArray[i3] = dx * smoothRadius;
      positionsArray[i3 + 1] = dy * smoothRadius;
      positionsArray[i3 + 2] = dz * smoothRadius;
    }

    particlesGeometry.attributes.position.needsUpdate = true;

    particleMesh.rotation.y = elapsedTime * 0.1 + (mouse.x * 0.45);
    particleMesh.rotation.x = elapsedTime * 0.05 + (mouse.y * 0.45);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  });
}