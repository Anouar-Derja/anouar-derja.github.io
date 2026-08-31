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
    MOBILE LAYOUT SEPARATION HANDLERS
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
   INTERACTIVE COMPONENT: TYPING TEXT CYCLE EFFECT
========================================================================= */
const roles = ["Full-Stack Developer", "Backend Developer", ".NET Developer"];
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
  let speed = isDeleting ? 32 : 52;

  if (!isDeleting && charIndex === fullText.length) {
    isDeleting = true;
    speed = 1400; 
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 350;
  }

  setTimeout(typeEffect, speed);
}
typeEffect();

/* =========================================================================
    THREE.JS CORE: SILKY SMOOTH MOUSE-ILLUMINATED FIELD
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
    color: 0x8b5cf6,
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

/* =========================================================================
   THREE.JS HERO ROBOT — built entirely from code (no model/video/SVG asset)
   ========================================================================= */
(function initCodeBuiltRobotHero() {
  const canvas = document.getElementById("robotHeroCanvas");
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x02000d, 0.035);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
camera.position.set(0, 1.65, 9.2);

  const robot = new THREE.Group();
 robot.position.set(0.15, -0.35, 0);
robot.scale.setScalar(0.78);
  robot.rotation.y = -0.08;
  scene.add(robot);

  // Soft studio lighting.
  scene.add(new THREE.HemisphereLight(0x9b7cff, 0x030006, 1.0));

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
keyLight.position.set(-3, 5, 7);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
fillLight.position.set(4, 2, 6);
scene.add(fillLight);
const violetLight = new THREE.PointLight(0x8b5cf6, 6.0, 12, 2);
  violetLight.position.set(3.2, 1.5, 2.8);
  scene.add(violetLight);

  const pinkLight = new THREE.PointLight(0xf0a7ff, 2.8, 8, 2);
  pinkLight.position.set(-3.8, 2.0, 1.5);
  scene.add(pinkLight);

  const rimLight = new THREE.PointLight(0x5b21b6, 8, 10, 2);
  rimLight.position.set(2.5, 2.5, -3.5);
  scene.add(rimLight);

  function roundedBoxGeometry(width, height, depth, radius) {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    const r = Math.min(radius, width / 2, height / 2);

    shape.moveTo(x + r, y);
    shape.lineTo(x + width - r, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + r);
    shape.lineTo(x + width, y + height - r);
    shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    shape.lineTo(x + r, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - r);
    shape.lineTo(x, y + r);
    shape.quadraticCurveTo(x, y, x + r, y);

    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: radius * 0.45,
      bevelThickness: radius * 0.35,
      curveSegments: 6
    });
    geometry.center();
    geometry.computeVertexNormals();
    return geometry;
  }

 const shellMat = new THREE.MeshStandardMaterial({
  color: 0x0b0716,
  metalness: 0.72,
  roughness: 0.32
});

 const darkMat = new THREE.MeshStandardMaterial({
  color: 0x05040a,
  metalness: 0.60,
  roughness: 0.36
});

