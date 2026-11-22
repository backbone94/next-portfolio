'use client';

import { useEffect, useRef } from 'react';
import {
  ACESFilmicToneMapping,
  HemisphereLight,
  DirectionalLight,
  MathUtils,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { makeJunModel } from './junModel';
import styles from './RobotGuide.module.css';

const NOD_DURATION = .95;

export default function RobotThree({ greetingCount }: { greetingCount: number }) {
  const host = useRef<HTMLSpanElement>(null);
  const greet = useRef<(() => void) | null>(null);

  useEffect(() => {
    const holder = host.current;
    if (!holder) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      return;
    }

    renderer.outputColorSpace = SRGBColorSpace;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = .99;
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    holder.append(canvas);

    const scene = new Scene();
    const camera = new PerspectiveCamera(29, 1, .1, 30);
    camera.position.set(.055, .14, 4.68);
    camera.lookAt(0, -.115, .06);

    const key = new DirectionalLight('#fffcf7', 2.1);
    key.position.set(-2.8, 6, 4.5);
    const rim = new DirectionalLight('#bfdbff', 1.55);
    rim.position.set(3.5, 1.8, -2.8);
    scene.add(new HemisphereLight('#e9efff', '#716d87', .62), key, rim);

    const studio = new RoomEnvironment();
    const generator = new PMREMGenerator(renderer);
    const makeReflection = () => {
      try {
        return generator.fromScene(studio, .05, .1, 100, { size: 64 });
      } catch {
        return null;
      }
    };
    let reflection = makeReflection();
    scene.environment = reflection?.texture ?? null;
    scene.environmentIntensity = .62;
    const model = makeJunModel();
    scene.add(model.head);

    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let contextLost = false;
    let raf = 0;
    let lastFrame = 0;
    let elapsed = 0;
    let blinkAt = 2.7;
    let blinkNumber = 0;
    let nodAge = NOD_DURATION;
    let aimX = 0;
    let aimY = 0;
    let lookX = 0;
    let lookY = 0;
    let showStillGreeting = false;
    let stillTimer = 0;
    let interval = 1000 / 40;

    function draw(delta: number, still: boolean) {
      if (contextLost) return;
      const time = still ? 0 : elapsed;
      lookX = still ? 0 : MathUtils.damp(lookX, aimX, 7, delta);
      lookY = still ? 0 : MathUtils.damp(lookY, aimY, 7, delta);

      const blinkAge = time - blinkAt;
      const blink = blinkAge >= 0 && blinkAge < .19
        ? 1 - .91 * Math.sin(Math.PI * blinkAge / .19) ** 1.45
        : 1;
      if (blinkAge >= .19) {
        blinkNumber++;
        blinkAt = time + (blinkNumber % 3 === 0 ? 3.1 : 4.25 + (blinkNumber % 3) * .53);
      }
      const hover = Math.sin(time * 1.95);
      const nodPhase = nodAge / NOD_DURATION;
      const nod = still ? Number(showStillGreeting) * .55 : Math.sin(Math.PI * nodPhase) ** 2;
      model.head.position.set(
        Math.sin(time * 1.25) * .034 + lookX * .093,
        hover * .074 + lookY * .050 - nod * .073,
        0,
      );
      model.head.rotation.set(
        -.035 - lookY * .15 + nod * .25,
        .045 + lookX * .36,
        -.125 + lookX * .049 + hover * .017 - nod * .038,
      );
      model.face.gaze.value.set(lookX * .059, lookY * .042 + nod * .025);
      model.face.lid.value = blink * (1 - nod * .39);

      renderer.render(scene, camera);
      holder!.dataset.jun3d = 'ready';
    }

    function frame(now: number) {
      raf = 0;
      if (!visible || document.hidden || motion.matches || contextLost) return;
      const elapsedMs = lastFrame ? now - lastFrame : interval;
      if (elapsedMs >= interval - 1) {
        const delta = Math.min(elapsedMs / 1000, .06);
        elapsed += delta;
        nodAge = Math.min(nodAge + delta, NOD_DURATION);
        lastFrame = now;
        draw(delta, false);
      }
      raf = requestAnimationFrame(frame);
    }

    function syncPlayback() {
      cancelAnimationFrame(raf);
      raf = 0;
      lastFrame = 0;
      if (!visible || document.hidden || contextLost) return;
      if (motion.matches) draw(0, true);
      else raf = requestAnimationFrame(frame);
    }

    function resize() {
      const width = holder!.clientWidth;
      const height = holder!.clientHeight;
      if (!width || !height) return;
      const compact = width <= 160;
      interval = 1000 / (compact ? 30 : 40);
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, compact ? 1.25 : 1.65));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (visible && !document.hidden) draw(0, motion.matches);
    }

    function track(event: PointerEvent) {
      if (event.pointerType === 'touch' || !visible || document.hidden || motion.matches) return;
      const bounds = holder!.getBoundingClientRect();
      aimX = MathUtils.clamp((event.clientX - bounds.left - bounds.width / 2) / (bounds.width * 1.4), -1, 1);
      aimY = MathUtils.clamp((bounds.top + bounds.height / 2 - event.clientY) / (bounds.height * 1.25), -1, 1);
    }

    function center() {
      aimX = 0;
      aimY = 0;
    }

    function lose(event: Event) {
      event.preventDefault();
      contextLost = true;
      delete holder!.dataset.jun3d;
      syncPlayback();
    }

    function restore() {
      reflection?.dispose();
      reflection = makeReflection();
      scene.environment = reflection?.texture ?? null;
      contextLost = false;
      syncPlayback();
    }

    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) center();
      syncPlayback();
    });
    const dimensions = new ResizeObserver(resize);
    function applyTheme() {
      const { theme, systemDark } = document.documentElement.dataset;
      model.setNight(theme ? theme === 'dark' : systemDark !== undefined);
      if (visible && motion.matches) draw(0, true);
    }
    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-system-dark'] });
    applyTheme();
    intersection.observe(holder);
    dimensions.observe(holder);
    resize();

    greet.current = () => {
      if (!motion.matches) {
        if (nodAge === NOD_DURATION) nodAge = 0;
        return;
      }
      // A still expression acknowledges an intentional tap with reduced motion.
      showStillGreeting = true;
      draw(0, true);
      window.clearTimeout(stillTimer);
      stillTimer = window.setTimeout(() => { showStillGreeting = false; draw(0, true); }, 800);
    };

    window.addEventListener('pointermove', track, { passive: true });
    window.addEventListener('blur', center);
    document.documentElement.addEventListener('pointerleave', center);
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', syncPlayback);
    canvas.addEventListener('webglcontextlost', lose);
    canvas.addEventListener('webglcontextrestored', restore);

    return () => {
      greet.current = null;
      cancelAnimationFrame(raf);
      window.clearTimeout(stillTimer);
      window.removeEventListener('pointermove', track);
      window.removeEventListener('blur', center);
      document.documentElement.removeEventListener('pointerleave', center);
      document.removeEventListener('visibilitychange', syncPlayback);
      motion.removeEventListener('change', syncPlayback);
      canvas.removeEventListener('webglcontextlost', lose);
      canvas.removeEventListener('webglcontextrestored', restore);
      intersection.disconnect();
      dimensions.disconnect();
      themeObserver.disconnect();
      model.dispose();
      reflection?.dispose();
      studio.dispose();
      generator.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
      delete holder.dataset.jun3d;
    };
  }, []);

  useEffect(() => {
    if (greetingCount) greet.current?.();
  }, [greetingCount]);

  return <span ref={host} className={styles.threeStage} aria-hidden="true" />;
}
