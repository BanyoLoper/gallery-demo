import * as THREE from 'three';

/**
 * RoomBuilder — Responsabilidad única: construir toda la geometría estática de la sala.
 * (piso, paredes, techo, zócalos decorativos)
 */
export class RoomBuilder {
  /** @param {THREE.Scene} scene */
  constructor(scene) {
    this._scene = scene;
  }

  build() {
    this._buildFloor();
    this._buildWalls();
    this._buildCeiling();
    this._buildMoldings();
  }

  _buildFloor() {
    const mat  = new THREE.MeshStandardMaterial({ color: 0x1a1820, roughness: 0.85, metalness: 0.05 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), mat);
    mesh.rotation.x    = -Math.PI / 2;
    mesh.receiveShadow = true;
    this._scene.add(mesh);
  }

  _buildWalls() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x1e1c28, roughness: 0.9, metalness: 0 });

    // [ancho, alto, prof,  x,    y,   z]
    const wallDefs = [
      [20,  5, 0.2,   0, 2.5, -6],   // trasera
      [20,  5, 0.2,   0, 2.5,  6],   // delantera
      [0.2, 5,  14, -10, 2.5,  0],   // izquierda
      [0.2, 5,  14,  10, 2.5,  0],   // derecha
    ];

    wallDefs.forEach(([w, h, d, x, y, z]) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      mesh.position.set(x, y, z);
      mesh.receiveShadow = true;
      this._scene.add(mesh);
    });
  }

  _buildCeiling() {
    const mat  = new THREE.MeshStandardMaterial({ color: 0x16141f, roughness: 1.0 });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 14), mat);
    mesh.rotation.x = Math.PI / 2;
    mesh.position.y = 5;
    this._scene.add(mesh);
  }

  _buildMoldings() {
    const mat = new THREE.MeshStandardMaterial({ color: 0x3a3650, roughness: 0.6 });
    [-5.95, 5.95].forEach(z => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(20, 0.08, 0.06), mat);
      mesh.position.set(0, 0.12, z);
      this._scene.add(mesh);
    });
  }
}
