export default class render {
  constructor() {
    this.canvas = document.getElementById('canvas-world');
    this.canvas.width = 400;
    this.canvas.height = 400;

    this.canvasServer = document.getElementById('canvas-server');
    this.canvasServer.width = 400;
    this.canvasServer.height = 400;
  }

  render(world, latency, server) {
    if (!server) {
      const ctx = this.canvas.getContext('2d');
      ctx.clearRect(0, 0, 400, 400);
      //render Ping
      if (latency) {
        latency.forEach((ping, index) => {
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "red";
          ctx.fillStyle = null;
          ctx.moveTo(5 + (index * (5)), 400);
          ctx.lineTo(5 + (index * (5)), 400 - (ping[0]) - 1);
          ctx.fill();
          ctx.stroke();
          ctx.beginPath();
          ctx.lineWidth = 3;
          ctx.strokeStyle = "#00FF41";
          ctx.fillStyle = null;
          ctx.moveTo(5 + (index * (5)), 400 - (ping[0]));
          ctx.lineTo(5 + (index * (5)), 400 - (ping[0] + ping[1]));
          ctx.fill();
          ctx.stroke();
        });
      }
      //!Render each entities/object of the world
      if (world) {
        world.forEach(entity => {
          entity.render(ctx, entity.position, entity.size, entity.color);
        });
      }
    } else {
      const ctxServer = this.canvasServer.getContext('2d');
      ctxServer.clearRect(0, 0, 400, 400);
      if (world) {
        world.forEach(entity => {
          const position = entity.position;
          ctxServer.beginPath();
          ctxServer.lineWidth = 1;
          ctxServer.strokeStyle = "black";
          ctxServer.fillStyle = 'red';
          ctxServer.arc(position.x, position.y, 5, 0, 2 * Math.PI, false);
          ctxServer.fill();
          ctxServer.stroke();
        });
      }



    }



  }
}


