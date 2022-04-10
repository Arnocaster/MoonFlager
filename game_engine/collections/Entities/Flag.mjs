export function flag() {
  return {
    position : {x: 250, y: 250},
    color : `rgb(${parseInt(Math.random() * 255)}, 
                ${parseInt(Math.random() * 255)},
                ${parseInt(Math.random() * 255)})`,
    physx : {
      material : {x:0.5,y:0.5,z:0.5},
      model : {
        type : "dynamic",
        shape: "box"
      }
    },
    usage : (equipedEntity) =>{
      equipedEntity.drop(equipedEntity);
    },
    render : (ctx,position,color) => {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "black";
      ctx.fillStyle = color;
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(position.x, position.y - 16);
      ctx.lineTo(position.x + 5, position.y - 13);
      ctx.lineTo(position.x + 5, position.y - 10);
      ctx.fill();
      ctx.stroke();
    }
  }
}