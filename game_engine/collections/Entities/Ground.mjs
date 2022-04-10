export function ground() {
  return {
    position : {x: 0, y: 0},
    size: {x:400,y:400,z:0.5},
    color : 'rgb(240,240,240)',
    physx : {
      material : {x:0.5,y:0.5,z:0.5},
      model : {
        type : "static",
        shape: "box"
      }
    },
    render : (ctx,position,size,color) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.fillStyle = color;
      ctx.rect(position.x,position.y,size.x,size.y);
      ctx.fill();
      ctx.stroke();
    }
  }
}