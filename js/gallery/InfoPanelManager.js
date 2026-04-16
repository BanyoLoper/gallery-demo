import * as THREE from 'three';

/**
 * InfoPanelManager — Responsabilidad única: gestionar los paneles HTML informativos
 * y proyectarlos sobre sus posiciones 3D en cada frame.
 *
 * Técnica: worldToScreen projection manual (evita importar CSS3DRenderer como módulo
 * externo). Compatible con cualquier versión de Three.js sin dependencias extra.
 */
export class InfoPanelManager {
  /** Radio (en unidades de escena) dentro del cual un panel se vuelve visible. */
  static PROXIMITY_THRESHOLD = 3.5;

  /**
   * @param {HTMLElement} container - Div overlay encima del canvas
   * @param {Object[]}    obras     - Array de obras (de obras.js)
   */
  constructor(container, obras) {
    this._panels    = [];
    this._positions = [];  // THREE.Vector3 de cada panel en el espacio 3D

    obras.forEach(obra => this._createPanel(container, obra));
  }

  /**
   * Actualiza posición y opacidad de los paneles. Debe llamarse cada frame.
   *
   * @param {THREE.Camera} camera
   * @param {Array<{ mesh: THREE.Object3D }>} sculptures
   * @returns {boolean} true si la cámara está cerca de al menos una obra
   */
  update(camera, sculptures) {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const THRESHOLD = InfoPanelManager.PROXIMITY_THRESHOLD;
    let isNearAny = false;

    this._panels.forEach((el, i) => {
      const dist = camera.position.distanceTo(sculptures[i].mesh.position);
      const near = dist < THRESHOLD;
      if (near) isNearAny = true;

      const screen = this._worldToScreen(this._positions[i], camera, W, H);

      if (!screen.behind && near) {
        const fade = Math.max(0, Math.min(1, (THRESHOLD - dist) / 1.5));
        el.style.opacity = fade;
        el.style.left    = screen.x + 'px';
        el.style.top     = (screen.y - 20) + 'px';
      } else {
        el.style.opacity = 0;
      }
    });

    return isNearAny;
  }

  // ── Privados ────────────────────────────────────────────────────

  _createPanel(container, obra) {
    const div = document.createElement('div');
    div.className = 'obra-panel';
    div.style.cssText =
      'position:absolute;transform:translate(-50%,0);opacity:0;' +
      'transition:opacity 0.4s ease;pointer-events:none;';

    // Sanitización básica: los datos vienen de obras.js (source interna, no user input).
    div.innerHTML = `
      <div class="num">OBRA ${obra.num}</div>
      <h3>${obra.titulo}</h3>
      <div class="artista">${obra.artista}</div>
      <div class="divider"></div>
      <div class="desc">${obra.desc}</div>
      <div class="precio">${obra.precio}</div>
    `;

    container.appendChild(div);
    this._panels.push(div);

    // El panel flota 1.2u por encima del punto de la escultura
    this._positions.push(
      new THREE.Vector3(obra.position.x -0.5, obra.position.y - .6, obra.position.z),
    );
  }

  /**
   * Proyecta una posición 3D a coordenadas de pantalla (px).
   * @returns {{ x: number, y: number, behind: boolean }}
   */
  _worldToScreen(pos3D, camera, W, H) {
    const v = pos3D.clone().project(camera);
    return {
      x:      (v.x *  0.5 + 0.5) * W,
      y:      (v.y * -0.5 + 0.5) * H,
      behind: v.z > 1,
    };
  }
}
