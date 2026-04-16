/**
 * LoadingScreen — Responsabilidad única: controlar la pantalla de carga.
 *
 * setProgress() permite actualizar la UI si se añade una barra de progreso numérica.
 * hide() devuelve una Promise que resuelve cuando el fade-out termina,
 * usando el evento transitionend en lugar de un setTimeout hardcodeado.
 */
export class LoadingScreen {
  /** @param {HTMLElement} el - El div #loading */
  constructor(el) {
    this._el = el;
  }

  /**
   * Llamar cuando el LoadingManager reporta progreso.
   * @param {number} ratio - Valor entre 0 y 1
   */
  setProgress(ratio) {
    // Extensión futura: actualiza una barra de progreso numérica.
    // Ejemplo:
    //   this._bar.style.width = (ratio * 100).toFixed(0) + '%';
  }

  /**
   * Inicia el fade-out y elimina el elemento del DOM al terminar.
   * @returns {Promise<void>}
   */
  hide() {
    return new Promise(resolve => {
      this._el.addEventListener('transitionend', () => {
        this._el.remove();
        resolve();
      }, { once: true });

      // El transition CSS (opacity 0.8s) está definido en el HTML.
      this._el.style.opacity = '0';
    });
  }
}
