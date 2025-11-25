class GraphController {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.nodes = [];
    this.lastNodeId = 0;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.draw();
  }

  addNode() {
    const x = 100 + this.nodes.length * 60;
    const y = 200;

    this.nodes.push({
      id: this.lastNodeId++,
      x,
      y,
      color: "gray",
    });

    this.draw();
  }

  colorGraph() {
    this.nodes.forEach((n, i) => {
      const colors = ["red", "green", "blue"];
      n.color = colors[i % 3];
    });
    this.draw();
  }

  draw() {
    if (!this.ctx) return;

    const ctx = this.ctx;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Dibujar nodos
    this.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.stroke();
    });
  }
}

export default new GraphController();
