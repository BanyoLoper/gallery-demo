import * as THREE from 'three';

/**
 * Renderer — Responsabilidad única: configurar y operar el WebGLRenderer.
 * No conoce la escena ni la cámara; sólo renderiza lo que se le pasa.
 */
export class Renderer {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this._r = new THREE.WebGLRenderer({ canvas, antialias: true });
    this._r.setSize(window.innerWidth, window.innerHeight);
    this._r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this._r.shadowMap.enabled = true;
    this._r.shadowMap.type    = THREE.PCFSoftShadowMap;
    this._r.toneMapping          = THREE.ACESFilmicToneMapping;
    this._r.toneMappingExposure  = 1.0;
  }

  /** Redimensiona el renderer al tamaño actual de la ventana. */
  resize() {
    this._r.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * @param {THREE.Scene}  scene
   * @param {THREE.Camera} camera
   */
  render(scene, camera) {
    this._r.render(scene, camera);
  }
}
