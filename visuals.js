import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.14.2/+esm';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

/**
 * AURORA 3D visual engine
 * Decorative WebGL scene + GSAP choreography. No app state is modified.
 * Automatically scales down for mobile and respects reduced-motion preferences.
 */
(() => {
  'use strict';
  const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isReduced = () => reducedQuery.matches
    || document.documentElement.classList.contains('motion-reduced')
    || document.body.classList.contains('motion-reduced');

  function boot() {
    const host = document.querySelector('#visual-stage');
    if (!host || host.dataset.ready === 'true') return;
    host.dataset.ready = 'true';

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0d10, 0.065);
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.set(0, 0, 13);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !matchMedia('(max-width: 760px)').matches, powerPreference: 'low-power' });
    } catch (error) {
      host.classList.add('visual-stage-fallback');
      return;
    }
    const small = () => matchMedia('(max-width: 760px)').matches;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small() ? 1.15 : 1.65));
    renderer.setSize(host.clientWidth || innerWidth, host.clientHeight || innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'visual-webgl';
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.appendChild(renderer.domElement);

    const root = new THREE.Group();
    scene.add(root);
    const gold = new THREE.MeshStandardMaterial({ color: 0xd6b77a, metalness: .82, roughness: .22, emissive: 0x3a2810, emissiveIntensity: .48 });
    const iris = new THREE.MeshStandardMaterial({ color: 0xa99af9, metalness: .72, roughness: .26, emissive: 0x241c53, emissiveIntensity: .6 });
    const pearl = new THREE.MeshStandardMaterial({ color: 0xe8e1d1, metalness: .55, roughness: .2, emissive: 0x302719, emissiveIntensity: .25 });
    const wireGold = new THREE.MeshBasicMaterial({ color: 0xd6b77a, wireframe: true, transparent: true, opacity: .28 });
    const wireIris = new THREE.MeshBasicMaterial({ color: 0xa99af9, wireframe: true, transparent: true, opacity: .25 });
    const objects = [];

    function add(mesh, position, scale = 1, spin = 1) {
      mesh.position.set(...position);
      mesh.scale.setScalar(scale);
      mesh.userData.spin = spin;
      root.add(mesh);
      objects.push(mesh);
      return mesh;
    }

    // Main faceted artefact, a wireframe shell and a glowing inner crystal.
    const core = add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.25, 1), gold), [2.9, .1, 0], 1.12, .15);
    const shell = add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.62, 1), wireGold), [2.9, .1, 0], 1.2, -.1);
    const inner = add(new THREE.Mesh(new THREE.OctahedronGeometry(.72, 1), pearl), [2.9, .1, .05], 1, .28);
    const torus = add(new THREE.Mesh(new THREE.TorusGeometry(2.05, .012, 8, 180), wireGold), [2.9, .1, -.4], 1, .1);
    torus.rotation.set(.82, .25, -.32);
    const torus2 = add(new THREE.Mesh(new THREE.TorusGeometry(2.38, .009, 8, 180), wireIris), [2.9, .1, -.7], 1, -.1);
    torus2.rotation.set(1.15, -.48, .62);

    // Floating polyhedra and tiny metallic satellites form a 3D constellation.
    const geo = [
      new THREE.OctahedronGeometry(.34, 0),
      new THREE.TetrahedronGeometry(.3, 0),
      new THREE.DodecahedronGeometry(.26, 0),
      new THREE.IcosahedronGeometry(.19, 0)
    ];
    const count = small() ? 13 : 25;
    for (let i = 0; i < count; i++) {
      const angle = i / count * Math.PI * 2;
      const radius = 3.5 + Math.random() * 3.8;
      const mat = i % 4 === 0 ? iris : i % 3 === 0 ? pearl : gold;
      const size = .38 + Math.random() * .75;
      const mesh = new THREE.Mesh(geo[i % geo.length], mat);
      add(mesh, [Math.cos(angle) * radius, Math.sin(angle * 1.7) * 2.3, -1 - Math.random() * 4], size, (Math.random() - .5) * .45);
      mesh.userData.floatY = mesh.position.y;
      mesh.userData.phase = Math.random() * Math.PI * 2;
    }

    // Dust field, rendered as a single point cloud to keep the scene inexpensive.
    const dustCount = small() ? 360 : 850;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - .5) * 23;
      dustPositions[i * 3 + 1] = (Math.random() - .5) * 14;
      dustPositions[i * 3 + 2] = (Math.random() - .5) * 13 - 2;
      const tint = Math.random();
      dustColors[i * 3] = tint > .7 ? .68 : .42;
      dustColors[i * 3 + 1] = tint > .7 ? .54 : .45;
      dustColors[i * 3 + 2] = tint > .85 ? .95 : .28;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ size: small() ? .025 : .033, vertexColors: true, transparent: true, opacity: .72, sizeAttenuation: true }));
    scene.add(dust);

    scene.add(new THREE.AmbientLight(0xffffff, 1.35));
    const key = new THREE.PointLight(0xe6c98d, 48, 35);
    key.position.set(4, 5, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0x8e7bf5, 34, 28);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let frame = 0;
    let lastTime = 0;
    let alive = true;

    const master = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
    master.to(core.rotation, { x: Math.PI * .42, y: Math.PI * .75, duration: 8 }, 0)
      .to(inner.rotation, { x: -Math.PI * .7, z: Math.PI * .9, duration: 5.5 }, 0)
      .to(shell.rotation, { x: -Math.PI * .24, y: -Math.PI * .5, duration: 10 }, 0)
      .to(torus.rotation, { z: Math.PI * .35, x: 1.25, duration: 7 }, 0)
      .to(torus2.rotation, { y: -.9, z: 1.1, duration: 9 }, 0)
      .to(key.position, { x: -2, y: 3, duration: 6 }, 0)
      .to(root.position, { y: .24, duration: 4.5 }, 0);

    objects.forEach((obj, index) => {
      if (obj === core || obj === shell || obj === inner || obj === torus || obj === torus2) return;
      gsap.to(obj.rotation, {
        x: obj.rotation.x + obj.userData.spin * (1.4 + index % 3),
        y: obj.rotation.y + obj.userData.spin * (1.7 + index % 4),
        duration: 5 + index % 7,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * .035
      });
      gsap.to(obj.position, {
        y: obj.position.y + .25 + (index % 3) * .12,
        x: obj.position.x + Math.sin(index) * .35,
        duration: 2.8 + index % 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * .04
      });
    });

    gsap.fromTo(host, { opacity: 0, scale: .985 }, { opacity: 1, scale: 1, duration: 1.35, ease: 'power3.out', clearProps: 'transform' });

    function resize() {
      const width = Math.max(1, host.clientWidth || innerWidth);
      const height = Math.max(1, host.clientHeight || innerHeight);
      camera.aspect = width / height;
      camera.position.z = width < 620 ? 16 : 13;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small() ? 1.15 : 1.65));
      renderer.setSize(width, height);
    }

    function render(time = 0) {
      frame = 0;
      if (!alive || document.hidden || isReduced()) return;
      const delta = Math.min((time - (lastTime || time)) / 1000, .04);
      lastTime = time;
      pointer.x += (target.x - pointer.x) * .035;
      pointer.y += (target.y - pointer.y) * .035;
      root.rotation.y = pointer.x * .14;
      root.rotation.x = -pointer.y * .08;
      dust.rotation.y += delta * .012;
      dust.rotation.z += delta * .004;
      objects.forEach(obj => {
        if (obj.userData.floatY !== undefined) obj.position.y += Math.sin(time * .00065 + obj.userData.phase) * .0009;
      });
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    }

    function start() {
      if (!alive || frame || document.hidden || isReduced()) return;
      master.resume();
      gsap.globalTimeline.resume();
      frame = requestAnimationFrame(render);
    }
    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      master.pause();
    }
    function syncMotion() {
      if (isReduced()) stop();
      else start();
    }
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', event => {
      target.x = (event.clientX / Math.max(1, innerWidth) - .5) * 2;
      target.y = (event.clientY / Math.max(1, innerHeight) - .5) * 2;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    reducedQuery.addEventListener?.('change', syncMotion);
    const observer = new MutationObserver(syncMotion);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('pagehide', () => { alive = false; stop(); renderer.dispose(); }, { once: true });

    resize();
    if (isReduced()) master.pause();
    else start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();