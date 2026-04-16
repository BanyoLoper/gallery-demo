/**
 * SculptureAnimator — Responsabilidad única: aplicar animaciones a las esculturas
 * en cada frame según su animType.
 *
 * Extensible (O de SOLID): para agregar un nuevo tipo de animación basta con
 * añadir un case en update() y un animType en obras.js.
 */
export class SculptureAnimator {
  /**
   * @param {Array<{ mesh: THREE.Object3D, obra: Object, baseY: number }>} sculptures
   */
  constructor(sculptures) {
    this._sculptures = sculptures;
  }

  /**
   * @param {number} t     - Tiempo total (clock.elapsedTime)
   * @param {number} delta - Tiempo desde el frame anterior
   */
  update(t, delta) {
    this._sculptures.forEach(({ mesh, obra, baseY }, i) => {
      switch (obra.animType) {
        case 'rotate':
          mesh.rotation.y += delta * 0.6;
          mesh.rotation.x  = Math.sin(t * 0.4) * 0.15;
          break;

        case 'float':
          mesh.position.y  = baseY + Math.sin(t * 1.2 + i) * 0.12;
          mesh.rotation.y += delta * 0.3;
          break;

        case 'pulse': {
          const s = 1 + Math.sin(t * 2.0 + i) * 0.04;
          mesh.scale.set(s, s, s);
          mesh.rotation.y += delta * 0.4;
          break;
        }

        default:
          break;
      }
    });
  }
}
