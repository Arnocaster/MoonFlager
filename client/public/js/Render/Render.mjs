export default class render {
  constructor() {
    this.canvas = document.getElementById('canvas-world');
    this.canvas.width = 400;
    this.canvas.height = 400;
  }

  render(world, latency) {
    const ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, 400, 400);
    //render Ping
    if (latency) {
      //console.log(latency);
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
       console.log(world.en);
      // Object.keys(world).forEach(element => {
      //   const entities = world[element]
      //   entities.forEach(entitie => {
      //     //!GET Entitie.RENDER();
      //     entitie.render(ctx);
      //   })
      // });
    }
  }
}


