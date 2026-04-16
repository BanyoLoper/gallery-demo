import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * ModelLoader — Responsabilidad única: cargar modelos GLB de forma asíncrona.
 *
 * Uso desde JS:
 *   const loader = new ModelLoader(onProgress);
 *
 *   // Un modelo (misma ruta del servidor):
 *   const group = await loader.load('./models/escultura_001.glb');
 *
 *   // Un modelo desde servidor externo / CDN:
 *   const group = await loader.load('https://cdn.tusitio.com/models/escultura_001.glb');
 *
 *   // Todos en paralelo, esperando a que TODOS terminen:
 *   const models = await loader.loadAll(['./models/a.glb', './models/b.glb']);
 *   // models[i] es null si ese modelo falló (se usará fallback procedural).
 */
export class ModelLoader {
  /**
   * @param {(url: string, loaded: number, total: number) => void} [onProgress]
   */
  constructor(onProgress) {
    this._manager = new THREE.LoadingManager();

    if (onProgress) {
      this._manager.onProgress = onProgress;
    }

    this._manager.onError = url =>
      console.warn(`[ModelLoader] No se pudo cargar: ${url}`);

    this._loader = new GLTFLoader(this._manager);
  }

  /**
   * Carga un único modelo GLB.
   * @param {string} path
   * @returns {Promise<THREE.Group>}
   */
  load(path) {
    return new Promise((resolve, reject) => {
      this._loader.load(path, gltf => resolve(gltf.scene), undefined, reject);
    });
  }

  /**
   * Carga todos los modelos en paralelo y espera a que TODOS terminen.
   * Usa Promise.allSettled para que un fallo individual no cancele el resto:
   * la posición con error recibirá null y usará geometría procedural de fallback.
   *
   * @param {string[]} paths
   * @returns {Promise<Array<THREE.Group | null>>}
   */
  async loadAll(paths) {
    const results = await Promise.allSettled(paths.map(p => this.load(p)));

    return results.map((result, i) => {
      if (result.status === 'fulfilled') return result.value;
      console.warn(`[ModelLoader] Fallback procedural para "${paths[i]}".`);
      return null;
    });
  }
}
