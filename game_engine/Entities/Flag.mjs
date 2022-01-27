export function flag() {
  return {
    position : {x: 250, y: 250},
    color : `rgb(${parseInt(Math.random() * 255)}, 
                ${parseInt(Math.random() * 255)},
                ${parseInt(Math.random() * 255)})`,
    usage : (entity) =>{
      entity.drop();
    },
    render : (ctx) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.fillStyle = this.color;
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 16);
      ctx.lineTo(x + 5, y - 13);
      ctx.lineTo(x + 5, y - 10);
      ctx.fill();
      ctx.stroke();
    }
  }
}