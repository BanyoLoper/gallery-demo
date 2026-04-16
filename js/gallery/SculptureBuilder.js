import * as THREE from 'three';

/**
 * SculptureBuilder — Responsabilidad única: construir el conjunto escultura + pedestal.
 *
 * Si se provee un modelo GLB (THREE.Group), lo ubica y habilita sombras en cada mesh hijo.
 * Si model es null, crea geometría procedural según obra.fallback (Open/Closed: nuevo tipo
 * de fallback = añadir un case en _createGeometry sin tocar el resto).
 */
export class SculptureBuilder {
  /** @param {THREE.Scene} scene */
  constructor(scene) {
    this._scene = scene;
  }

  /**
   * @param {Object}           obra   - Datos de la obra (de obras.js)
   * @param {THREE.Group|null} model  - Modelo GLB cargado, o null para fallback
   * @returns {{ mesh: THREE.Object3D, baseY: number }}
   */
  build(obra, model = null) {
    this._buildPedestal(obra);
    const mesh = model ? this._placeModel(model, obra) : this._buildFallback(obra);
    this._buildFloorPlate(obra);
    return { mesh, baseY: obra.position.y };
  }

  // ── Privados ───────────────────────────────────────────────────

  _buildPedestal({ position }) {
    const pedMat = new THREE.MeshStandardMaterial({ color: 0x2a2830, roughness: 0.7 });
    const ped    = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.7), pedMat);
    ped.position.set(position.x, 0.45, position.z);
    ped.castShadow = ped.receiveShadow = true;
    this._scene.add(ped);

    // Franja dorada decorativa
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xc9a96e, metalness: 0.8, roughness: 0.3 });
    const line    = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.02, 0.72), lineMat);
    line.position.set(position.x, 0.89, position.z);
    this._scene.add(line);
  }

  _buildFallback(obra) {
    const mat  = new THREE.MeshStandardMaterial({
      color:            obra.material.color,
      metalness:        obra.material.metalness,
      roughness:        obra.material.roughness,
      envMapIntensity:  1.2,
    });
    const mesh = new THREE.Mesh(this._createGeometry(obra.fallback), mat);
    mesh.position.set(obra.position.x, obra.position.y, obra.position.z);
    mesh.castShadow = mesh.receiveShadow = true;
    this._scene.add(mesh);
    return mesh;
  }

  /**
   * Coloca el modelo GLB en la posición de la obra.
   * Nota: si el GLB tiene su propio pivote descentrado, ajusta la escala/offset aquí.
   */
  _placeModel(model, { position }) {
    model.position.set(position.x, position.y, position.z);
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow    = true;
        child.receiveShadow = true;
      }
    });
    this._scene.add(model);
    return model;
  }

  _buildFloorPlate({ position }) {
    const mat   = new THREE.MeshStandardMaterial({ color: 0x2a2830, roughness: 0.5 });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.01, 0.12), mat);
    // La placa queda ligeramente enfrente del pedestal (z + 0.6)
    plate.position.set(position.x, 0.005, position.z + 0.6);
    this._scene.add(plate);
  }

  /** Extensible: añade nuevos tipos sin modificar build(). */
  _createGeometry({ type, args }) {
    switch (type) {
      case 'TorusKnot':    return new THREE.TorusKnotGeometry(...args);
      case 'Dodecahedron': return new THREE.DodecahedronGeometry(...args);
      case 'Cone':         return new THREE.ConeGeometry(...args);
      default:
        console.warn(`[SculptureBuilder] Tipo desconocido "${type}", usando SphereGeometry.`);
        return new THREE.SphereGeometry(0.5, 32, 32);
    }
  }
}
