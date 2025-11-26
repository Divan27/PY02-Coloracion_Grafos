// src/models/Node.js
export default class Node {
  /**
   * @param {number} id - Identificador único del nodo
   * @param {number} x  - Posición normalizada en X (0 a 1)
   * @param {number} y  - Posición normalizada en Y (0 a 1)
   * @param {object} data - Info extra opcional (color, label, etc.)
   */
  constructor(id, x, y, data = {}) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.data = data;
  }
}
