/**
 * main.js — Composition Root.
 *
 * Este archivo es el único que conoce a todos los demás módulos.
 * Su única responsabilidad es instanciar, conectar y orquestar los sistemas.
 * No contiene lógica de negocio propia.
 *
 * Flujo de inicialización:
 *   1. Mostrar loading screen
 *   2. Construir escena, cámara, luces, sala
 *   3. Cargar TODOS los modelos GLB en paralelo (espera a que terminen)
 *   4. Construir esculturas (GLB o fallback procedural)
 *   5. Instanciar controles, animador, HUD, paneles
 *   6. Esperar tiempo mínimo de loading → fade out → iniciar game loop
 */

import * as THREE from 'three';

import { Renderer }            from './scene/Renderer.js';
import { SceneBuilder }        from './scene/SceneBuilder.js';
import { LightingSetup }       from './scene/LightingSetup.js';
import { RoomBuilder }         from './scene/RoomBuilder.js';
import { ModelLoader }         from './gallery/ModelLoader.js';
import { SculptureBuilder }    from './gallery/SculptureBuilder.js';
import { InfoPanelManager }    from './gallery/InfoPanelManager.js';
import { FirstPersonControls } from './controls/FirstPersonControls.js';
import { SculptureAnimator }   from './animation/SculptureAnimator.js';
import { LoadingScreen }       from './ui/LoadingScreen.js';
import { HUD }                 from './ui/HUD.js';
import { OBRAS }               from './config/obras.js';

/** Tiempo mínimo que la pantalla de carga permanece visible (ms). */
const MIN_LOADING_MS = 1200;

async function init() {
  const t0 = performance.now();

  // ── 1. Pantalla de carga ─────────────────────────────────────────
  const loadingScreen = new LoadingScreen(document.getElementById('loading'));

  // ── 2. Renderer + Escena + Cámara ───────────────────────────────
  const rendererService     = new Renderer(document.getElementById('renderer-canvas'));
  const { scene, camera }   = new SceneBuilder().build();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    rendererService.resize();
  });

  // ── 3. Geometría estática de la sala ────────────────────────────
  new LightingSetup(scene).setup();
  new RoomBuilder(scene).build();

  // ── 4. Carga de modelos GLB (espera a que TODOS terminen) ────────
  const modelLoader = new ModelLoader(
    (_url, loaded, total) => loadingScreen.setProgress(loaded / total),
  );
  const models = await modelLoader.loadAll(OBRAS.map(o => o.modelPath));

  // ── 5. Construcción de esculturas ────────────────────────────────
  // models[i] es THREE.Group si el GLB cargó, null si falló (usa fallback procedural).
  const sculptureBuilder = new SculptureBuilder(scene);
  const sculptures = OBRAS.map((obra, i) => ({
    ...sculptureBuilder.build(obra, models[i]),
    obra,
  }));

  // ── 6. Sistemas de UI y Control ─────────────────────────────────
  const controls    = new FirstPersonControls(document.getElementById('renderer-canvas'), camera);
  const infoManager = new InfoPanelManager(document.getElementById('css3d-container'), OBRAS);
  const animator    = new SculptureAnimator(sculptures);
  const hud         = new HUD();

  // ── 7. Esperar tiempo mínimo antes de ocultar loading ───────────
  const elapsed   = performance.now() - t0;
  const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
  await new Promise(r => setTimeout(r, remaining));
  await loadingScreen.hide();

  // ── 8. Game Loop ─────────────────────────────────────────────────
  const clock = new THREE.Clock();

  (function loop() {
    requestAnimationFrame(loop);
    const delta = clock.getDelta();
    const t     = clock.elapsedTime;

    controls.update(delta);
    animator.update(t, delta);

    const isNearAny = infoManager.update(camera, sculptures);
    hud.update(camera, isNearAny);

    rendererService.render(scene, camera);
  })();
}

init().catch(err => console.error('[Galería] Error fatal de inicialización:', err));
