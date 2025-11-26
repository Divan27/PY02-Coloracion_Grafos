// src/models/Edge.js
export default class Edge {
  /**
   * @param {number} sourceId - Id del nodo origen
   * @param {number} targetId - Id del nodo destino
   * @param {number} weight   - Peso de la arista (opcional)
   */
  constructor(sourceId, targetId, weight = 1) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.weight = weight;
  }
}
