import * as THREE from 'three';

/**
 * SceneBuilder — Responsabilidad única: construir y exponer la escena y la cámara.
 * Retorna un objeto plano {scene, camera} para que main.js los distribuya.
 */
export class SceneBuilder {
  build() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d14);
    scene.fog        = new THREE.Fog(0x0d0d14, 12, 30);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 1.6, 8);

    return { scene, camera };
  }
}
