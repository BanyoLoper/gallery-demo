/**
 * HUD — Responsabilidad única: actualizar los elementos de UI superpuestos
 * (posición de cámara, dot de proximidad, estado de animaciones).
 */
export class HUD {
  constructor() {
    this._posX   = document.getElementById('pos-x');
    this._posZ   = document.getElementById('pos-z');
    this._animSt = document.getElementById('anim-status');
    this._dot    = document.getElementById('proximity-dot');
  }

  /**
   * @param {THREE.Camera} camera
   * @param {boolean}      isNearAny - true si la cámara está cerca de alguna obra
   */
  update(camera, isNearAny) {
    this._posX.textContent = 'X: ' + camera.position.x.toFixed(2);
    this._posZ.textContent = 'Z: ' + camera.position.z.toFixed(2);
    this._dot.classList.toggle('near', isNearAny);
    this._animSt.textContent = isNearAny ? 'Near trigger ✓' : 'Idle';
  }
}