const violetMat = new THREE.MeshStandardMaterial({
  color: 0x32145e,
  emissive: 0x240044,
  emissiveIntensity: 0.28,
  metalness: 0.65,
  roughness: 0.32
});

  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xd9c8ff,
    emissiveIntensity: 1.1,
    metalness: 0.15,
    roughness: 0.12
  });

  // BODY
  const body = new THREE.Mesh(roundedBoxGeometry(2.25, 2.0, 1.65, 0.2), shellMat);
  body.position.y = 0.75;
  body.castShadow = true;
  body.receiveShadow = true;
  robot.add(body);

  // Front body panel.
  const chest = new THREE.Mesh(roundedBoxGeometry(1.45, 1.05, 0.08, 0.12), darkMat);
  chest.position.set(0, 0.72, 0.84);
  robot.add(chest);

  const chestGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.035),
    new THREE.MeshBasicMaterial({ color: 0x9b5cff, transparent: true, opacity: 0.72 })
  );
  chestGlow.position.set(0, 0.78, 0.895);
  robot.add(chestGlow);

  // Neck and joint.
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.36, 0.42, 32), darkMat);
  neck.position.y = 1.93;
  neck.castShadow = true;
  robot.add(neck);

  const neckJoint = new THREE.Mesh(new THREE.SphereGeometry(0.39, 32, 32), shellMat);
  neckJoint.position.y = 2.12;
  neckJoint.scale.set(1, 0.72, 1);
  neckJoint.castShadow = true;
  robot.add(neckJoint);

  // HEAD — intentionally larger and rounded like the reference robot.
  const head = new THREE.Group();
  head.position.set(0, 2.75, 0);
  robot.add(head);

  const headShell = new THREE.Mesh(roundedBoxGeometry(2.55, 1.42, 1.55, 0.23), shellMat);
  headShell.castShadow = true;
  headShell.receiveShadow = true;
  head.add(headShell);

  // Dark face plate.
  const face = new THREE.Mesh(roundedBoxGeometry(2.15, 0.94, 0.08, 0.15), darkMat);
  face.position.z = 0.79;
  head.add(face);

  // Eyes.
  [-0.5, 0.5].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), eyeMat);
    eye.position.set(x, 0.05, 0.89);
    eye.scale.z = 0.42;
    eye.castShadow = true;
    head.add(eye);
  });

  // Small forehead light.
  const forehead = new THREE.Mesh(
    new THREE.BoxGeometry(0.55, 0.045, 0.045),
    new THREE.MeshBasicMaterial({ color: 0x9b5cff })
  );
  forehead.position.set(0, 0.45, 0.79);
  head.add(forehead);

  // Ears / side discs.
  [-1, 1].forEach((side) => {
    const ear = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 0.1, 32), violetMat);
    ear.rotation.z = Math.PI / 2;
    ear.position.set(side * 1.31, 0, 0);
    ear.castShadow = true;
    head.add(ear);
  });

  // Arms.
  function makeArm(side) {
    const arm = new THREE.Group();
    arm.position.set(side * 1.38, 1.05, 0);
    arm.rotation.z = side * -0.08;

    const shoulder = new THREE.Mesh(new THREE.SphereGeometry(0.3, 28, 28), violetMat);
    shoulder.castShadow = true;
    arm.add(shoulder);

    const upper = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.23, 0.82, 24), shellMat);
    upper.position.y = -0.52;
    upper.rotation.z = side * 0.12;
    upper.castShadow = true;
    arm.add(upper);

    const elbow = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), darkMat);
    elbow.position.y = -0.94;
    elbow.castShadow = true;
    arm.add(elbow);

    const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.72, 24), shellMat);
    forearm.position.y = -1.38;
    forearm.rotation.z = side * -0.08;
    forearm.castShadow = true;
    arm.add(forearm);

    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 24), darkMat);
    hand.position.y = -1.78;
    hand.scale.set(0.8, 1.0, 0.8);
    hand.castShadow = true;
    arm.add(hand);

    robot.add(arm);
  }
  makeArm(-1);
  makeArm(1);

  // Feet / base.
  [-0.62, 0.62].forEach((x) => {
    const foot = new THREE.Mesh(roundedBoxGeometry(0.75, 0.35, 0.9, 0.11), darkMat);
    foot.position.set(x, -0.35, 0.08);
    foot.castShadow = true;
    robot.add(foot);
  });

  // Floor with a soft reflection.
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(30, 30),
    new THREE.MeshStandardMaterial({ color: 0x020205, metalness: 0.55, roughness: 0.28 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.56;
  floor.receiveShadow = true;
  scene.add(floor);

  const floorGlow = new THREE.Mesh(
    new THREE.CircleGeometry(2.6, 64),
    new THREE.MeshBasicMaterial({ color: 0x5b21b6, transparent: true, opacity: 0.12, depthWrite: false })
  );
  floorGlow.rotation.x = -Math.PI / 2;
  floorGlow.position.set(1.65, -0.545, 0.15);
  floorGlow.scale.set(1.35, 0.7, 1);
  scene.add(floorGlow);

  // A few tiny stars keep the space atmosphere without using an image/video.
  const starsGeo = new THREE.BufferGeometry();
  const starCount = 650;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    starPositions[i3] = (Math.random() - 0.5) * 14;
    starPositions[i3 + 1] = Math.random() * 7 - 2.2;
    starPositions[i3 + 2] = -2 - Math.random() * 7;
  }
  starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starsGeo,
    new THREE.PointsMaterial({ color: 0x8b5cf6, size: 0.018, transparent: true, opacity: 0.38, depthWrite: false })
  );
  scene.add(stars);

const pointer = {
  x: 0,
  y: 0,
  tx: 0,
  ty: 0
};

window.addEventListener("pointermove", (event) => {
  pointer.tx = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = -((event.clientY / window.innerHeight) * 2 - 1);
}, { passive: true });

  const clock = new THREE.Clock();

  function resize() {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  window.addEventListener("resize", resize);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.085;
pointer.y += (pointer.ty - pointer.y) * 0.085;

// Gentle floating motion
robot.position.y = -0.35 + Math.sin(t * 1.15) * 0.035;

// ---------------------------------------------------------
// ROBOT BODY — stronger mouse response
// ---------------------------------------------------------

const targetRobotY = -0.08 + pointer.x * 0.42;
const targetRobotX = pointer.y * -0.16;

robot.rotation.y += (targetRobotY - robot.rotation.y) * 0.07;
robot.rotation.x += (targetRobotX - robot.rotation.x) * 0.06;

// Small horizontal movement toward the mouse
const targetRobotXPos = 0.15 + pointer.x * 0.12;
robot.position.x += (targetRobotXPos - robot.position.x) * 0.05;


// ---------------------------------------------------------
// HEAD — follows mouse more strongly
// ---------------------------------------------------------

const targetHeadY = pointer.x * 0.38;
const targetHeadX = pointer.y * -0.22;

head.rotation.y += (targetHeadY - head.rotation.y) * 0.10;
head.rotation.x += (targetHeadX - head.rotation.x) * 0.10;


// ---------------------------------------------------------
// LIGHTING — follows mouse for extra depth
// ---------------------------------------------------------

violetLight.position.x =
  3.2 + pointer.x * 2.5 + Math.sin(t * 0.7) * 0.5;

violetLight.position.y =
  1.5 + pointer.y * 1.5 + Math.cos(t * 0.55) * 0.25;

pinkLight.position.x =
  -3.8 + pointer.x * 1.5;

pinkLight.position.y =
  2.0 + pointer.y * 1.0;

    violetLight.position.x = 3.2 + Math.sin(t * 0.7) * 0.5;
    violetLight.position.y = 1.5 + Math.cos(t * 0.55) * 0.25;
    stars.rotation.y = t * 0.003;

    renderer.render(scene, camera);
  }

  animate();
})();
