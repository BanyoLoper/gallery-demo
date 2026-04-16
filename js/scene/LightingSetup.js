import * as THREE from 'three';

/**
 * LightingSetup — Responsabilidad única: añadir y configurar todas las luces.
 * Para cambiar el esquema de iluminación basta con modificar este archivo.
 */
export class LightingSetup {
  /** @param {THREE.Scene} scene */
  constructor(scene) {
    this._scene = scene;
  }

  setup() {
    this._addAmbient();
    this._addDirectional();
    this._addSpots();
  }

  _addAmbient() {
    this._scene.add(new THREE.AmbientLight(0x3a3550, 0.6));
  }

  _addDirectional() {
    const light = new THREE.DirectionalLight(0xfff8f0, 0.8);
    light.position.set(3, 8, 4);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.near   =  0.5;
    light.shadow.camera.far    = 30;
    light.shadow.camera.left   = -10;
    light.shadow.camera.right  =  10;
    light.shadow.camera.top    =  10;
    light.shadow.camera.bottom = -10;
    this._scene.add(light);
  }

  _addSpots() {
    const spotDefs = [
      { x: -4, color: 0xfff5e0 },
      { x:  0, color: 0xf0e8ff },
      { x:  4, color: 0xffe8d0 },
    ];

    spotDefs.forEach(({ x, color }) => {
      const spot = new THREE.SpotLight(color, 2.5, 12, Math.PI / 7, 0.35, 1.5);
      spot.position.set(x, 5, 0);
      spot.castShadow = true;
      spot.shadow.mapSize.set(512, 512);
      this._scene.add(spot);

      // Luz de relleno suave desde abajo del pedestal
      const fill = new THREE.PointLight(color, 0.3, 6);
      fill.position.set(x, 0.3, 0);
      this._scene.add(fill);
    });
  }
}
