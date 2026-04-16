import * as THREE from 'three';

/**
 * FirstPersonControls — Responsabilidad única: gestionar la entrada del usuario
 * (WASD + Pointer Lock + mouse) y actualizar posición/rotación de la cámara.
 *
 * Límites de sala hardcodeados como constantes de clase; fácil de externalizar
 * a un objeto de configuración si la sala es dinámica.
 */
export class FirstPersonControls {
  static SPEED       = 4.0;
  static LERP_FACTOR = 8.0;
  static PITCH_LIMIT = 0.6;
  static MOUSE_SENS  = 0.0018;

  // Límites físicos de la sala (mismos que RoomBuilder)
  static BOUNDS = { xMin: -9, xMax: 9, zMin: -5, zMax: 5.5, y: 1.6 };

  /**
   * @param {HTMLCanvasElement} canvas
   * @param {THREE.PerspectiveCamera} camera
   */
  constructor(canvas, camera) {
    this._canvas   = canvas;
    this._camera   = camera;
    this._keys     = {};
    this._yaw      = 0;
    this._pitch    = 0;
    this._isLocked = false;
    this._velocity = new THREE.Vector3();
    this._dir      = new THREE.Vector3();
    this._yAxis    = new THREE.Vector3(0, 1, 0);

    this._bindEvents();
  }

  /**
   * Actualiza movimiento y rotación de cámara. Llamar en cada frame.
   * @param {number} delta - Segundos desde el frame anterior
   */
  update(delta) {
    this._updateMovement(delta);
    this._applyRotation();
  }

  // ── Privados ────────────────────────────────────────────────────

  _bindEvents() {
    document.addEventListener('keydown', e => { this._keys[e.code] = true; });
    document.addEventListener('keyup',   e => { delete this._keys[e.code]; });

    this._canvas.addEventListener('click', () => this._canvas.requestPointerLock());

    document.addEventListener('pointerlockchange', () => {
      this._isLocked            = document.pointerLockElement === this._canvas;
      this._canvas.style.cursor = this._isLocked ? 'none' : 'crosshair';
    });

    document.addEventListener('mousemove', e => {
      if (!this._isLocked) return;
      this._yaw   -= e.movementX * FirstPersonControls.MOUSE_SENS;
      this._pitch -= e.movementY * FirstPersonControls.MOUSE_SENS;
      this._pitch  = Math.max(
        -FirstPersonControls.PITCH_LIMIT,
        Math.min(FirstPersonControls.PITCH_LIMIT, this._pitch),
      );
    });
  }

  _updateMovement(delta) {
    const k = this._keys;
    this._dir.set(0, 0, 0);
    if (k['KeyW'] || k['ArrowUp'])    this._dir.z -= 1;
    if (k['KeyS'] || k['ArrowDown'])  this._dir.z += 1;
    if (k['KeyA'] || k['ArrowLeft'])  this._dir.x -= 1;
    if (k['KeyD'] || k['ArrowRight']) this._dir.x += 1;

    this._dir
      .normalize()
      .applyAxisAngle(this._yAxis, this._yaw)
      .multiplyScalar(FirstPersonControls.SPEED);

    this._velocity.lerp(this._dir, delta * FirstPersonControls.LERP_FACTOR);
    this._camera.position.addScaledVector(this._velocity, delta);

    // Clamp dentro de la sala
    const { xMin, xMax, zMin, zMax, y } = FirstPersonControls.BOUNDS;
    this._camera.position.x = Math.max(xMin, Math.min(xMax, this._camera.position.x));
    this._camera.position.z = Math.max(zMin, Math.min(zMax, this._camera.position.z));
    this._camera.position.y = y;
  }

  _applyRotation() {
    this._camera.rotation.order = 'YXZ';
    this._camera.rotation.y     = this._yaw;
    this._camera.rotation.x     = this._pitch;
  }
}
